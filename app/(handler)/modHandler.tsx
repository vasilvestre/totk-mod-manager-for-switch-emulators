import { LocalMod, ModFile } from '@/app/types'
import fetchYuzuMods from '@/app/(handler)/fetchYuzuMods'

export async function installSingleMod(
    mod: ModFile,
    overwrite = false,
    yuzuDir: string
) {
    const { invoke, path } = await import('@tauri-apps/api')

    const localModsPath = await path.resolve(
        yuzuDir,
        'load',
        '0100F2C0115B6000'
    )
    await invoke('copy_dir', {
        filePath: mod.path,
        targetDir: localModsPath,
        overwrite: overwrite,
    })
}

export async function removeSingleMod(mod: LocalMod) {
    const { fs } = await import('@tauri-apps/api')

    await fs.removeDir(mod.path, { recursive: true })
}

export async function checkIncompatibilities(
    mod: ModFile,
    localMods: LocalMod[]
) {
    const incompatibilities: string[] = []
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

export function tryInstall(
    mod: ModFile,
    localMods: LocalMod[],
    setLocalMods: Function,
    setAlert: Function,
    yuzuDir: string | undefined
) {
    return async () => {
        try {
            if (!yuzuDir) {
                throw { message: 'Yuzu not found' }
            }
            await checkIncompatibilities(mod, localMods)
            await installSingleMod(mod, false, yuzuDir)
            setLocalMods(await fetchYuzuMods(yuzuDir))
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

export function tryUpdate(
    mod: ModFile,
    localMods: LocalMod[],
    setLocalMods: Function,
    setAlert: Function,
    yuzuDir: string | undefined
) {
    return async () => {
        try {
            if (!yuzuDir) {
                throw { message: 'Yuzu not found' }
            }
            await installSingleMod(mod, true, yuzuDir)
            setLocalMods(await fetchYuzuMods(yuzuDir))
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
export function filterMods(mods: ModFile[], localMods: LocalMod[]) {
    return mods.sort((a: ModFile, b: ModFile) => {
        if (localMods.find((localMod) => localMod.name === a.name)) {
            return -1
        }
        return 0
    })
}

export function tryRemove(
    mod: LocalMod | undefined,
    setLocalMods: Function,
    setAlert: Function,
    yuzuDir: string | undefined
) {
    return async () => {
        try {
            if (yuzuDir && mod) {
                await removeSingleMod(mod)
                setLocalMods(await fetchYuzuMods(yuzuDir))
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
