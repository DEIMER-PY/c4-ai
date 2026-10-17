# ADR-002: escritorio después del flujo verificable
Fecha: 2026-10-17. Estado: propuesta para revisión de ambos. No añade dependencias runtime.

## Evaluación
El proyecto está en la primera entrega vertical: contratos tipados, dashboard con mocks y CLI con core Python. La prioridad es demostrar confiabilidad con evidencia. Escritorio y sitio de documentación son interfaces posteriores sobre ese core.

| Opción | Encaje | Trabajo necesario |
|---|---|---|
| Tauri 2 + core Python como sidecar | Candidato para distribución de escritorio; permite empaquetar un binario CLI/API propio | Compilar Python por plataforma, permisos de comandos mínimos, IPC validado, firma/actualización/instaladores; proteger credenciales |
| Dashboard Next.js actual | Mejor vía para revisar evidencia e integrar API ahora | C4-006: adaptador HTTP y estados reales |
| Hermes Agent | Referencia y futuro agente objetivo/adaptador de harness | Probar límites, exportación de trazas y proveedor compatible sin dar acceso amplio al host |

Tauri documenta sidecars para CLI/servidores Python y requiere binarios por arquitectura. Su guía Next.js usa export estático: el dashboard actual tiene rutas/datos del servidor y no se puede envolver sin revisar esa arquitectura. Esta conclusión es nuestra evaluación, no una prueba de integración.

Hermes de Nous Research ofrece un agente con memoria, herramientas y loop de aprendizaje. No se instala ni sustituye nuestro core en esta feature. Lo más útil inicialmente sería auditar Hermes como agente objetivo o estudiar su separación CLI/servicios; su memoria/ejecución arbitraria no debe habilitarse automáticamente en C4. Revisar licencia y fijar commit al experimentar. La referencia se entiende como NousResearch/hermes-agent; no se ha elegido otro proyecto homónimo.

## Secuencia propuesta
1. CLI real con evidencia y fallo controlado.
2. API/persistencia y dashboard real de Santiago.
3. Spec independiente de escritorio con Tauri y experimento pequeño sobre el core, junto con adaptador Hermes si aporta un caso de prueba.
4. Sitio de producto/documentación con instalación, tutorial, arquitectura y evidencia. Publicación e instaladores requieren decisión posterior; repo/tablero continúan privados.
5. Video de demostración grabado sobre el flujo funcionando, sin generar una interfaz o métricas ficticias. Comparar herramientas de captura/edición cuando llegue esa tarea; C4-008 sigue asignada a Santiago.

## Fuentes consultadas
- [Tauri: Next.js](https://v2.tauri.app/start/frontend/nextjs/).
- [Tauri: sidecars](https://v2.tauri.app/develop/sidecar/).
- [Hermes oficial](https://github.com/NousResearch/hermes-agent).

No se ha construido ni probado una aplicación Tauri/Hermes. No afecta el contrato del dashboard ni requiere que Santiago abandone C4-004/C4-006.
