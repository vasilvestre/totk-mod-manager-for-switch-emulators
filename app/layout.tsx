'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import React, { useEffect, useState } from 'react'
import { AlertType, SupportedEmulator } from '@/app/types'
import { AppContext } from '@/app/appContext'
import Alert from '@/app/alert'
import { EmulatorChoiceContext } from '@/app/emulatorChoiceContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [alert, setAlert] = useState<AlertType | undefined>()
    const [emulatorChoice, setEmulatorChoice] = useState<string | null>('yuzu')
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

    return (
        <AppContext.Provider value={{ alert, setAlert }}>
            <EmulatorChoiceContext.Provider
                value={{
                    emulatorChoice,
                    setEmulatorChoice,
                    supportedEmulators,
                }}
            >
                <html lang="en">
                    <body className={inter.className}>
                        {children}
                        <Alert />
                    </body>
                </html>
            </EmulatorChoiceContext.Provider>
        </AppContext.Provider>
    )
}
