# Flujo Git obligatorio
Decisión de Deimer: 2026-10-11. Rama predeterminada e integración: develop.
## Ramas
Actualizar develop antes de crear rama. Codex: codex/feat-c4-002-contracts; Santiago: santiago/feat-c4-004-dashboard.
Correcciones: codex/fix-<id>-<tema>; documentación: codex/docs-<id>-<tema>.
Cada rama aborda una tarea y abre PR hacia develop. Main conserva referencia inicial; releases se acordarán cuando exista producto.
No hacer push directo de features a develop. Contratos requieren revisión de ambos.
## Commits
Formato type(scope): emoji descripción. Scope opcional. ! indica incompatibilidad con explicación BREAKING CHANGE en cuerpo.
| Tipo | Emoji | Ejemplo |
|---|---|---|
| feat | ✨ | feat(api): ✨ registrar ejecuciones |
| fix | 🐛 | fix(evals): 🐛 rechazar regresiones |
| docs | 📝 | docs(workflow): 📝 documentar develop |
| refactor | ♻️ | refactor(core): ♻️ compartir servicios |
| test | 🧪 | test(evals): 🧪 cubrir fallos |
| chore | 🔧 | chore(repo): 🔧 actualizar configuración |
| ci | 👷 | ci(checks): 👷 validar commits |
| perf | ⚡ | perf(worker): ⚡ reducir consultas |
| build | 📦 | build(api): 📦 fijar dependencias |
| revert | ⏪ | revert(api): ⏪ revertir cambio |

Un commit por propósito; títulos de PR con mismo formato para squash.
## Validación
Activar hook por clon: git config --local core.hooksPath .githooks.
Python 3 valida cada mensaje. python scripts/verify_commits.py --base origin/develop comprueba commits de la feature.
GitHub Actions valida documentación y commits de PR hacia develop.
El commit bootstrap original es convencional sin emoji; cambiarlo requiere decisión explícita de Deimer.
GitHub devolvió 403 para branch protection en el repo privado del plan actual. Validación CI y revisión mediante PR se aplican operativamente; no implican protección obligatoria del servidor.
## Revisión
PR pequeño → validaciones → revisión cruzada → integración.
No fusionar cambios de contratos sin aprobación del otro responsable.
