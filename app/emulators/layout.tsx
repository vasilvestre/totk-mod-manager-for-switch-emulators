'use client'

import React, { useEffect, useState } from 'react'
import { ModContext } from '@/src/context/modContext'
import { AppContext, useAppContext } from '@/src/context/appContext'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import { LocalMod, ModFile } from '@/src/types'
import { fetchGithubUpdatedMods, GithubRelease } from '@/src/handler/fetchGithubUpdatedMods'
import getErrorMessage from '@/src/handler/errorHandler'
import { filterMods } from '@/src/handler/modHandler'
import { askEmulator, checkEmulator, emulatorDefaultModFolder } from '@/src/handler/emulatorHandler'
import { fetchMods, listMods } from '@/src/handler/localModHandler'
import { Header } from '@/app/emulators/[name]/header'
import { ModsTable } from '@/app/emulators/[name]/modsTable'

export default function Layout({ children }: { children: React.ReactNode }) {
    const { setAlert } = useAppContext(AppContext)
    const { emulatorState } = useEmulatorChoiceContext(EmulatorChoiceContext)

    const [localMods, setLocalMods] = useState<LocalMod[]>([])
    const [modGithubRelease, setModGithubRelease] = useState<GithubRelease | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState<ModFile[]>()
    const [searchTerms, setSearchTerms] = useState<string>('')

    useEffect(() => {
        ;(async () => {
            try {
                if (emulatorState && emulatorState.found) {
                    setLocalMods(await fetchMods(await emulatorDefaultModFolder(emulatorState)))
                    setModGithubRelease(await fetchGithubUpdatedMods(setDownloadProgress))
                }
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
            }
            setDownloadProgress(100)
        })()
    }, [emulatorState, setAlert])

    useEffect(() => {
        ;(async () => {
            try {
                if (modGithubRelease?.data.name) {
                    setMods(filterMods(await listMods(modGithubRelease.data.name), localMods))
                }
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
            }
        })()
    }, [localMods, setAlert, modGithubRelease])

    return (
        <ModContext.Provider
            value={{
                mods,
                localMods,
                modGithubRelease,
                downloadProgress,
                setLocalMods,
                setMods,
                emulatorState,
                searchTerms,
                setSearchTerms,
            }}
        >
            <main className="min-h-screen justify-between">{children}</main>
        </ModContext.Provider>
    )
}
