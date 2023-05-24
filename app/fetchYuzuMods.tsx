import {FileEntry} from "@tauri-apps/api/fs"
import * as yaml from "yaml"
import {LocalMods} from "@/app/types";

export default async function fetchTotkMods(): Promise<LocalMods[]> {
    const {fs, path} = await import("@tauri-apps/api")
    const localMods = await fs.readDir('yuzu\\load\\0100F2C0115B6000', {dir: path.BaseDirectory.Data, recursive: true});
    let promises: Promise<FileEntry | undefined>[] = []
    for (const localMod of localMods) {
        promises.push((async (): Promise<{config?: {}} & FileEntry | undefined> => {
            const configPath = await path.resolve(localMod.path, "config.yaml")
            const exists = await fs.exists(configPath)
            if (exists) {
                return {
                    ...localMod,
                    config: yaml.parse(await fs.readTextFile(configPath))
                }
            } else {
                return {...localMod}
            }
        })())
    }
    // @ts-ignore
    return (await Promise.all(promises)).filter((mod) => mod !== undefined);
}
