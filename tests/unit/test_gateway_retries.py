"""Gateway retries transient provider failures within budget and records every attempt."""
import json
import unittest

import httpx

from c4.tools.grok import Gateway, Settings, WorkflowError


def gateway(responses, max_calls=8, retries=2):
    queue = list(responses)

    def handler(request):
        item = queue.pop(0)
        if isinstance(item, Exception):
            raise item
        return item
    settings = Settings('https://grok.example/v1', 'grok-4.7', 'secret-key', max_calls=max_calls,
                        max_retries=retries, retry_backoff_seconds=0)
    return Gateway(settings, httpx.Client(transport=httpx.MockTransport(handler)))


def ok():
    return httpx.Response(200, json={'choices': [{'message': {'content': json.dumps({'ok': True})}}],
                                     'usage': {'prompt_tokens': 10, 'completion_tokens': 1}})


class GatewayRetryTests(unittest.TestCase):
    def test_timeout_then_success_is_recorded_as_two_attempts(self):
        request = httpx.Request('POST', 'https://grok.example/v1/chat/completions')
        g = gateway([httpx.ReadTimeout('slow', request=request), ok()])
        self.assertEqual(g.complete('s', {}, 'p'), {'ok': True})
        self.assertEqual([(r['status'], r['attempt']) for r in g.records], [('failed', 1), ('succeeded', 2)])

    def test_server_error_retries_but_rate_limit_does_not(self):
        g = gateway([httpx.Response(503), ok()])
        self.assertEqual(g.complete('s', {}, 'p'), {'ok': True})
        g = gateway([httpx.Response(429), ok()])
        with self.assertRaises(WorkflowError) as ctx:
            g.complete('s', {}, 'p')
        self.assertTrue(ctx.exception.retryable)
        self.assertEqual(len(g.records), 1)

    def test_retries_never_exceed_call_budget_or_retry_limit(self):
        g = gateway([httpx.Response(500)] * 5, max_calls=2)
        with self.assertRaises(WorkflowError):
            g.complete('s', {}, 'p')
        self.assertEqual(len(g.records), 2)
        g = gateway([httpx.Response(500)] * 5, retries=1)
        with self.assertRaises(WorkflowError):
            g.complete('s', {}, 'p')
        self.assertEqual(len(g.records), 2)

    def test_invalid_output_is_not_retried(self):
        bad = httpx.Response(200, json={'choices': [{'message': {'content': 'not json'}}]})
        g = gateway([bad, ok()])
        with self.assertRaises(WorkflowError) as ctx:
            g.complete('s', {}, 'p')
        self.assertEqual(ctx.exception.code, 'invalid_model_output')
        self.assertEqual(len(g.records), 1)


if __name__ == '__main__':
    unittest.main()
