import { AlertType, LocalMod, ModFile } from '@/app/types'
import fetchYuzuMods from '@/app/(handler)/fetchYuzuMods'

export async function checkIncompatibilities(mod: ModFile, localMods: LocalMod[]) {
    const incompatibilities: string[] = []
    localMods.forEach((localMod) => {
        if (localMod.config && localMod.config.compatibility?.blacklist?.includes(mod.config.id)) {
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
    setLocalMods: (mods: LocalMod[]) => void,
    setAlert: (alert: AlertType | undefined) => void,
    yuzuDir: string | undefined
) {
    return async () => {
        const { trackEvent } = await import('@aptabase/tauri')

        try {
            if (!yuzuDir) {
                throw { message: 'Yuzu not found' }
            }
            await checkIncompatibilities(mod, localMods)
            await installSingleMod(mod, true, yuzuDir)
            setLocalMods(await fetchYuzuMods(yuzuDir))
            setAlert({
                message: 'Mod installed',
                type: 'success',
            })
        } catch (e: any) {
            console.error(e)
            setAlert({
                message: e.message,
                type: 'error',
                data: e.data,
            })
        } finally {
            trackEvent('mod_install', { name: mod.config.title })
        }
    }
}

export function tryUpdate(
    mod: ModFile,
    localMods: LocalMod[],
    setLocalMods: (mods: LocalMod[]) => void,
    setAlert: (alert: AlertType | undefined) => void,
    yuzuDir: string | undefined
) {
    return async () => {
        const { trackEvent } = await import('@aptabase/tauri')

        try {
            if (!yuzuDir) {
                throw { message: 'Yuzu not found' }
            }
            await installSingleMod(mod, true, yuzuDir)
            const previousMod = localMods.find((localMod) =>
                localMod.name?.includes(mod.config.title)
            )
            if (!previousMod) {
                throw { message: 'Previous installed folder not found' }
            }
            await removeSingleMod(previousMod)
            setLocalMods(await fetchYuzuMods(yuzuDir))
            setAlert({
                message: 'Mod updated',
                type: 'success',
            })
        } catch (e: any) {
            console.error(e)
            setAlert({
                message: e.message,
                type: 'error',
                data: e.data,
            })
        } finally {
            trackEvent('mod_update', { name: mod.config.title })
        }
    }
}
export function filterMods(mods: ModFile[], localMods: LocalMod[]) {
    const regexp = /(.*-)/
    return mods.sort((a: ModFile) => {
        if (
            localMods.find((localMod) => {
                if (localMod?.config?.title === a.config.title) {
                    return true
                }
                const matches = localMod.name?.match(regexp)
                return !!matches?.includes(a.config.title)
            })
        ) {
            return -1
        }
        return +1
    })
}

export function tryRemove(
    mod: LocalMod | undefined,
    setLocalMods: (mods: LocalMod[]) => void,
    setAlert: (alert: AlertType | undefined) => void,
    yuzuDir: string | undefined
) {
    return async () => {
        const { trackEvent } = await import('@aptabase/tauri')

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
        } finally {
            trackEvent('mod_remove', { name: mod?.name ?? 'unknown' })
        }
    }
}

async function installSingleMod(mod: ModFile, overwrite = false, yuzuDir: string) {
    const { invoke, path } = await import('@tauri-apps/api')

    const localModsPath = await path.resolve(yuzuDir, 'load', '0100F2C0115B6000')
    await invoke('copy_dir', {
        filePath: mod.path,
        targetDir: localModsPath,
        overwrite: overwrite,
    })
}

async function removeSingleMod(mod: LocalMod) {
    const { fs } = await import('@tauri-apps/api')

    await fs.removeDir(mod.path, { recursive: true })
}
