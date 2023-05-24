import {LocalMods, ModFile} from "@/app/types";

export async function installSingleMod(mod: ModFile) {
    const {invoke, path} = await import("@tauri-apps/api")

    const appDataDir = await path.dataDir()
    const localModsPath = await path.resolve(appDataDir, 'yuzu\\load\\0100F2C0115B6000')
    await invoke('copy_dir', { filePath: mod.path, targetDir: localModsPath})
}


export async function checkIncompatibilities(mod: ModFile, localMods: LocalMods[]) {
    let incompatibilities: string[] = []
    localMods.forEach((localMod) => {
        if (localMod.config && localMod.config.compatibility.blacklist.includes(mod.config.id)) {
            incompatibilities.push(localMod.config.title)
        }
    })
    throw {data: incompatibilities, message: 'Incompatible mods'}
}