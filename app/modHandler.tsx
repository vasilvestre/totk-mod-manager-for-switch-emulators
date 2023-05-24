import {ModFile} from "@/app/types";

export async function installSingleMod(mod: ModFile) {
    const {invoke, path} = await import("@tauri-apps/api")

    const appDataDir = await path.dataDir()
    const localModsPath = await path.resolve(appDataDir, 'yuzu\\load\\0100F2C0115B6000')
    await invoke('copy_dir', { filePath: mod.path, targetDir: localModsPath})
}