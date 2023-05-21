import {BaseDirectory, readDir} from '@tauri-apps/api/fs';
import {once} from "@tauri-apps/api/event";

export default async function fetchTotkMods() {
    return await readDir('yuzu\\load\\0100F2C0115B6000', {dir: BaseDirectory.Data, recursive: false});
}
