# Plan 042: Chat Funcional Independiente y Desacoplado del Sitio Web

## Enfoque de Implementación

### Fase 1: Limpieza del Widget Simulado
- Eliminar `<C4Chatbot />` de `apps/website/src/app/layout.tsx`.
- Dejar el sitio web limpio y sin widgets emergentes de juguete.

### Fase 2: Backend Route Handler en Next.js (`/api/chat`)
- Crear `apps/website/src/app/api/chat/route.ts` con métodos:
  - `GET`: Retorna los incidentes reales almacenados en `artifacts/runs` o la API en `http://127.0.0.1:8000/api/v1/incidents`.
  - `POST`: Procesa preguntas del usuario, resuelve consultas de incidentes específicos, obtiene parches, evaluaciones y reportes reales, y genera la respuesta con los pasos de razonamiento causal y el veredicto del Decision Gate.

### Fase 3: Frontend Autónomo Kimi-Style (`apps/website/src/components/chat-interface.tsx`)
- Adaptar la vista a pantalla completa con `fixed inset-0 z-50` para un aislamiento visual total.
- Conectar mediante `fetch` al endpoint `/api/chat` para cargar incidentes reales en la barra lateral.
- Al hacer clic en un incidente, cargar en el hilo conversacional su causa raíz real, su diff y su reporte.
- Formatear diffs unificados reales y matrices de evaluación con sintaxis de colores.

### Fase 4: Validación y Pruebas
- Ejecutar pruebas en `apps/website` (`pnpm test`, `pnpm lint`, `pnpm build`).
- Validar enlaces documentales con `python scripts/verify_docs.py`.
