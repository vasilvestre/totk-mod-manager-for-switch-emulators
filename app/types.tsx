import {FileEntry} from "@tauri-apps/api/fs";

export type ModConfig = {
    title: string,
    author: {
        name: string,
    },
    category: number,
    subtitle: string
}

export type ModFile = {
    config: ModConfig,
} & FileEntry

export type LocalMods = {
    config?: {},
} & FileEntry