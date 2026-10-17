# Plan
1. Revisar CLI, servicio y documentación para describir los roles reales sin alterar el gate.
2. Crear docs/equipo/PRUEBAS_INTEGRACIONES.md con comandos PowerShell desde la raíz, target explícito y resultados observables.
3. Corregir referencia obsoleta a TUI pendiente y aclarar que C4_TARGET_PROVIDER es una variable del proceso; el selector explícito evita depender del entorno.
4. Enlazar guía en README.md, docs/README.md, docs/equipo/ESTADO.md y docs/specs/README.md.
5. Validar AC con verify_docs, doctor sin probe y lectura de evidencia local; publicar PR documental hacia develop.

Ownership: Deimer/Codex en los archivos anteriores y esta spec. No cambios en apps/dashboard, esquemas ni endpoints compartidos.
