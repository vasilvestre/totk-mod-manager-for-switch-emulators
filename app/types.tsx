import { FileEntry } from '@tauri-apps/api/fs'
import { UUID } from 'crypto'

export type EmulatorChoice = {
    emulatorChoice: string | null
    setEmulatorChoice: Function
    supportedEmulators: SupportedEmulator[]
}

export type SupportedEmulator = {
    name: string
    picture: string
    pictureAlt: string
    text: string
}

export type AlertType = { message: string; type: string; data?: any[] }

export type YuzuState = {
    version: string | undefined
    path: string | undefined
    found: boolean
}

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
