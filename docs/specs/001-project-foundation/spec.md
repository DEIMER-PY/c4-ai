# Marco funcional C4 AI
ID: C4-FOUNDATION-001. Estado: Ready para descomposición en features; producto no implementado.
Fuente: plan de producto aprobado y [PRD](../../producto/PRD.md). Formalizado en SDD después de la primera publicación documental.
## Usuario y objetivo
Equipos que operan agentes necesitan diagnosticar fallos y probar correcciones con evidencia.
## Requisitos del MVP
FR-001: Registrar agente/version y ejecución trazada con procedencia sintética o anonimizada.
FR-002: Detectar incidente y producir diagnóstico con referencias a evidencia.
FR-003: Crear candidato declarativo de prompt/config sin modificar baseline.
FR-004: Comparar baseline/candidato sobre mismo dataset/version, guardando resultados por caso.
FR-005: Aceptar solo mejora objetivo sin regresiones y con seguridad aprobada; rechazar fallos y escalar evidencia incompleta.
FR-006: API/CLI comparten servicios y reportan IDs, etapa, estados, errores, latencia y consumo conocido/desconocido.
FR-007: Dashboard consulta incidentes, candidatos, evals y reportes; permite mocks rotulados mientras no exista API.
FR-008: Workers limitan intentos, tiempo y presupuesto y conservan evidencia ante fallos/reinicio.
## Aceptación
AC-001: Un caso de reembolso fuera de plazo reproduce error y una corrección mejora el caso.
AC-002: Un candidato con regresión se rechaza aunque mejore otro caso.
AC-003: Evaluación incompleta nunca acepta un candidato.
AC-004: CLI/API producen la misma decisión y evidencia.
AC-005: Frontend muestra queued/failed/unknown cost sin afirmar éxito o costo cero.
AC-006: Un trabajo duplicado/reiniciado no duplica efectos y deja trazabilidad.
## Límites
Sin aplicación automática a producción, ejecución arbitraria de código generado, entrenamiento de modelo ni SOC generalista.
Gateway y requisitos oficiales pendientes de C4-001; no implementar cliente real sin verificarlos.
