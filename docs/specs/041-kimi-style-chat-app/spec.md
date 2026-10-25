# Spec 041: Aplicación Web de Chat Conversacional C4 AI (Estilo Kimi.ai)

## Contexto y Misión
El usuario aclara que al solicitar el chat de C4, se refería a una experiencia conversacional web a pantalla completa tipo **[Kimi.ai](https://www.kimi.ai/)** (Moonshot AI / ChatGPT / Claude.ai), en lugar de únicamente un widget emergente.

La aplicación conversacional C4 AI debe ofrecer:
1. **Ruta Dedicada `/chat`**: Una interfaz de usuario completa, espaciosa y dark-mode nativa.
2. **Barra Lateral Colapsable**:
   - Botón `+ Nuevo chat`.
   - Historial de sesiones / incidentes de diagnóstico interactivos.
   - Selector dinámico de modelo analista (`xAI Grok-4.7`, `C4 Kimi-K1 Razonamiento`, `Groq LLaMA 3.3 70B`, `Ollama Local $0.00`).
   - Indicador de estado de conexión del gateway y la API local en puerto 8000.
3. **Área Principal de Conversación**:
   - Estado inicial estilo Kimi.ai con tarjetas de diagnóstico rápido (reembolsos, decision gate, red teaming, benchmark 1k).
   - Bloque de razonamiento colapsable estilo Kimi (`<think> Pensamiento profundo del modelo`), mostrando la traza causal paso a paso.
   - Mensajes con formato Markdown completo, bloques de código con sintaxis resaltada y botones de copia.
4. **Caja de Entrada Flotante Inferior**:
   - Campo amplio con soporte para adjuntar trazas (`.json`), alternar modo de razonamiento profundo y atajo Enter para enviar.
5. **Navegación e Integración Global**:
   - Enlace `Chat` en la cabecera principal (`SiteHeader`) y acceso rápido desde el widget flotante.

---

## Requisitos Funcionales (FR)
- **FR-001**: Crear la ruta `/chat` en `apps/website/src/app/chat/page.tsx` con soporte para pantalla completa, adaptable a resoluciones móviles y de escritorio.
- **FR-002**: Implementar la barra lateral con sesiones de histórico, selector de modelos y botón de nuevo chat.
- **FR-003**: Implementar el bloque de razonamiento colapsable (*thinking process dropdown*) antes de la respuesta estructurada, emulando la experiencia de Kimi K1 / Grok-4.7.
- **FR-004**: Ofrecer tarjetas de prompt iniciales en el estado vacío para iniciar diagnósticos reales del harness de C4 AI.
- **FR-005**: Permitir adjuntar o pegar trazas JSON de incidentes para su análisis inmediato.
- **FR-006**: Agregar el enlace de navegación "Chat" en la barra de navegación del sitio web y en el footer.

---

## Criterios de Aceptación (AC)
- **AC-001**: `/chat` carga limpiamente sin errores de consola ni de SSR/TypeScript.
- **AC-002**: El usuario puede interactuar, enviar preguntas, cambiar de sesión y colapsar/expandir el razonamiento interno.
- **AC-003**: `pnpm lint`, `pnpm test` y `pnpm build` en `apps/website` terminan con código 0.
- **AC-004**: `python scripts/verify_docs.py` pasa con cero errores.
