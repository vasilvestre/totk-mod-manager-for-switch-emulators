import { FileEntry } from '@tauri-apps/api/fs'
import * as yaml from 'yaml'
import { LocalMod, ModConfig, ModFile, notEmpty } from '@/src/types'

export async function fetchLocalMods(modsDir: string): Promise<LocalMod[]> {
    const { fs, path } = await import('@tauri-apps/api')
    try {
        await fs.exists(modsDir)
        const localMods = await fs.readDir(modsDir, {
            recursive: true,
        })
        const promises: Promise<FileEntry | undefined>[] = []
        for (const localMod of localMods) {
            promises.push(
                (async (): Promise<LocalMod | undefined> => {
                    const configPath = await path.resolve(localMod.path, 'config.yaml')
                    const gamebananaMetadata = await path.resolve(
                        localMod.path,
                        'gamebanana_metadata.json'
                    )
                    if (await fs.exists(configPath)) {
                        return {
                            ...localMod,
                            config: yaml.parse(await fs.readTextFile(configPath)),
                        }
                    } else if (await fs.exists(gamebananaMetadata)) {
                        return {
                            ...localMod,
                            gamebanana: JSON.parse(await fs.readTextFile(gamebananaMetadata)),
                        }
                    } else {
                        return { ...localMod }
                    }
                })()
            )
        }
        return (await Promise.all(promises))
            .filter(notEmpty)
            .filter((mod) => !mod.path.startsWith('mm_'))
    } catch (e) {
        console.error(e)
        throw new Error('Could not fetch local mods')
    }
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
