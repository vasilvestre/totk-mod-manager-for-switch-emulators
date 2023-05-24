// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    fs,
    path::{PathBuf},
    io::{Cursor},
};
extern crate fs_extra;
use fs_extra::dir::{
    copy,
    CopyOptions
};

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_upload::init())
    .invoke_handler(tauri::generate_handler![unzip])
    .invoke_handler(tauri::generate_handler![copy_dir])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Zip(#[from] zip_extract::ZipExtractError),
    #[error(transparent)]
    Fs(#[from] fs_extra::error::Error)
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
    let bytes: Vec<u8> = fs::read(file_path)?;
    let target_dir = PathBuf::from(target_dir);
    zip_extract::extract(Cursor::new(bytes), &target_dir, true)?;

    Ok("pas d'erreur".into())
}

#[tauri::command]
fn copy_dir(file_path: String, target_dir: String) -> Result<String, Error> {
    let options = CopyOptions::new();
    copy(file_path, target_dir, &options)?;

    Ok("pas d'erreur".into())
}
