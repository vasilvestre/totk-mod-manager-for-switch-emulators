'use client'

import React, { useEffect } from 'react'
import { AppContext, useAppContext } from '@/src/context/appContext'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import getErrorMessage from '@/src/handler/errorHandler'
import { askEmulator, checkEmulator } from '@/src/handler/emulatorHandler'
import { Header } from '@/app/emulators/header'
import { ModsTable } from '@/app/emulators/[name]/modsTable'
import { ModContext, useModContext } from '@/src/context/modContext'

export default function Page({ params }: { params: { name: string } }) {
    const { setAlert } = useAppContext(AppContext)
    const { emulatorState, setEmulatorState } = useEmulatorChoiceContext(EmulatorChoiceContext)
    const { modGithubRelease, mods } = useModContext(ModContext)

    useEffect(() => {
        ;(async () => {
            try {
                setEmulatorState(await checkEmulator({ name: params.name }))
            } catch (e) {
                console.error(e)
                setAlert({ message: getErrorMessage(e), type: 'error' })
            }
        })()
    }, [params.name, setAlert, setEmulatorState])

    useEffect(() => {
        if (emulatorState?.found === true && mods?.length === 0) {
            setAlert({
                message: 'No mods found, try cleaning the inner cache or downloaded archive in zip',
                type: 'error',
            })
            setEmulatorState({
                name: params.name,
                found: false,
                path: undefined,
                version: undefined,
            })
        }
    }, [emulatorState?.found, mods?.length, params.name, setAlert, setEmulatorState])

    return (
        <>
            <Header
                title={
                    modGithubRelease
                        ? 'Mod collection version : ' +
                          modGithubRelease.data.name +
                          ' released on ' +
                          new Date(
                              Date.parse(modGithubRelease.data.created_at)
                          ).toLocaleDateString()
                        : ''
                }
            />
            {emulatorState?.found === false && (
                <div>
                    <button
                        onClick={async () => {
                            try {
                                setEmulatorState(await askEmulator({ name: emulatorState.name }))
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
        </>
    )
}
