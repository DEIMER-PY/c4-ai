# Tareas
Responsable Deimer/Codex, integración frontend solicitada por Deimer; Santiago conserva ownership de mantenimiento posterior.
- [x] AC-001: adaptador HTTP y selección api/demo.
- [x] AC-002: evidencia real, paginación y estados parciales/fallos.
- [x] AC-003: diseño responsive y capturas.
- [x] AC-004: suite/build/checklist React y flujo navegador/API verificado.
- [ ] Documentar alcance y PR hacia develop; sin cambiar contratos compartidos.

- [x] AC-005: c4-api restringido a loopback; 48 consultas HTTP concurrentes aprobadas.
Evidencia: 37 pruebas frontend, build/typecheck/lint; checklist React revisado (servidor para datos, Promise.all independientes, Suspense, etiquetas accesibles, reduced-motion y sin claves cliente). Capturas 1440×1000, 820×1180, 390×844; móvil sin desbordamiento del main. Nueva sesión Grok accepted aparece por API y navegador con mejora 5/6→6/6. Se observó 503 real por WinError64 y se verificó recuperación sin fixtures. Sin endpoints nuevos ni cambios de contrato v1.
