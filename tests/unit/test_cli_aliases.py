import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from typer.testing import CliRunner

from c4.cli import app
from c4.services.storage import Store


class CliAliasesTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.store_dir = Path(self.tmp.name) / 'runs'
        self.store = Store(self.store_dir)
        self.env_file = Path(self.tmp.name) / '.env'
        self.env_file.write_text('C4_GROK_BASE_URL=https://grok.example/v1\nC4_GROK_MODEL=grok-test\nC4_GROK_API_KEY=grok-secret\n', encoding='utf-8')
        self.runner = CliRunner()

    def test_r_alias_help_and_dispatch(self):
        result = self.runner.invoke(app, ['r', '--help'])
        self.assertEqual(result.exit_code, 0)
        self.assertIn('Atajo: ejecutar ciclo completo', result.output)

    def test_d_alias_executes_doctor(self):
        with patch('c4.cli.doctor') as mock_doctor:
            result = self.runner.invoke(app, ['--store', str(self.store_dir), '--env-file', str(self.env_file), 'd'])
            self.assertEqual(result.exit_code, 0)
            mock_doctor.assert_called_once()

    def test_s_alias_shows_status_json(self):
        sid = 'c4_' + 'e' * 32
        self.store.save({
            'id': sid,
            'provider': {'base_url': 'https://grok.example/v1', 'model': 'grok-test'},
            'job': {'status': 'succeeded', 'stage': 'report'},
            'report': {'decision': 'accepted'},
            'calls': [{}]
        })
        result = self.runner.invoke(app, ['--store', str(self.store_dir), '--env-file', str(self.env_file), '--json', 's'])
        self.assertEqual(result.exit_code, 0)
        payload = json.loads(result.output)
        self.assertIn('latest_sessions', payload)
        self.assertIn('target_provider', payload)
        self.assertEqual(len(payload['latest_sessions']), 1)
        self.assertEqual(payload['latest_sessions'][0]['id'], sid)

    def test_i_alias_reads_last_session(self):
        sid = 'c4_' + 'f' * 32
        self.store.save({
            'id': sid,
            'provider': {'base_url': 'https://grok.example/v1', 'model': 'grok-test'},
            'job': {'status': 'succeeded', 'stage': 'report'},
            'report': {'decision': 'accepted'},
            'calls': [{}]
        })
        result = self.runner.invoke(app, ['--store', str(self.store_dir), '--env-file', str(self.env_file), '--json', 'i', 'last'])
        self.assertEqual(result.exit_code, 0)
        payload = json.loads(result.output)
        self.assertEqual(payload['id'], sid)


if __name__ == '__main__':
    unittest.main()
