import os
import unittest
from unittest.mock import patch

from c4.server import main


class ServerLauncherTests(unittest.TestCase):
    def test_loopback_and_store_are_preserved(self):
        with patch.dict(os.environ,{},clear=True),patch('sys.argv',['c4-api','--port','8123','--store','local-evidence']),patch('c4.server.uvicorn.run') as run:
            main()
            self.assertEqual(os.environ['C4_STORE'],'local-evidence')
            self.assertEqual(run.call_args.kwargs['host'],'127.0.0.1')
            self.assertEqual(run.call_args.kwargs['port'],8123)
            self.assertEqual(run.call_args.kwargs['loop'],'c4.server:local_loop')

    def test_invalid_ports_and_public_binding_are_rejected(self):
        for args in (['--port','0'],['--port','65536'],['--host','0.0.0.0']):
            with self.subTest(args=args),patch('sys.argv',['c4-api',*args]),patch('c4.server.uvicorn.run') as run:
                with self.assertRaises(SystemExit) as error:main()
                self.assertEqual(error.exception.code,2)
                run.assert_not_called()
