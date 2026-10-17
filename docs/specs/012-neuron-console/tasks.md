# Tareas
Responsable: Deimer/Codex. Dependencias: consola spec010 y guía spec011. Archivos declarados en plan.md.

- [x] AC-001: neurona detallada original y gradiente.
- [x] AC-002: diseño ancho/estrecho y fallback ASCII.
- [x] AC-003: datos reales, prompt y barra inferior.
- [x] AC-004: pruebas, revisión visual y documentación.
- [x] PR25 hacia develop y quality aprobada en run39048755375; evidencia local registrada.

Evidencia: 54 pruebas Python aprobadas; verify_docs aprobó 100 Markdown, 11 JSON y 15 SVG. Revisadas exportaciones del renderer real a 132 y 60 columnas (artifacts/c4-ai-neuron-console.png y c4-ai-neuron-compact.png, locales). Probadas anchuras 40/60/115/116/132/160 y codificación ASCII; sin nuevas solicitudes a proveedores. Los temporales de prueba se ubicaron en artifacts/test-tmp por restricciones de permisos del sandbox de Windows.

Ensayo PTY Windows: consola con target Groq abrió sin solicitudes a proveedores. El host no entregó la entrada /quit durante el ensayo y se cerró el proceso con Ctrl+C. La salida normal, comandos y recuperación se verificaron en pruebas automatizadas; no se afirma validación manual de teclado nativo.
