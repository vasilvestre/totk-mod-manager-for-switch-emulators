import {LocalMod, ModConfig, ModFile} from '@/app/types'
import fetchYuzuMods from "@/app/(handler)/fetchYuzuMods";

export async function installSingleMod(mod: ModFile, overwrite: boolean = false) {
    const { invoke, path } = await import('@tauri-apps/api')

    const appDataDir = await path.dataDir()
    const localModsPath = await path.resolve(
        appDataDir,
        'yuzu\\load\\0100F2C0115B6000'
    )
    await invoke('copy_dir', { filePath: mod.path, targetDir: localModsPath, overwrite: overwrite })
}

export async function removeSingleMod(mod: LocalMod) {
    const { fs } = await import('@tauri-apps/api')

    await fs.removeDir(mod.path, { recursive: true })
}

export async function checkIncompatibilities(
    mod: ModFile,
    localMods: LocalMod[]
) {
    let incompatibilities: string[] = []
    localMods.forEach((localMod) => {
        if (
            localMod.config &&
            localMod.config.compatibility?.blacklist?.includes(mod.config.id)
        ) {
            incompatibilities.push(localMod.config.title)
        }
    })
    if (incompatibilities.length > 0) {
        throw { data: incompatibilities, message: 'Incompatible mods' }
    }
}


export function tryInstall(mod: ModFile, localMods: LocalMod[], setLocalMods: Function, setAlert: Function) {
    return async () => {
        try {
            await checkIncompatibilities(mod, localMods)
            await installSingleMod(mod)
            setLocalMods(await fetchYuzuMods())
        } catch (e: any) {
            console.error(e)
            setAlert({
                message: e.message,
                type: 'error',
                data: e.data,
            })
        }
    }
}

export function tryUpdate(mod: ModFile, localMods: LocalMod[], setLocalMods: Function, setAlert: Function) {
    return async () => {
        try {
            await installSingleMod(mod, true)
            setLocalMods(await fetchYuzuMods())
        } catch (e: any) {
            console.error(e)
            setAlert({
                message: e.message,
                type: 'error',
                data: e.data,
            })
        }
    }
}
export function tryRemove(mod: LocalMod | undefined, setLocalMods: Function, setAlert: Function) {
    return async () => {
        try {
            if (mod) {
                await removeSingleMod(mod)
                setLocalMods(await fetchYuzuMods())
            } else {
                throw new Error()
            }
        } catch (e: any) {
            console.error(e)
            setAlert({
                message: e.message,
                type: 'error',
                data: e.data,
            })
        }
    }
}
