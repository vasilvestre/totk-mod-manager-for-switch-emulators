'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { createContext, useState } from 'react'

type ThemeContextType = 'light' | 'dark'

const ThemeContext = createContext<ThemeContextType>('light')

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [theme, setTheme] = useState<ThemeContextType>('light')

    return (
        <ThemeContext.Provider value={theme}>
            <html lang="en">
                <body className={inter.className}>{children}</body>
            </html>
        </ThemeContext.Provider>
    )
}
