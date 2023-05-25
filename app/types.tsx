import { FileEntry } from '@tauri-apps/api/fs'
import { UUID } from 'crypto'

export type ModConfig = {
    id: UUID
    title: string
    subtitle?: string
    version?: string
    game: {
        titleId: string
        version: string[]
    }
    author?: {
        name: string
        link?: URL
    }
    category: number
    compatibility?: {
        blacklist?: string[]
    }
}

export type ModFile = {
    config: ModConfig
} & FileEntry

export type LocalMod = {
    config?: ModConfig
} & FileEntry
