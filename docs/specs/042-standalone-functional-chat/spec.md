# Spec 042: Chat Funcional Independiente y Desacoplado del Sitio Web

## Contexto y Misión
El usuario ha solicitado de manera explícita:
1. **Eliminar el widget simulado genérico**: Quitar el popup flotante que estaba incrustado dentro del sitio web.
2. **Crear una aplicación web de Chat 100% independiente y funcional**:
   - Una interfaz a pantalla completa independiente sin barras de marketing ni footer promocional.
   - Conectada a datos y endpoints reales de la API local de C4 (`http://127.0.0.1:8000`) y al almacén de evidencia (`artifacts/runs`).
   - Carga dinámica de las sesiones e incidentes reales almacenados.
   - Análisis causal, extracción de diffs de parches reales y cálculo de veredictos del Decision Gate con firma SHA-256 sin datos genéricos ni inventados.

---

## Requisitos Funcionales (FR)
- **FR-001**: Quitar el componente `C4Chatbot` flotante de `apps/website/src/app/layout.tsx`.
- **FR-002**: Implementar una API route en Next.js (`apps/website/src/app/api/chat/route.ts`) que consulte la API de C4 en `http://127.0.0.1:8000` (incidentes, reportes, parches, evaluaciones y estado de salud).
- **FR-003**: En `apps/website/src/app/chat/page.tsx`, ofrecer una interfaz a pantalla completa (`fixed inset-0 z-50 bg-[#070b14]`) que ocupe el 100% del viewport sin elementos de marketing.
- **FR-004**: La barra lateral debe cargar dinámicamente los incidentes y ejecuciones reales disponibles desde `/api/v1/incidents`.
- **FR-005**: Al seleccionar un incidente o enviar una consulta, la aplicación debe mostrar el proceso de razonamiento causal real paso a paso y la respuesta con el diff exacto del parche y el veredicto del Decision Gate.
- **FR-006**: Mantener compatibilidad con TypeScript estricto, ESLint y pruebas unitarias en `apps/website`.

---

## Criterios de Aceptación (AC)
- **AC-001**: El sitio web no muestra ningún widget flotante simulado en sus páginas públicas.
- **AC-002**: Al acceder a `/chat`, la pantalla completa se dedica exclusivamente a la aplicación de chat estilo Kimi.ai.
- **AC-003**: La lista de sesiones de la barra lateral refleja los incidentes reales leídos desde la API.
- **AC-004**: Al hacer clic en un incidente o enviar una consulta, se obtienen datos reales de causa raíz, puntuaciones y diffs.
- **AC-005**: `pnpm build`, `pnpm lint` y `pnpm test` pasan sin errores en `apps/website`.
- **AC-006**: `python scripts/verify_docs.py` pasa con cero errores.
