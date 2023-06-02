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
import { clearConfigFile, clearInnerCache } from '@/src/handler/debugHandler'
import { askEmulator, checkEmulator, emulatorDefaultModFolder } from '@/src/handler/emulatorHandler'
import { fetchMods, listMods } from '@/src/handler/localModHandler'
import { Header } from '@/app/emulators/header'
import { ModsTable } from '@/app/emulators/modsTable'

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
                if (emulatorState && emulatorState.found) {
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
    }, [emulatorState, props.emulatorName, setAlert, setEmulatorState])

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
                            Please locate {emulatorState.name} folder containing Mods folder
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
