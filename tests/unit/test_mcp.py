import asyncio
import tempfile
import unittest
from pathlib import Path

from c4.mcp_server import create_server


class MCPToolsTests(unittest.TestCase):
    def test_only_four_readonly_tools(self):
        with tempfile.TemporaryDirectory() as root:
            tools = asyncio.run(create_server(Path(root)).list_tools())
            self.assertEqual({tool.name for tool in tools}, {
                'list_incidents', 'get_incident', 'get_report', 'get_evaluation'})
            self.assertTrue(all(tool.annotations.readOnlyHint for tool in tools))
            self.assertTrue(all(not tool.annotations.destructiveHint for tool in tools))

    def test_rejects_traversal_and_oversized_page_without_writes(self):
        with tempfile.TemporaryDirectory() as root:
            server = create_server(Path(root))
            for name, args in [('get_incident', {'incident_id': '../secret'}),
                               ('list_incidents', {'limit': 101})]:
                with self.assertRaises(Exception):
                    asyncio.run(server.call_tool(name, args))
            self.assertEqual(list(Path(root).rglob('*')), [])

    def test_empty_evidence_returns_empty_page(self):
        with tempfile.TemporaryDirectory() as root:
            result = asyncio.run(create_server(Path(root)).call_tool('list_incidents', {}))
            self.assertIn('items', str(result))
            self.assertEqual(list(Path(root).rglob('*')), [])
