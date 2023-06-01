import { Context, createContext, useContext } from 'react'
import { SupportedEmulator } from '@/src/types'

interface EmulatorChoiceContextType {
    emulatorChoice: string | null
    setEmulatorChoice: (emulatorChoice: string | null) => void
    supportedEmulators: SupportedEmulator[]
}

export const EmulatorChoiceContext = createContext<EmulatorChoiceContextType | null>(null)

export const useEmulatorChoiceContext = (context: Context<EmulatorChoiceContextType | null>) => {
    const emulatorChoiceContext = useContext(context)

    if (!emulatorChoiceContext) {
        throw new Error(
            "A function from EmulatorChoiceContext can't be used outside EmulatorChoiceContext"
        )
    }

    return emulatorChoiceContext
}
