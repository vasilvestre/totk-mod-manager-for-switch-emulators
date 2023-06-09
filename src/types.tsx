import { FileEntry } from '@tauri-apps/api/fs'
import { UUID } from 'crypto'
import { File, ModModel } from '@/src/gamebanana/types'

declare global {
    interface Window {
        app_modal: HTMLDialogElement
    }
}

export type EmulatorChoice = {
    emulatorChoice: string | null
    setEmulatorChoice: (emulatorChoice: string | null) => void
    supportedEmulators: SupportedEmulator[]
}

export type SupportedEmulator = {
    name: string
    picture: string
    pictureAlt: string
    text: string
}

export type AlertType = { message: string; type: string; data?: string[] }

export type EmulatorState = {
    name: string
    version?: string | undefined
    path?: string | undefined
    found?: boolean
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
    gamebanana?: {
        mod: ModModel
        file: File
    }
} & FileEntry

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
}
