'use client'

import React from 'react'
import Image from 'next/image'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import { Header } from '@/app/header'
import { useRouter } from 'next/navigation'

export default function EmulatorChoice() {
    const { supportedEmulators } = useEmulatorChoiceContext(EmulatorChoiceContext)
    const router = useRouter()

    return (
        <>
            <Header />
            <div className={'flex flex-row h-screen justify-evenly items-center'}>
                {supportedEmulators &&
                    supportedEmulators.map((emulator) => (
                        <button
                            className="card max-w-3xl lg:card-side shadow-xl"
                            key={emulator.name}
                            onClick={() => router.push('/emulators/' + emulator.name)}
                        >
                            <figure>
                                <Image
                                    alt={emulator.pictureAlt}
                                    width={64}
                                    height={64}
                                    src={emulator.picture}
                                    className="h-16 w-16 object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{emulator.name}</h2>
                                <p>{emulator.text}</p>
                            </div>
                        </button>
                    ))}
            </div>
        </>
    )
}
