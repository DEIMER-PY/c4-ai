"""Unit tests for the high-volume batch runner, resilience engine, and circuit breaker."""
import time
import unittest

from c4.services.batch import (
    BatchConfig,
    BatchRunner,
    CircuitBreaker,
    CircuitBreakerState,
    calculate_percentile,
)


class TestBatchResilience(unittest.TestCase):
    def test_circuit_breaker_lifecycle(self):
        breaker = CircuitBreaker(failure_threshold=3, recovery_timeout_sec=0.1)
        self.assertEqual(breaker.state, CircuitBreakerState.CLOSED)
        self.assertTrue(breaker.can_execute())

        # Record 2 failures - still closed
        breaker.record_failure()
        breaker.record_failure()
        self.assertEqual(breaker.state, CircuitBreakerState.CLOSED)
        self.assertTrue(breaker.can_execute())

        # 3rd failure trips the breaker
        breaker.record_failure()
        self.assertEqual(breaker.state, CircuitBreakerState.OPEN)
        self.assertFalse(breaker.can_execute())
        self.assertEqual(breaker.trips_count, 1)

        # Wait for recovery timeout
        time.sleep(0.12)
        # Should now allow probe in HALF_OPEN
        self.assertTrue(breaker.can_execute())
        self.assertEqual(breaker.state, CircuitBreakerState.HALF_OPEN)

        # Successful probe resets to CLOSED
        breaker.record_success()
        self.assertEqual(breaker.state, CircuitBreakerState.CLOSED)
        self.assertEqual(breaker.consecutive_failures, 0)

    def test_percentile_calculation_deterministic(self):
        values = [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0]
        p50 = calculate_percentile(values, 50.0)
        p90 = calculate_percentile(values, 90.0)
        p99 = calculate_percentile(values, 99.0)

        self.assertAlmostEqual(p50, 55.0, delta=1.0)
        self.assertAlmostEqual(p90, 91.0, delta=1.0)
        self.assertGreater(p99, 95.0)

        # Empty list handling
        self.assertEqual(calculate_percentile([], 50.0), 0.0)

    def test_batch_runner_execution_100_units(self):
        runner = BatchRunner()
        config = BatchConfig(
            dataset_path="datasets/sample/refunds_v2.json",
            total_units=100,
            concurrency=5,
            mock_providers=True,
            model="grok-4.7",
            provider="xai",
        )
        metrics = runner.run(config)

        self.assertEqual(metrics.total_scheduled, 100)
        self.assertEqual(metrics.total_completed, 100)
        self.assertGreaterEqual(metrics.success_rate_percent, 95.0)
        self.assertGreater(metrics.total_tokens, 0)
        self.assertGreater(metrics.total_cost_usd, 0.0)
        self.assertGreater(metrics.latency_p50_ms, 0.0)
        self.assertGreater(metrics.latency_p95_ms, 0.0)
        self.assertGreater(metrics.latency_p99_ms, 0.0)
        self.assertGreater(metrics.throughput_units_per_sec, 0.0)

        as_dict = metrics.to_dict()
        self.assertIn("throughput_units_per_sec", as_dict)
        self.assertIn("latency_p95_ms", as_dict)

    def test_batch_runner_budget_ceiling_protection(self):
        runner = BatchRunner()
        # Set a tiny ceiling that will trip after very few requests
        config = BatchConfig(
            dataset_path="datasets/sample/refunds_v2.json",
            total_units=100,
            concurrency=2,
            mock_providers=True,
            budget_ceiling_usd=0.005,
            model="grok-4.7",
        )
        metrics = runner.run(config)

        # Should stop before finishing 100 units
        self.assertLess(metrics.total_completed, 100)
        self.assertLessEqual(metrics.total_cost_usd, 0.02)  # Protected against large spend

    def test_pre_tripped_circuit_breaker_protects_gateway(self):
        breaker = CircuitBreaker(failure_threshold=1, recovery_timeout_sec=10.0)
        breaker.record_failure()  # Trips immediately
        self.assertEqual(breaker.state, CircuitBreakerState.OPEN)

        runner = BatchRunner(breaker=breaker)
        config = BatchConfig(
            dataset_path="datasets/sample/refunds_v2.json",
            total_units=10,
            concurrency=2,
            mock_providers=True,
        )
        metrics = runner.run(config)

        # All units should fail safely due to open circuit
        self.assertEqual(metrics.total_succeeded, 0)
        self.assertEqual(metrics.total_failed, 10)
        self.assertEqual(metrics.results[0].error_message, "Circuit breaker open")


if __name__ == "__main__":
    unittest.main()
