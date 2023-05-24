import { FileEntry } from '@tauri-apps/api/fs'
import { UUID } from 'crypto'

export type ModConfig = {
    id: UUID
    title: string
    version?: string
    game: {
        titleId: string
        version: string[]
    }
    author: {
        name: string
        link: URL
    }
    category: number
    subtitle: string
    compatibility: {
        blacklist: string[]
    }
}

export type ModFile = {
    config: ModConfig
} & FileEntry

export type LocalMods = {
    config?: ModConfig
} & FileEntry
