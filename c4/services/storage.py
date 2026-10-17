"""Single-writer local checkpoints. PostgreSQL/workers remain separate tasks."""
import json
import os
import re
import tempfile
from time import sleep
from contextlib import contextmanager
from pathlib import Path

from c4.tools.grok import WorkflowError


class Store:
    def __init__(self, root: Path):
        self.root = root

    def path(self, session_id: str) -> Path:
        if not re.fullmatch(r'c4_[a-f0-9]{32}', session_id):
            raise WorkflowError('invalid_id', 'ID de sesión inválido.')
        return self.root / session_id / 'evidence.json'

    def save(self, state: dict) -> None:
        path = self.path(state['id'])
        path.parent.mkdir(parents=True, exist_ok=True)
        fd, temporary = tempfile.mkstemp(dir=path.parent, suffix='.tmp')
        try:
            with os.fdopen(fd, 'w', encoding='utf-8') as stream:
                json.dump(state, stream, indent=2, ensure_ascii=False, allow_nan=False)
                stream.flush()
                os.fsync(stream.fileno())
            # Windows scanners can briefly hold the destination after a read/write.
            # Keep atomic replacement; never fall back to truncating the checkpoint.
            for attempt in range(4):
                try:
                    os.replace(temporary, path)
                    break
                except PermissionError:
                    if attempt == 3:
                        raise
                    sleep(0.02 * (2 ** attempt))
        finally:
            if os.path.exists(temporary):
                os.unlink(temporary)

    @contextmanager
    def lock(self, session_id: str):
        lock_path = self.path(session_id).with_suffix('.lock')
        lock_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            fd = os.open(lock_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        except FileExistsError:
            raise WorkflowError('session_busy', 'Sesión ocupada. Tras un cierre abrupto, verifica el proceso antes de retirar evidence.lock.') from None
        try:
            os.close(fd)
            yield
        finally:
            lock_path.unlink(missing_ok=True)

    def load(self, session_id: str) -> dict:
        try:
            return json.loads(self.path(session_id).read_text(encoding='utf-8'))
        except FileNotFoundError:
            raise WorkflowError('not_found', 'Sesión no encontrada en el directorio de evidencia.') from None
        except (ValueError, OSError):
            raise WorkflowError('invalid_evidence', 'No se puede leer el archivo de evidencia.') from None
