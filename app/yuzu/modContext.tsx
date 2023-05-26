import { Context, createContext, useContext } from 'react'
import { LocalMod, ModFile, YuzuState } from '@/app/types'
import { GithubRelease } from '@/app/(handler)/fetchGithubUpdatedMods'

interface ModContextType {
    mods: ModFile[] | undefined
    localMods: LocalMod[]
    upToDateMods: GithubRelease | null
    downloadProgress: number
    setLocalMods: (value: LocalMod[]) => void
    setMods: (value: ModFile[] | undefined) => void
    yuzuState: YuzuState | undefined
}
export const ModContext = createContext<ModContextType | null>(null)

export const useModContext = (context: Context<ModContextType | null>) => {
    const modContext = useContext(context)

    if (!modContext) {
        throw new Error('useAlert must be used within a ModContext')
    }

    return modContext
}
