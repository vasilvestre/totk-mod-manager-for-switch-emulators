import {FileEntry} from "@tauri-apps/api/fs";
import {UUID} from "crypto";

export type ModConfig = {
    id: UUID,
    title: string,
    author: {
        name: string,
    },
    category: number,
    subtitle: string,
    compatibility: {
        blacklist: string[],
    }
}

export type ModFile = {
    config: ModConfig,
} & FileEntry

export type LocalMods = {
    config?: ModConfig,
} & FileEntry