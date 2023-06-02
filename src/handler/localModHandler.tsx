import { FileEntry } from '@tauri-apps/api/fs'
import * as yaml from 'yaml'
import { LocalMod, ModConfig, ModFile, notEmpty } from '@/src/types'
import getErrorMessage from '@/src/handler/errorHandler'

export async function fetchMods(modsDir: string): Promise<LocalMod[]> {
    const { fs, path } = await import('@tauri-apps/api')
    await fs.exists(modsDir)
    let localMods
    try {
        localMods = await fs.readDir(modsDir, {
            recursive: true,
        })
    } catch (e) {
        console.error(e)
        throw {
            message: 'Mods directory not found in ' + getErrorMessage(e),
        }
    }
    const promises: Promise<FileEntry | undefined>[] = []
    for (const localMod of localMods) {
        promises.push(
            (async (): Promise<({ config?: ModConfig } & FileEntry) | undefined> => {
                const configPath = await path.resolve(localMod.path, 'config.yaml')
                const exists = await fs.exists(configPath)
                if (exists) {
                    return {
                        ...localMod,
                        config: yaml.parse(await fs.readTextFile(configPath)),
                    }
                } else {
                    return { ...localMod }
                }
            })()
        )
    }
    return (await Promise.all(promises)).filter(notEmpty)
}

export async function listMods(version: string): Promise<ModFile[]> {
    const { fs, path } = await import('@tauri-apps/api')

    const modConfigPath = await path.resolve(
        await path.appDataDir(),
        version ? version : 'latest',
        'config.yaml'
    )
    let modDirectory: string | undefined
    if (await fs.exists(modConfigPath)) {
        const modConfig = yaml.parse(await fs.readTextFile(modConfigPath))
        modDirectory = modConfig.root
    }
    const modPath = await path.resolve(
        await path.appDataDir(),
        version ? version : 'latest',
        modDirectory ? modDirectory : 'Mods'
    )
    const files = await fs.readDir(modPath, { recursive: true })
    const promises: Promise<ModFile | undefined>[] = []
    for (const category of files) {
        category?.children?.forEach((mod: FileEntry) => {
            promises.push(
                (async (): Promise<ModFile | undefined> => {
                    const configPath = await path.resolve(mod.path, 'config.yaml')
                    const exists = await fs.exists(configPath)
                    if (exists) {
                        const config: ModConfig = yaml.parse(await fs.readTextFile(configPath))
                        return {
                            ...mod,
                            config,
                        }
                    }
                })()
            )
        })
    }
    return (await Promise.all(promises)).filter(notEmpty)
}
