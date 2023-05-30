import { FileEntry } from '@tauri-apps/api/fs'
import * as yaml from 'yaml'
import { LocalMod, ModConfig, notEmpty } from '@/app/types'

export default async function fetchYuzuMods(yuzuDir: string): Promise<LocalMod[]> {
    const { fs, path } = await import('@tauri-apps/api')
    try {
        const yuzuModDir = await path.resolve(yuzuDir, 'load', '0100F2C0115B6000')
        await fs.exists(yuzuModDir)
        const localMods = await fs.readDir(yuzuModDir, {
            dir: path.BaseDirectory.Data,
            recursive: true,
        })
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
    } catch (e) {
        console.error(e)
        throw new Error('Could not fetch local mods')
    }
}
