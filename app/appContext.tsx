import { Context, createContext, useContext } from 'react'
import {
    AlertType,
    EmulatorChoice,
    LocalMod,
    ModFile,
    SupportedEmulator,
    YuzuState,
} from '@/app/types'
import { GithubRelease } from '@/app/(handler)/fetchGithubUpdatedMods'

interface AppContextType {
    alert: AlertType | undefined
    setAlert: Function
}

export const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = (context: Context<AppContextType | null>) => {
    const appContext = useContext(context)

    if (!appContext) {
        throw new Error('useAlert must be used within a AppContext')
    }

    return appContext
}
