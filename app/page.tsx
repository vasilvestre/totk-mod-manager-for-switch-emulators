'use client'

import fetchYuzuMods from './(handler)/fetchYuzuMods'
import { useEffect, useState } from 'react'
import {
    fetchGithubUpdatedMods,
    GithubRelease,
} from '@/app/(handler)/fetchGithubUpdatedMods'
import listMods from '@/app/(handler)/listmods'
import { LocalMod, ModFile, Yuzu } from '@/app/types'
import { filterMods } from '@/app/(handler)/modHandler'
import { ModContext } from '@/app/modContext'
import Alert from '@/app/alert'
import { Header } from '@/app/header'
import { DownloadBar } from '@/app/downloadBar'
import { ModsTable } from '@/app/modsTable'
import { askForYuzu, checkYuzu } from '@/app/(handler)/yuzuHandler'

export default function Home() {
    const [localMods, setLocalMods] = useState<LocalMod[]>([])
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState<ModFile[]>()
    const [yuzuState, setYuzuState] = useState<Yuzu>()
    const [alert, setAlert] = useState<
        { message: string; type: string; data?: any[] } | undefined
    >()

    useEffect(() => {
        ;(async () => {
            try {
                setYuzuState(await checkYuzu())
            } catch (e: any) {
                console.error(e)
                setAlert({ message: e.message, type: 'error' })
            }
        })()
    }, [])

    useEffect(() => {
        ;(async () => {
            try {
                if (yuzuState?.found && yuzuState?.path) {
                    setLocalMods(await fetchYuzuMods(yuzuState.path))
                    setUpToDateMods(
                        await fetchGithubUpdatedMods(setDownloadProgress)
                    )
                } else {
                    setAlert({
                        message: 'Please locate Yuzu folder',
                        type: 'warning',
                    })
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
    }, [yuzuState, setYuzuState])

    useEffect(() => {
        setTimeout(() => {
            setAlert(undefined)
        }, 5000)
    }, [alert])

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
    }, [localMods, upToDateMods])

    return (
        <ModContext.Provider
            value={{
                mods,
                localMods,
                upToDateMods,
                downloadProgress,
                alert,
                setAlert,
                setLocalMods,
                setMods,
                yuzuState,
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
                <Alert />
            </main>
        </ModContext.Provider>
    )
}
