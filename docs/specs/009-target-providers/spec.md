# Proveedor del agente evaluado independiente
Estado: Verified localmente; integración por PR hacia develop. Fecha: 2026-10-17. Responsable: Deimer/Codex. C4-003/C4-005.

## Intención
Deimer propone evaluar un agente sobre Groq. Grok conserva el diagnóstico/propuesta de C4; el target puede ser Grok o Groq. No es un benchmark comparativo entre modelos: baseline/candidato mantienen el mismo modelo y dataset.

## Requisitos y aceptación
FR-001/AC-001: --target-provider grok|groq configura el target separadamente; Groq usa base oficial https://api.groq.com/openai/v1, GROQ_API_KEY local y C4_GROQ_MODEL explícito. Sin clave/modelo no se envían solicitudes. No adivinar modelo habilitado ni declarar gratuidad/costo cero.
FR-002/AC-002: Diagnóstico/propuesta usa Grok; ejecución inicial y comparación usan el target. Probar 1 llamada de razonamiento y 13 del target para los seis casos, con registros de proveedor/modelo en cada solicitud y manifest por rol.
FR-003/AC-003: Compartir límite total de llamadas/tiempo entre ambos; conservar errores/429 sin reintentos automáticos. Impedir cambio de proveedor/modelo al reanudar. Recuperar reportes antiguos sin credenciales.
FR-004/AC-004: doctor describe ambos roles, sin claves; --probe comprueba cada gateway distinto. JSON sigue siendo único, y aceptación exige el mismo gate ya probado.

## Límites
No cambiar contratos HTTP v1 ni frontend. Evidencia local incorpora target_provider como campo adicional. Groq real se declara pendiente hasta contar con clave/modelo y llamada comprobada. Modelo y plan gratuitos dependen de la cuenta; consultar límites oficiales. No expone ejecución libre de herramientas ni cambia producción.
