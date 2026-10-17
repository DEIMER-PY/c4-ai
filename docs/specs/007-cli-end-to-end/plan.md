# Plan
1. Sincronizar develop y revisar entrega C4-004. Conservar ownership de apps/dashboard.
2. Sanear .env.example y añadir verificación de plantillas sin secretos. No reescribir historia compartida.
3. Incorporar httpx, Typer, Rich y python-dotenv con lock; c4.cli como entrada y c4.services.reliability como servicio reutilizable.
4. Gateway devuelve JSON estricto y usage; errores tipados sin cuerpo HTTP. No reintentos automáticos costosos. Datos sintéticos enviados solo al gateway del reto configurado.
5. Almacén de archivos por sesión en artifacts/runs/<id>, checkpoint atómico por fase; reutilizar modelos v1 para entidades. Manifest incluye checksum, procedencia y límites. PostgreSQL sigue pendiente en C4-002.
6. Demo ejecuta agente baseline, inspecciona, diagnostica, genera candidato, evalúa mismo dataset y aplica gate determinista. Comandos por etapa recuperan sesión del disco sin llamadas ocultas al consultar.
7. Pruebas con transporte HTTP controlado + CLI; luego ensayo real limitado, documento de evidencia saneado y PR hacia develop. Revisión de contratos corresponde a ambos si fuera necesaria; no se alteran en esta feature.

## Archivos declarados
pyproject.toml, uv.lock, .env.example, c4/cli.py, c4/services/reliability.py, c4/services/storage.py, c4/tools/grok.py, c4/tools/refunds.py, tests/unit/test_reliability.py, apps/cli/README.md, docs/specs/007-cli-end-to-end, docs/equipo/ESTADO.md, docs/equipo/BACKLOG.md, docs/producto/ENTREGA_S1.md, docs/arquitectura/CLI.md, docs/decisiones/ADR-002-desktop.md, README.md, scripts/verify_docs.py. No modificar frontend de Santiago.

Documentación de integración adicional: docs/README.md, docs/specs/README.md, docs/arquitectura/API.md (solo enlace explicativo), docs/arquitectura/INSTALACION.md y docs/evidencia/2026-10-17-cli.json. El contrato wire no se altera.
