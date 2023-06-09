import { AlertType, EmulatorState, LocalMod, ModFile } from '@/src/types'
import getErrorMessage, { getErrorData } from '@/src/handler/errorHandler'
import { emulatorDefaultModFolder } from '@/src/handler/emulatorHandler'
import { fetchLocalMods } from '@/src/handler/localModHandler'
import { File, ModModel, ModType } from '@/src/gamebanana/types'

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

export function tryGamebananaInstall(
    file: File,
    modRecord: ModType,
    localMods: LocalMod[],
    setLocalMods: (mods: LocalMod[]) => void,
    setAlert: (alert: AlertType | undefined) => void,
    emulatorState: EmulatorState | undefined,
    modInformations: ModModel
) {
    return async () => {
        const { invoke, fs } = await import('@tauri-apps/api')
        const { trackEvent } = await import('@aptabase/tauri')
        let emulatorModDir

        try {
            if (typeof emulatorState === 'undefined' || !emulatorState.path) {
                throw { message: 'Emulator not found' }
            }
            emulatorModDir = await emulatorDefaultModFolder(emulatorState)
            const { download } = await import('tauri-plugin-upload-api')
            const { path } = await import('@tauri-apps/api')
            if (file._sDownloadUrl && modRecord._sName) {
                const filePath = await path.resolve(
                    await emulatorDefaultModFolder(emulatorState),
                    file._sFile
                )
                const filePathTarget = await path.resolve(
                    await emulatorDefaultModFolder(emulatorState),
                    modRecord._sName
                )
                await download(file._sDownloadUrl, filePath)
                await invoke('unzip', { filePath: filePath, targetDir: filePathTarget })
                await fs.removeFile(filePath)
                await fs.writeFile(
                    filePathTarget + '/gamebanana_metadata.json',
                    JSON.stringify({ mod: modInformations, file: file })
                )
            }
            setAlert({
                message: 'Mod installed',
                type: 'success',
            })
        } catch (e: unknown) {
            console.error(e)
            setAlert({
                message: getErrorMessage(e),
                type: 'error',
                data: getErrorData(e),
            })
        } finally {
            if (emulatorModDir) {
                setLocalMods(await fetchLocalMods(emulatorModDir))
            }
            trackEvent('mod_install', {
                name: modRecord._sName ? modRecord._sName : 'unknown',
                collection: 'gamebanana',
            })
        }
    }
}

export function tryInstall(
    mod: ModFile,
    localMods: LocalMod[],
    setLocalMods: (mods: LocalMod[]) => void,
    setAlert: (alert: AlertType | undefined) => void,
    emulatorState: EmulatorState | undefined
) {
    return async () => {
        const { trackEvent } = await import('@aptabase/tauri')
        let emulatorModDir
        try {
            if (typeof emulatorState === 'undefined' || !emulatorState.path) {
                throw { message: 'Emulator not found' }
            }
            await checkIncompatibilities(mod, localMods)
            emulatorModDir = await emulatorDefaultModFolder(emulatorState)
            await installDownloadedMod(mod, true, emulatorModDir)
            setAlert({
                message: 'Mod installed',
                type: 'success',
            })
        } catch (e: unknown) {
            console.error(e)
            setAlert({
                message: getErrorMessage(e),
                type: 'error',
                data: getErrorData(e),
            })
        } finally {
            if (emulatorModDir) {
                setLocalMods(await fetchLocalMods(emulatorModDir))
            }
            trackEvent('mod_install', { name: mod.config.title })
        }
    }
}

export function tryUpdate(
    mod: ModFile,
    localMods: LocalMod[],
    setLocalMods: (mods: LocalMod[]) => void,
    setAlert: (alert: AlertType | undefined) => void,
    emulatorState: EmulatorState | undefined
) {
    return async () => {
        const { trackEvent } = await import('@aptabase/tauri')

        let emulatorModDir

        try {
            if (typeof emulatorState === 'undefined' || !emulatorState.path) {
                throw { message: 'Emulator not found' }
            }
            emulatorModDir = await emulatorDefaultModFolder(emulatorState)
            await installDownloadedMod(mod, true, emulatorModDir)
            const previousMod = localMods.find((localMod) =>
                localMod.name?.includes(mod.config.title)
            )
            if (!previousMod) {
                throw { message: 'Previous installed folder not found' }
            }
            await removeSingleMod(previousMod)
            setAlert({
                message: 'Mod updated',
                type: 'success',
            })
        } catch (e: unknown) {
            console.error(e)
            setAlert({
                message: getErrorMessage(e),
                type: 'error',
                data: getErrorData(e),
            })
        } finally {
            if (emulatorModDir) {
                setLocalMods(await fetchLocalMods(emulatorModDir))
            }
            trackEvent('mod_update', { name: mod.config.title })
        }
    }
}
export function filterMods(mods: ModFile[], localMods: LocalMod[]) {
    const regexp = /(.*-)/
    return mods.sort((a: ModFile) => {
        if (
            localMods.find((localMod) => {
                if (localMod?.config?.id === a.config.id) {
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
    emulatorState: EmulatorState | undefined
) {
    return async () => {
        const { trackEvent } = await import('@aptabase/tauri')

        try {
            if (emulatorState && mod) {
                await removeSingleMod(mod)
                setLocalMods(await fetchLocalMods(await emulatorDefaultModFolder(emulatorState)))
                setAlert({
                    message: 'Mod removed',
                    type: 'success',
                })
            } else {
                throw new Error()
            }
        } catch (e: unknown) {
            console.error(e)
            setAlert({
                message: getErrorMessage(e),
                type: 'error',
                data: getErrorData(e),
            })
        } finally {
            trackEvent('mod_remove', { name: mod?.name ?? 'unknown' })
        }
    }
}

async function downloadMod(mod: ModModel) {}

async function installDownloadedMod(
    mod: { path: string },
    overwrite = false,
    emulatorModDir: string
) {
    const { invoke } = await import('@tauri-apps/api')

    await invoke('copy_dir', {
        filePath: mod.path,
        targetDir: emulatorModDir,
        overwrite: overwrite,
    })
}

async function removeSingleMod(mod: LocalMod) {
    const { fs } = await import('@tauri-apps/api')

    await fs.removeDir(mod.path, { recursive: true })
}
