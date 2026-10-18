# 027 — Ampliación del video de Santiago

Estado: validación técnica completada; [PR42 en revisión](https://github.com/DEIMER-PY/c4-ai/pull/42). Aceptación creativa humana pendiente. Responsable: Deimer/Codex. Revisión creativa: Deimer. Fuente humana: MP4 compartido por Deimer, 71s/1080p/30fps, sin proyecto editable. No atribuir editor por su estética: metadatos y remoto no lo identifican.

FR001 / AC001: conservar el video fuente inmutable y su dirección clara/minimalista: fondo luminoso con trazas finas, tipografía protagonista, paneles oscuros y evidencia progresiva. Extender a120s/3600frames a30fps, sin ralentizar artificialmente los71s para llenar tiempo. Se pueden reutilizar fragmentos originales y agregar capítulos nuevos con transiciones coherentes.

FR002 / AC002: incluir qué prueba C4, propuesta JEV, impacto y ecosistema website/docs/desktop/móvil. Diferenciar evaluaciones de comportamiento actuales de un futuro runner de pruebas unitarias. No afirmar que C4 ejecuta tests arbitrarios, modifica producción o que JEV ya está integrado. Beneficios cualitativos, sin ahorro/velocidad/ROI inventados.

FR003 / AC003: conservar audio original de fragmentos reutilizados. Actualización humana: Deimer pide usar la voz que está en el MP4. Conservarla en los71s originales; las adiciones serán subtituladas mientras no se identifique la fuente de voz. No sustituirla ni presentarla como una locución nueva. La clave ElevenLabs autorizada permanece solo en.env ignorado. Si varios proveedores llaman Dylan a voces distintas, documentar voz/ID real seleccionado y no afirmar equivalencia exacta sin evidencia. Frases completas, transiciones sonoras sin picos y duración real verificada.

FR004 / AC004: actualizar contexto y tareas con el remoto vigente: PR41 website/MDX integrado en develop589e410. No rehacer website ni mantener C4-014/015 como no implementadas. Revisar calidad antes de cerrarlas; despliegue sigue pendiente. Resolver colisión024 con teaser renumerado026; conservar todos los cambios locales al integrar remoto.

FR005 / AC005: entregar source Remotion, guion/procedencia, video120s, fotogramas y reporte de validación. Feature y PR→develop, commits convencionales con emojis, sin cambios de contratos del backend ni mensajes a terceros.

Actualización FR003 autorizada por Deimer: sustituir la narración completa por otra voz disponible de ElevenLabs. Seleccionar una voz premade de tono sobrio, probar un fragmento antes de generar el guion completo, sin importar voces ni cambiar de plan. Conservar ambos MP4 anteriores. La nueva edición debe mantener120s, narrar también los capítulos añadidos y registrar voz/modelo/uso real sin secretos. Si el proveedor rechaza la generación, conservar la edición previa e informar el error real.
