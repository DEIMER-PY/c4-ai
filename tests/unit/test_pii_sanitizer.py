"""Unit tests for the PII and secret sanitization engine."""
import unittest

from c4.tools.sanitizer import PiiSanitizer, sanitize_payload, sanitize_text


class TestPiiSanitizer(unittest.TestCase):
    def setUp(self):
        self.sanitizer = PiiSanitizer()

    def test_sanitize_emails(self):
        raw = "Contact support at customer.service@example.com or lead_dev@corp.ai for help."
        cleaned, events = self.sanitizer.sanitize_text(raw)
        self.assertNotIn("customer.service@example.com", cleaned)
        self.assertNotIn("lead_dev@corp.ai", cleaned)
        self.assertEqual(cleaned.count("[EMAIL_REDACTED]"), 2)
        self.assertEqual(events[0]["entity_type"], "email")
        self.assertEqual(events[0]["count"], 2)

    def test_sanitize_credit_cards(self):
        raw = "Processing refund to card 4532-1234-5678-9012 and backup 5425123412341234."
        cleaned, events = self.sanitizer.sanitize_text(raw)
        self.assertNotIn("4532-1234-5678-9012", cleaned)
        self.assertNotIn("5425123412341234", cleaned)
        self.assertIn("[CREDIT_CARD_REDACTED]", cleaned)

    def test_sanitize_api_keys_and_bearer_tokens(self):
        raw = "Using auth header Bearer sk-ant-api03-abcdef1234567890abcdef and gsk_999988887777666655554444."
        cleaned, _ = self.sanitizer.sanitize_text(raw)
        self.assertNotIn("sk-ant-api03-abcdef1234567890abcdef", cleaned)
        self.assertNotIn("gsk_999988887777666655554444", cleaned)
        self.assertIn("[SECRET_KEY_REDACTED]", cleaned)

    def test_sanitize_phone_and_ssn(self):
        raw = "Customer SSN is 123-45-6789 and mobile is +1-555-867-5309."
        cleaned, _ = self.sanitizer.sanitize_text(raw)
        self.assertNotIn("123-45-6789", cleaned)
        self.assertNotIn("+1-555-867-5309", cleaned)
        self.assertIn("[SSN_REDACTED]", cleaned)
        self.assertIn("[PHONE_REDACTED]", cleaned)

    def test_recursive_payload_sanitization(self):
        payload = {
            "order_id": "ORD-123",
            "customer": {
                "email": "alice@wonderland.org",
                "payment": "4532-8888-9999-1111",
            },
            "tags": ["vip", "contact: bob@builder.com"],
            "amount": 99.95,
        }
        clean = sanitize_payload(payload)

        self.assertEqual(clean["order_id"], "ORD-123")
        self.assertEqual(clean["amount"], 99.95)
        self.assertEqual(clean["customer"]["email"], "[EMAIL_REDACTED]")
        self.assertEqual(clean["customer"]["payment"], "[CREDIT_CARD_REDACTED]")
        self.assertIn("[EMAIL_REDACTED]", clean["tags"][1])


if __name__ == "__main__":
    unittest.main()
