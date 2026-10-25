// C4 AI Native Desktop Application — Tauri v2
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .setup(|_app| {
            // Local initialization and IPC bridge
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running C4 AI desktop application");
}
