// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_upload::init())
    .invoke_handler(tauri::generate_handler![unzip])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Zip(#[from] zip_extract::ZipExtractError)
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
        where
            S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[tauri::command]
fn unzip(file_path: String, target_dir: String) -> Result<String, Error> {
    let bytes: Vec<u8> = std::fs::read(file_path)?;
    let target_dir = std::path::PathBuf::from(target_dir);
    zip_extract::extract(std::io::Cursor::new(bytes), &target_dir, true)?;

    Ok("pas d'erreur".into())
}