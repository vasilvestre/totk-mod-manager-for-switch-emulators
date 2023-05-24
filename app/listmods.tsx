import * as yaml from "yaml"

export default async function listMods(version: string | null = null) {
    const {fs, path} = await import("@tauri-apps/api")

    let modPath = await path.resolve(await path.appDataDir(), version ? version : 'latest', 'Mods')
    let files = await fs.readDir(modPath, {recursive: true})
    let promises = []
    for (const category of files) {
        category?.children?.forEach((mod) => {
            promises.push((async () => {
                const configPath = await path.resolve(mod.path, "config.yaml")
                const exists = await fs.exists(configPath)
                if (exists) {
                    const config = yaml.parse(await fs.readTextFile(configPath))
                    return ({
                        ...mod,
                        config
                    })
                }
            })())
        })
    }
    return (await Promise.all(promises)).filter((mod) => mod !== undefined)
}