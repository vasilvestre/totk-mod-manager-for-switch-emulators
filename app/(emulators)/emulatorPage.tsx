'use client'

import React, { useEffect, useState } from 'react'
import { ModContext } from '@/app/modContext'
import { AppContext, useAppContext } from '@/app/appContext'
import { EmulatorChoiceContext, useEmulatorChoiceContext } from '@/app/emulatorChoiceContext'
import { LocalMod, ModFile } from '@/src/types'
import { fetchGithubUpdatedMods, GithubRelease } from '@/src/handler/fetchGithubUpdatedMods'
import getErrorMessage from '@/src/handler/errorHandler'
import { filterMods } from '@/src/handler/modHandler'
import listMods from '@/src/handler/listmods'
import { clearInnerCache } from '@/src/handler/debugHandler'
import { askEmulator, checkEmulator, emulatorDefaultModFolder } from '@/src/handler/emulatorHandler'
import fetchMods from '@/src/handler/fetchMods'
import { Header } from '@/app/(emulators)/header'
import { ModsTable } from '@/app/(emulators)/modsTable'

export default function EmulatorPage(props: { emulatorName: string }) {
    const { setAlert, appVersion } = useAppContext(AppContext)
    const { emulatorState, setEmulatorState } = useEmulatorChoiceContext(EmulatorChoiceContext)

    const [localMods, setLocalMods] = useState<LocalMod[]>([])
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState<ModFile[]>()
    const [searchTerms, setSearchTerms] = useState<string>('')

    useEffect(() => {
        ;(async () => {
            try {
                setEmulatorState(await checkEmulator({ name: props.emulatorName }))
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
            }
        })()
    }, [props.emulatorName, setAlert, setEmulatorState])

    useEffect(() => {
        ;(async () => {
            try {
                if (emulatorState?.found && emulatorState?.path) {
                    setLocalMods(await fetchMods(await emulatorDefaultModFolder(emulatorState)))
                    setUpToDateMods(await fetchGithubUpdatedMods(setDownloadProgress))
                }
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
                setEmulatorState({
                    name: props.emulatorName,
                    found: false,
                    path: undefined,
                    version: undefined,
                })
            }
            setDownloadProgress(100)
        })()
    }, [emulatorState, setEmulatorState, setAlert, props.emulatorName])

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
                emulatorState,
                searchTerms,
                setSearchTerms,
            }}
        >
            <main className="min-h-screen justify-between">
                <Header />
                {emulatorState?.found === false && (
                    <div>
                        <button
                            onClick={async () => {
                                try {
                                    setEmulatorState(
                                        await askEmulator({ name: emulatorState.name })
                                    )
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
