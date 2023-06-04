'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import React, { useEffect, useState } from 'react'
import { AppContext } from '@/src/context/appContext'
import Alert from '@/app/alert'
import { EmulatorChoiceContext } from '@/src/context/emulatorChoiceContext'
import { themeChange } from 'theme-change'
import { AlertType, EmulatorState, SupportedEmulator } from '@/src/types'
import { clearConfigFile, clearInnerCache } from '@/src/handler/debugHandler'
import { Header } from '@/app/header'
import { useRouter } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [theme, setTheme] = useState<'light' | 'dark'>('dark')
    const [alert, setAlert] = useState<AlertType | undefined>()
    const [emulatorState, setEmulatorState] = useState<EmulatorState | undefined>(undefined)
    const [appVersion, setAppVersion] = useState<string>('')
    const supportedEmulators: SupportedEmulator[] = [
        {
            name: 'yuzu',
            picture: 'https://yuzu-emu.org/images/logo.png',
            pictureAlt: 'yuzu logo',
            text: 'Yuzu is an experimental open-source emulator for the Nintendo Switch from the creators of Citra.',
        },
        {
            name: 'ryujinx',
            picture: 'https://ryujinx.org/assets/images/logo.png',
            pictureAlt: 'ryujinx logo',
            text: 'Ryujinx is a Nintendo Switch Emulator programmed in C#; unlike most emulators that are created with C++ or C.',
        },
    ]

    useEffect(() => {
        setTimeout(() => {
            setAlert(undefined)
        }, 8000)
    }, [alert])

    useEffect(() => {
        themeChange(false)
        ;(async () => {
            const { getVersion } = await import('@tauri-apps/api/app')

            setAppVersion(await getVersion())
        })()
        return () => {
            themeChange(false)
        }
    }, [])

    return (
        <AppContext.Provider value={{ alert, setAlert, theme, setTheme, appVersion }}>
            <EmulatorChoiceContext.Provider
                value={{
                    supportedEmulators,
                    emulatorState,
                    setEmulatorState,
                }}
            >
                <html lang="en" data-theme={'dark'}>
                    <body className={inter.className}>
                        {children}
                        <Alert />
                        <dialog id="app_modal" className="modal">
                            <form method="dialog" className="modal-box flex flex-col items-center">
                                <h3 className="font-bold text-lg">Debug panel for {appVersion}</h3>
                                <p className="py-4">Got issues ? Try these.</p>
                                <p className="py-4">
                                    <button className="btn" onClick={() => clearInnerCache()}>
                                        Clear inner cache (force relaunch)
                                    </button>
                                </p>
                                <p className="py-4">
                                    <button className="btn" onClick={() => clearConfigFile()}>
                                        Clear config file (force relaunch)
                                    </button>
                                </p>
                                <div className="modal-action">
                                    <button className="btn">Close</button>
                                </div>
                            </form>
                        </dialog>
                    </body>
                </html>
            </EmulatorChoiceContext.Provider>
        </AppContext.Provider>
    )
}
