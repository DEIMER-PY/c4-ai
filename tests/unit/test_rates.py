import unittest
from c4.tools.rates import calculate_cost_usd, RATES_PER_MILLION, normalize_model_key


class TestRates(unittest.TestCase):
    def test_grok_cost_calculation(self):
        # 1000 input tokens * $2.00/M = $0.002
        # 500 output tokens * $10.00/M = $0.005
        # Total = $0.007
        cost = calculate_cost_usd("grok-4.7", 1000, 500)
        self.assertEqual(cost, 0.007)

    def test_groq_qwen_cost_calculation(self):
        # 1000 in * $0.59/M = 0.00059
        # 1000 out * $0.79/M = 0.00079
        # Total = 0.00138
        cost = calculate_cost_usd("qwen/qwen-2.5-coder-32b", 1000, 1000)
        self.assertEqual(cost, 0.00138)

    def test_ollama_zero_cost(self):
        cost = calculate_cost_usd("qwen2.5:7b", 10000, 5000, provider="ollama")
        self.assertEqual(cost, 0.0)

    def test_unknown_model_returns_none(self):
        cost = calculate_cost_usd("unknown-model-xyz", 1000, 500)
        self.assertIsNone(cost)

    def test_zero_tokens(self):
        cost = calculate_cost_usd("grok-4.7", 0, 0)
        self.assertEqual(cost, 0.0)


if __name__ == "__main__":
    unittest.main()
