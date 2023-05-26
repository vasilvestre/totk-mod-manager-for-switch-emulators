'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { AlertType } from '@/app/types'
import { AppContext } from '@/app/appContext'
import Alert from '@/app/alert'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [alert, setAlert] = useState<AlertType | undefined>()

    return (
        <AppContext.Provider value={{ alert, setAlert }}>
            <html lang="en">
                <body className={inter.className}>
                    {children}
                    <Alert />
                </body>
            </html>
        </AppContext.Provider>
    )
}
