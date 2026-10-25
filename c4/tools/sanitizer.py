"""PII (Personally Identifiable Information) and credential sanitization engine.
Protects audit logs, datasets, and traces from leaking private customer data or API keys.
"""
import re
from typing import Any

# Regex patterns for high-sensitivity data detection
EMAIL_REGEX = re.compile(
    r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}\b",
    re.IGNORECASE,
)

# Standard credit card formats: 13 to 16 digits, with optional hyphens or spaces
CREDIT_CARD_REGEX = re.compile(
    r"\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{13,16}\b",
)

# Bearer tokens, OpenAI keys, Groq keys, generic API tokens
API_KEY_REGEX = re.compile(
    r"(?i)\b(?:Bearer\s+[a-zA-Z0-9_\-\.]{16,}|(?:sk|gsk|c4)_[a-zA-Z0-9_\-]{20,}|api[_-]?key[\s:=]+['\"]?[a-zA-Z0-9_\-\.]{16,}['\"]?)",
)

# Phone numbers (US/International format)
PHONE_REGEX = re.compile(
    r"\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
)

# Social Security Numbers (SSN)
SSN_REGEX = re.compile(
    r"\b\d{3}-\d{2}-\d{4}\b",
)


class PiiSanitizer:
    """Deterministically detects and redacts sensitive PII and authentication secrets."""

    def __init__(self):
        self.rules = [
            ("api_key", API_KEY_REGEX, "[SECRET_KEY_REDACTED]"),
            ("email", EMAIL_REGEX, "[EMAIL_REDACTED]"),
            ("credit_card", CREDIT_CARD_REGEX, "[CREDIT_CARD_REDACTED]"),
            ("ssn", SSN_REGEX, "[SSN_REDACTED]"),
            ("phone", PHONE_REGEX, "[PHONE_REDACTED]"),
        ]

    def sanitize_text(self, text: str) -> tuple[str, list[dict[str, Any]]]:
        """Redacts PII from text and logs detected entity types without leaking the values."""
        if not text or not isinstance(text, str):
            return text, []

        sanitized = text
        events: list[dict[str, Any]] = []

        for entity_type, pattern, replacement in self.rules:
            matches = list(pattern.finditer(sanitized))
            if matches:
                events.append({
                    "entity_type": entity_type,
                    "count": len(matches),
                })
                sanitized = pattern.sub(replacement, sanitized)

        return sanitized, events

    def sanitize_payload(self, data: Any) -> Any:
        """Recursively sanitizes dictionaries, lists, and primitives."""
        if isinstance(data, dict):
            return {k: self.sanitize_payload(v) for k, v in data.items()}
        elif isinstance(data, list):
            return [self.sanitize_payload(item) for item in data]
        elif isinstance(data, str):
            clean_text, _ = self.sanitize_text(data)
            return clean_text
        return data


_GLOBAL_SANITIZER = PiiSanitizer()


def sanitize_text(text: str) -> str:
    clean, _ = _GLOBAL_SANITIZER.sanitize_text(text)
    return clean


def sanitize_payload(data: Any) -> Any:
    return _GLOBAL_SANITIZER.sanitize_payload(data)
