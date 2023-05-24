import * as yaml from "yaml"
import {ModFile, ModConfig} from "@/app/types";
import {FileEntry} from "@tauri-apps/api/fs";

export default async function listMods(version: string | null = null): Promise<ModFile[]> {
    const {fs, path} = await import("@tauri-apps/api")

    let modConfigPath = await path.resolve(await path.appDataDir(), version ? version : 'latest', 'config.yaml')
    let modConfig = yaml.parse(await fs.readTextFile(modConfigPath))
    let modPath = await path.resolve(await path.appDataDir(), version ? version : 'latest', modConfig.root)
    let files = await fs.readDir(modPath, {recursive: true})
    let promises: Promise<ModFile | undefined>[] = []
    for (const category of files) {
        category?.children?.forEach((mod: FileEntry) => {
            promises.push((async (): Promise<ModFile | undefined> => {
                const configPath = await path.resolve(mod.path, "config.yaml")
                const exists = await fs.exists(configPath)
                if (exists) {
                    const config: ModConfig = yaml.parse(await fs.readTextFile(configPath))
                    return {
                        ...mod,
                        config
                    }
                }
            })())
        })
    }
    // @ts-ignore
    return (await Promise.all(promises)).filter((mod) => mod !== undefined)
}