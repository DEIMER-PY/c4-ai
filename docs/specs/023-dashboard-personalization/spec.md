# 023 — Personalización del dashboard

Estado: Implementing. Responsable: Deimer/Codex; revisión visual: Santiago/Claude.

FR-001 / AC-001: selector accesible de acento, fondo y superficie; conservar preferencias locales, restablecerlas y rechazar almacenamiento inválido. Mantener contraste legible del texto y los botones.

FR-002 / AC-002: laboratorio de datos editable con conteos válidos y comparación visual. Toda modificación será simulación local explícita, nunca escritura sobre baseline ni evidencia del API. Restablecer valores y no presentar un gate oficial.

FR-003 / AC-003: usar el sistema de componentes existente, diseño responsive y estados honestos. El enlace Figma OJyIbVaPJyYknr2023pQuw, nodo16900:14 corresponde a Introduction; los hijos inspeccionados son imágenes promocionales. El segundo enlace enviado por Deimer añade m=dev y conserva el mismo nodo; nueva consulta MCP confirma Introduction y el hijo16900:16 devuelve una imagen de presentación. La reproducción exacta de la pantalla CRM depende del enlace a su frame real y recursos/permisos disponibles. No declarar esa integración terminada.

FR-004 / AC-004: usar como referencia visual el nuevo enlace17:8006 indicado por Deimer. La consulta MCP identifica página Hello y frame Cover3826:69704, con portada Mega Chart Kit: violeta#723ceb y fondo#010101; no hay dashboard editable dentro de ese frame. Añadir presets claros/oscuros inspirados en esa referencia al selector existente y registrar procedencia. No reproducir la imagen promocional como interfaz ni presentar fidelidad exacta.

FR-005 / AC-005: aplicar la referencia frontend_design_stacks_tools_skill.md suministrada por Deimer. Preservar Next/React/TypeScript/Tailwind/shadcn/Lucide ya instalados; reconocer que los primitives actuales usan Base UI. La lista de stacks, animaciones e inspiración no exige instalarlos todos ni sustituir arquitectura. Conservar copia del documento y una guía de aplicación para Santiago/Claude, con criterios responsive, accesibilidad, rendimiento, licencia de recursos y verificación visual. Animaciones/dependencias nuevas requieren una necesidad concreta y revisión de su coste; el dashboard de evidencia no adopta efectos o scroll artificial por catálogo.

Archivos: components/dashboard-customizer.tsx, lib/dashboard-preferences.ts, app-shell.tsx, globals.css, app/delivery/page.tsx, pruebas de preferencias, documentación. No cambia contratos API. Dependencias: dashboard existente. Rama prevista codex/feat-023-dashboard-personalization → develop; publicación pendiente de resolver el bloqueo de revisión automática por cuota. Cambios locales separados de spec020.
