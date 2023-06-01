'use client'

import React, { useEffect, useState } from 'react'
import { ModContext } from '@/app/yuzu/modContext'
import { Header } from '@/app/yuzu/header'
import { ModsTable } from '@/app/yuzu/modsTable'
import { AppContext, useAppContext } from '@/app/appContext'
import { EmulatorChoiceContext, useEmulatorChoiceContext } from '@/app/emulatorChoiceContext'
import { LocalMod, ModFile, YuzuState } from '@/src/types'
import { fetchGithubUpdatedMods, GithubRelease } from '@/src/handler/fetchGithubUpdatedMods'
import { askForYuzu, checkYuzu } from '@/src/handler/yuzuHandler'
import getErrorMessage from '@/src/handler/errorHandler'
import fetchYuzuMods from '@/src/handler/fetchYuzuMods'
import { filterMods } from '@/src/handler/modHandler'
import listMods from '@/src/handler/listmods'
import { clearInnerCache } from '@/src/handler/debugHandler'
export default function Yuzu() {
    const { setAlert, appVersion } = useAppContext(AppContext)
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
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
            }
        })()
    }, [setAlert])

    useEffect(() => {
        ;(async () => {
            try {
                if (yuzuState?.found && yuzuState?.path) {
                    setLocalMods(await fetchYuzuMods(yuzuState.path))
                    setUpToDateMods(await fetchGithubUpdatedMods(setDownloadProgress))
                }
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
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
                    setMods(filterMods(await listMods(upToDateMods.data.name), localMods))
                }
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
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
                {yuzuState?.found === false && (
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    setYuzuState(await askForYuzu())
                                } catch (e) {
                                    console.error(e)
                                    setAlert({
                                        message: getErrorMessage(e),
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
                <dialog id="app_modal" className="modal">
                    <form method="dialog" className="modal-box">
                        <h3 className="font-bold text-lg">Debug panel for {appVersion}</h3>
                        <p className="py-4">Got issues ? Try these.</p>
                        <p className="py-4">
                            <button className="btn" onClick={() => clearInnerCache()}>
                                Clear inner cache (force relaunch)
                            </button>
                        </p>
                        <div className="modal-action">
                            <button className="btn">Close</button>
                        </div>
                    </form>
                </dialog>
            </main>
        </ModContext.Provider>
    )
}
