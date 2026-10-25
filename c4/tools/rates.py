"""Deterministic token pricing table and cost calculations.
Ensures zero cost for local models and exact USD attribution for providers.
"""
from typing import Mapping

# Rates in USD per 1,000,000 tokens (effective October 2026)
RATES_PER_MILLION: Mapping[str, Mapping[str, float]] = {
    # xAI Grok
    "grok-4.7": {"input": 2.00, "output": 10.00},
    "grok-beta": {"input": 5.00, "output": 15.00},
    # Groq target models
    "qwen/qwen-2.5-coder-32b": {"input": 0.59, "output": 0.79},
    "llama-3.3-70b-versatile": {"input": 0.59, "output": 0.79},
    "llama-3.1-70b-versatile": {"input": 0.59, "output": 0.79},
    "llama-3.1-8b-instant": {"input": 0.05, "output": 0.08},
    # DeepSeek API
    "deepseek-chat": {"input": 0.14, "output": 0.28},
    "deepseek-reasoner": {"input": 0.55, "output": 2.19},
    # Ollama / Local inference
    "ollama": {"input": 0.00, "output": 0.00},
}

# TypeSafe JEV fixed transaction fee per call (no autoregressive tokens)
JEV_FIXED_CALL_COST_USD = 0.0001


def normalize_model_key(model: str) -> str:
    """Normalize model string to match rate catalog key."""
    cleaned = model.strip().lower()
    for key in RATES_PER_MILLION:
        if cleaned == key.lower() or cleaned.endswith("/" + key.lower()):
            return key
    return cleaned


def calculate_cost_usd(model: str, input_tokens: int | None, output_tokens: int | None, provider: str | None = None) -> float | None:
    """Calculate deterministic cost in USD given model and token counts.
    Returns None if rates are unknown or tokens are missing.
    Always returns 0.0 for ollama/local inference.
    """
    if provider == "ollama" or (model and "ollama" in model.lower()):
        return 0.0

    key = normalize_model_key(model)
    rate = RATES_PER_MILLION.get(key)
    if not rate:
        return None

    in_tok = input_tokens or 0
    out_tok = output_tokens or 0
    cost = (in_tok * rate["input"] + out_tok * rate["output"]) / 1_000_000.0
    return round(cost, 6)
