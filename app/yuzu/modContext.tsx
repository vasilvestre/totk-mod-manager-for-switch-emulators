import { Context, createContext, useContext } from 'react'
import { LocalMod, ModFile, YuzuState } from '@/src/types'
import { GithubRelease } from '@/src/handler/fetchGithubUpdatedMods'

interface ModContextType {
    mods: ModFile[] | undefined
    localMods: LocalMod[]
    upToDateMods: GithubRelease | null
    downloadProgress: number
    setLocalMods: (value: LocalMod[]) => void
    setMods: (value: ModFile[] | undefined) => void
    yuzuState: YuzuState | undefined
    searchTerms: string
    setSearchTerms: (value: string) => void
}
export const ModContext = createContext<ModContextType | null>(null)

export const useModContext = (context: Context<ModContextType | null>) => {
    const modContext = useContext(context)

    if (!modContext) {
        throw new Error('A function from ModContext can only be used inside ModContextProvider')
    }

    return modContext
}
