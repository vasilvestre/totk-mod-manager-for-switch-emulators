import { Context, createContext, useContext } from 'react'
import {
    EmulatorChoice,
    LocalMod,
    ModFile,
    SupportedEmulator,
    YuzuState,
} from '@/app/types'
import { GithubRelease } from '@/app/(handler)/fetchGithubUpdatedMods'

interface EmulatorChoiceContextType {
    emulatorChoice: string | null
    setEmulatorChoice: Function
    supportedEmulators: SupportedEmulator[]
}

export const EmulatorChoiceContext =
    createContext<EmulatorChoiceContextType | null>(null)

export const useEmulatorChoiceContext = (
    context: Context<EmulatorChoiceContextType | null>
) => {
    const emulatorChoiceContext = useContext(context)

    if (!emulatorChoiceContext) {
        throw new Error('useAlert must be used within a EmulatorChoiceContext')
    }

    return emulatorChoiceContext
}
