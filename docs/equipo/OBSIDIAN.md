# Obsidian en C4 AI
## Función
Obsidian es la interfaz local para leer, enlazar y editar los Markdown del proyecto. La bóveda es una carpeta, no una base de datos remota ni un espacio de equipo por nombre de cuenta.
Usaremos el clon del repositorio privado como bóveda. Git comparte esos mismos archivos entre Deimer y Santiago.
## Deimer: abrir el proyecto instalado
1. Ejecutar python scripts/setup_obsidian.py desde el repositorio; prepara ajustes locales sin instalar plugins.
2. En Obsidian, elegir Abrir carpeta como bóveda / Open folder as vault.
3. Seleccionar C:\Users\Usuario\OneDrive\Documentos\PROYECTO_AGENTS_C4_AI.
4. Abrir docs/README.md y docs/equipo/ESTADO.md; README, AGENTS y CLAUDE también están dentro de la bóveda.
No crear una carpeta vacía nueva ni copiar docs a otra ubicación.
## Santiago: obtener la misma información
1. Autenticarse con su propia cuenta santiagosanabria-1 en GitHub.
2. Clonar el repositorio privado; su permiso write ya está confirmado.
3. Cambiar a develop y ejecutar python scripts/setup_obsidian.py.
4. En Obsidian abrir su carpeta clonada como bóveda.
La cuenta o nombre SANTIAGO SANABRIA no es un destino para compartir esta bóveda por Git. Cada persona usa un clon local.
## Compartir cambios
Actualizar develop antes de crear una rama. Editar notas en la misma rama de la feature; commit convencional con emoji, PR hacia develop y revisión.
Después del merge, el otro integrante actualiza su clon; Obsidian muestra los cambios en esos Markdown.
No editar el mismo archivo simultáneamente. OneDrive no se usa para compartir el checkout entre los dos.
## Conexión de Codex y Claude
Codex lee y escribe directamente los archivos de esta carpeta. Claude debe abrir el clon de Santiago como directorio de trabajo y leer AGENTS/CLAUDE, spec/plan/tasks y contratos.
No necesitamos un MCP de Obsidian para leer documentación. No hay memoria privada compartida automáticamente: CONTEXTO, ADR, bitácoras y specs son el contexto versionado.
El script configura la bóveda en archivos, pero no registra ni abre la carpeta en la interfaz; cada persona la abre una vez.
CLI oficial de Obsidian es opcional, requiere versión compatible y habilitación local. No es requisito de C4 AI.
## Papel de las herramientas
| Herramienta | Fuente de verdad |
|---|---|
| GitHub privado | Código, documentación, Issues, PR y estados |
| Obsidian | Lectura/edición local de esa documentación |
| Slack | Avisos, dudas y entregas mediante enlaces |
| Drive | Opcional para archivos grandes de demo; no duplicar specs |
| Correo | Opcional para comunicaciones acordadas; no enviar secretos |

Obsidian Sync compartido requiere suscripción de los participantes y no ofrece edición simultánea del mismo documento. No se ha contratado ni configurado.
Fuentes: [bóvedas](https://obsidian.md/help/vault), [colaboración Sync](https://obsidian.md/help/sync/collaborate), [CLI](https://obsidian.md/help/cli).
