'use client'

import fetchYuzuMods from '../(handler)/fetchYuzuMods'
import { useEffect, useState } from 'react'
import {
    fetchGithubUpdatedMods,
    GithubRelease,
} from '@/app/(handler)/fetchGithubUpdatedMods'
import listMods from '@/app/(handler)/listmods'
import { LocalMod, ModFile, YuzuState } from '@/app/types'
import { filterMods } from '@/app/(handler)/modHandler'
import { ModContext } from '@/app/yuzu/modContext'
import { Header } from '@/app/yuzu/header'
import { DownloadBar } from '@/app/yuzu/downloadBar'
import { ModsTable } from '@/app/yuzu/modsTable'
import { askForYuzu, checkYuzu } from '@/app/(handler)/yuzuHandler'
import { AppContext, useAppContext } from '@/app/appContext'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/app/emulatorChoiceContext'

export default function Yuzu() {
    const { setAlert } = useAppContext(AppContext)
    useEmulatorChoiceContext(EmulatorChoiceContext)

    const [localMods, setLocalMods] = useState<LocalMod[]>([])
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState<ModFile[]>()
    const [yuzuState, setYuzuState] = useState<YuzuState>()
    const [searchTerms, setSearchTerms] = useState<string>('')

    useEffect(() => {
        ;(async () => {
            try {
                setYuzuState(await checkYuzu())
            } catch (e: any) {
                console.error(e)
                setAlert({ message: e.message, type: 'error' })
            }
        })()
    }, [setAlert])

    useEffect(() => {
        ;(async () => {
            try {
                if (yuzuState?.found && yuzuState?.path) {
                    setLocalMods(await fetchYuzuMods(yuzuState.path))
                    setUpToDateMods(
                        await fetchGithubUpdatedMods(setDownloadProgress)
                    )
                }
            } catch (e: any) {
                console.error(e)
                setAlert({ message: e.message, type: 'error' })
                setYuzuState({
                    found: false,
                    path: undefined,
                    version: undefined,
                })
            }
            setDownloadProgress(100)
        })()
    }, [yuzuState, setYuzuState, setAlert])

    useEffect(() => {
        ;(async () => {
            try {
                if (upToDateMods?.data.name) {
                    setMods(
                        filterMods(
                            await listMods(upToDateMods.data.name),
                            localMods
                        )
                    )
                }
            } catch (e: any) {
                console.error(e)
                setAlert({ message: e.message, type: 'error' })
            }
        })()
    }, [localMods, setAlert, upToDateMods])

    return (
        <ModContext.Provider
            value={{
                mods,
                localMods,
                upToDateMods,
                downloadProgress,
                setLocalMods,
                setMods,
                yuzuState,
                searchTerms,
                setSearchTerms,
            }}
        >
            <main className="min-h-screen justify-between">
                <Header />
                <DownloadBar />
                {yuzuState?.found === false && (
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    setYuzuState(await askForYuzu())
                                } catch (e: any) {
                                    console.error(e)
                                    setAlert({
                                        message: e.message,
                                        type: 'error',
                                    })
                                }
                            }}
                        >
                            Please locate Yuzu folder
                        </button>
                    </div>
                )}
                <div className={'overflow-x-auto'}>
                    <ModsTable />
                </div>
            </main>
        </ModContext.Provider>
    )
}
