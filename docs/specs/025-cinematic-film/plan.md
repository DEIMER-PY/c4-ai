# Plan

1. Conservar el teaser y las composiciones previas. Crear entrada independiente film-index.tsx, escenas reutilizables y Cortex SVG.
2. Adaptar las ocho escenas al estado comprobado. Presentar UI reconstruida y roadmap con etiquetas visibles; limitar texto por escena y usar revelados progresivos.
3. Generar narración Dylan por escenas, medir duración real y encajar sin cortar. Si la cuenta no está disponible, mantener silencio/locución pendiente identificada, no usar otra voz como Dylan.
4. Usar TransitionSeries con transiciones de 18 frames y compensación en cada escena anterior para conservar inicios nominales. Gráficos y cámara deterministicamente ligados al frame.
5. Verificar stills antes de exportar, corregir layout, verificar streams y audio. Documentar reproducción y procedencia.
6. Auditar cambios locales previos y preservar ownership. Preparar handoff y commits separados; PR siempre hacia develop.
