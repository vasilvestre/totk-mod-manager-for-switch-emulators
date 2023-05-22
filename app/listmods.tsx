import {fs, path} from "@tauri-apps/api";

export default async function listMods(version: string | null = null) {
    let modPath = await path.resolve(await path.appDataDir(),version ? version : 'latest', 'Mods')
    let files = await fs.readDir(modPath);
    return {
        categories: files.map((file) => file.name),
    }
}