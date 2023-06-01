import { Context, createContext, useContext } from 'react'
import { SupportedEmulator, EmulatorState } from '@/src/types'

interface EmulatorChoiceContextType {
    supportedEmulators: SupportedEmulator[]
    emulatorState: EmulatorState | undefined
    setEmulatorState: (value: EmulatorState | undefined) => void
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
