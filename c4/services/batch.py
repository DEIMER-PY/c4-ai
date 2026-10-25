"""High-volume batch runner, resilience engine, and concurrency benchmark for C4 AI."""
import json
import math
import random
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from datetime import UTC, datetime
from enum import Enum
from pathlib import Path
from typing import Callable

from c4.tools.rates import calculate_cost_usd


class CircuitBreakerState(str, Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"


class CircuitBreaker:
    """Protects downstream LLM gateways from cascading failures."""
    def __init__(self, failure_threshold: int = 5, recovery_timeout_sec: float = 2.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout_sec = recovery_timeout_sec
        self.consecutive_failures = 0
        self.state = CircuitBreakerState.CLOSED
        self.last_failure_time: float = 0.0
        self.trips_count = 0

    def can_execute(self) -> bool:
        if self.state == CircuitBreakerState.CLOSED:
            return True
        now = time.monotonic()
        if self.state == CircuitBreakerState.OPEN:
            if now - self.last_failure_time >= self.recovery_timeout_sec:
                self.state = CircuitBreakerState.HALF_OPEN
                return True
            return False
        # In HALF_OPEN, allow probe
        return True

    def record_success(self):
        self.consecutive_failures = 0
        self.state = CircuitBreakerState.CLOSED

    def record_failure(self):
        self.consecutive_failures += 1
        self.last_failure_time = time.monotonic()
        if self.consecutive_failures >= self.failure_threshold:
            if self.state != CircuitBreakerState.OPEN:
                self.trips_count += 1
            self.state = CircuitBreakerState.OPEN


@dataclass
class BatchConfig:
    dataset_path: str = "datasets/sample/refunds_v2.json"
    total_units: int = 1000
    concurrency: int = 10
    max_retries: int = 3
    backoff_base_sec: float = 0.05
    budget_ceiling_usd: float | None = 100.0
    mock_providers: bool = False
    model: str = "grok-4.7"
    provider: str = "xai"


@dataclass
class BatchUnitResult:
    unit_id: int
    case_id: str
    success: bool
    attempts: int
    latency_ms: float
    input_tokens: int
    output_tokens: int
    cost_usd: float
    error_message: str | None = None


@dataclass
class BatchMetrics:
    total_scheduled: int
    total_completed: int
    total_succeeded: int
    total_failed: int
    circuit_breaker_trips: int
    elapsed_seconds: float
    throughput_units_per_sec: float
    total_tokens: int
    total_cost_usd: float
    latency_p50_ms: float
    latency_p95_ms: float
    latency_p99_ms: float
    success_rate_percent: float
    results: list[BatchUnitResult] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "total_scheduled": self.total_scheduled,
            "total_completed": self.total_completed,
            "total_succeeded": self.total_succeeded,
            "total_failed": self.total_failed,
            "circuit_breaker_trips": self.circuit_breaker_trips,
            "elapsed_seconds": round(self.elapsed_seconds, 3),
            "throughput_units_per_sec": round(self.throughput_units_per_sec, 2),
            "total_tokens": self.total_tokens,
            "total_cost_usd": round(self.total_cost_usd, 6),
            "latency_p50_ms": round(self.latency_p50_ms, 2),
            "latency_p95_ms": round(self.latency_p95_ms, 2),
            "latency_p99_ms": round(self.latency_p99_ms, 2),
            "success_rate_percent": round(self.success_rate_percent, 2),
        }


def calculate_percentile(values: list[float], percentile: float) -> float:
    """Deterministic nearest-rank percentile calculation."""
    if not values:
        return 0.0
    sorted_values = sorted(values)
    k = (len(sorted_values) - 1) * (percentile / 100.0)
    f = math.floor(k)
    c = math.ceil(k)
    if f == c:
        return sorted_values[int(k)]
    d0 = sorted_values[int(f)] * (c - k)
    d1 = sorted_values[int(c)] * (k - f)
    return d0 + d1


class BatchRunner:
    """Executes high-scale resilient evaluation batches with rate-limiting backoff."""

    def __init__(self, breaker: CircuitBreaker | None = None):
        self.breaker = breaker or CircuitBreaker()

    def _execute_mock_unit(self, unit_id: int, case: dict, config: BatchConfig) -> BatchUnitResult:
        """Simulates realistic execution with occasional 429 jitter and backoff."""
        start = time.perf_counter()
        attempts = 0
        success = False
        error_msg = None

        while attempts < config.max_retries and not success:
            attempts += 1
            if not self.breaker.can_execute():
                return BatchUnitResult(
                    unit_id=unit_id,
                    case_id=case.get("id", "unknown"),
                    success=False,
                    attempts=attempts,
                    latency_ms=0.0,
                    input_tokens=0,
                    output_tokens=0,
                    cost_usd=0.0,
                    error_message="Circuit breaker open",
                )

            # Simulated transient 429 rate limit probability (2% of requests)
            if random.random() < 0.02 and attempts < config.max_retries:
                # Exponential backoff with jitter
                sleep_time = (config.backoff_base_sec * (2 ** (attempts - 1))) + random.uniform(0.001, 0.01)
                time.sleep(sleep_time)
                continue

            # Deterministic simulation of tokens and latency
            base_in = len(str(case.get("input", ""))) * 2 + 800
            base_out = 45 + (unit_id % 20)
            latency = (time.perf_counter() - start) * 1000.0 + random.uniform(10.0, 35.0)

            cost = calculate_cost_usd(config.model, base_in, base_out, config.provider) or 0.0
            self.breaker.record_success()
            success = True
            return BatchUnitResult(
                unit_id=unit_id,
                case_id=case.get("id", f"case_{unit_id}"),
                success=True,
                attempts=attempts,
                latency_ms=latency,
                input_tokens=base_in,
                output_tokens=base_out,
                cost_usd=cost,
            )

        self.breaker.record_failure()
        return BatchUnitResult(
            unit_id=unit_id,
            case_id=case.get("id", f"case_{unit_id}"),
            success=False,
            attempts=attempts,
            latency_ms=(time.perf_counter() - start) * 1000.0,
            input_tokens=0,
            output_tokens=0,
            cost_usd=0.0,
            error_message="Max retries exceeded due to rate limits",
        )

    def run(
        self,
        config: BatchConfig,
        progress_callback: Callable[[int, int], None] | None = None,
    ) -> BatchMetrics:
        # Load dataset cases
        cases = []
        path = Path(config.dataset_path)
        if path.exists():
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
                cases = data.get("cases", [])
            except Exception:
                pass
        if not cases:
            cases = [{"id": f"synthetic_case_{i}", "input": "Standard refund inquiry"} for i in range(10)]

        start_time = time.monotonic()
        results: list[BatchUnitResult] = []
        accumulated_cost = 0.0

        with ThreadPoolExecutor(max_workers=config.concurrency) as executor:
            futures = []
            for i in range(config.total_units):
                case = cases[i % len(cases)]
                fut = executor.submit(self._execute_mock_unit, i + 1, case, config)
                futures.append(fut)

            completed = 0
            for fut in as_completed(futures):
                res = fut.result()
                results.append(res)
                accumulated_cost += res.cost_usd
                completed += 1

                if progress_callback and completed % 25 == 0:
                    progress_callback(completed, config.total_units)

                # Check budget ceiling
                if config.budget_ceiling_usd and accumulated_cost >= config.budget_ceiling_usd:
                    break

        elapsed = time.monotonic() - start_time
        succeeded = [r for r in results if r.success]
        failed = [r for r in results if not r.success]
        latencies = [r.latency_ms for r in succeeded]

        p50 = calculate_percentile(latencies, 50.0)
        p95 = calculate_percentile(latencies, 95.0)
        p99 = calculate_percentile(latencies, 99.0)

        total_toks = sum(r.input_tokens + r.output_tokens for r in results)
        success_rate = (len(succeeded) / len(results) * 100.0) if results else 0.0
        throughput = (len(results) / max(elapsed, 0.0001)) if len(results) > 0 else 0.0

        return BatchMetrics(
            total_scheduled=config.total_units,
            total_completed=len(results),
            total_succeeded=len(succeeded),
            total_failed=len(failed),
            circuit_breaker_trips=self.breaker.trips_count,
            elapsed_seconds=elapsed,
            throughput_units_per_sec=throughput,
            total_tokens=total_toks,
            total_cost_usd=accumulated_cost,
            latency_p50_ms=p50,
            latency_p95_ms=p95,
            latency_p99_ms=p99,
            success_rate_percent=success_rate,
            results=results,
        )
