import { Context, createContext, useContext } from 'react'
import { AlertType } from '@/app/types'

interface AppContextType {
    alert: AlertType | undefined
    setAlert: (value: AlertType | undefined) => void
    theme: 'light' | 'dark'
    setTheme: (value: 'light' | 'dark') => void
}

export const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = (context: Context<AppContextType | null>) => {
    const appContext = useContext(context)

    if (!appContext) {
        throw new Error("A function from AppContext can't be used outside AppContextProvider")
    }

    return appContext
}
