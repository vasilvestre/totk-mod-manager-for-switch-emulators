'use client'

import React from 'react'
import Image from 'next/image'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import EmulatorPage from '@/app/emulators/emulatorPage'

export default function EmulatorChoice() {
    const { supportedEmulators, emulatorState, setEmulatorState } =
        useEmulatorChoiceContext(EmulatorChoiceContext)

    if (!emulatorState) {
        return (
            <>
                {!emulatorState && (
                    <div className={'flex flex-row h-screen justify-evenly items-center'}>
                        {supportedEmulators &&
                            supportedEmulators.map((emulator) => {
                                return (
                                    <button
                                        className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 bg-gray-200"
                                        key={emulator.name}
                                        onClick={() => setEmulatorState({ name: emulator.name })}
                                    >
                                        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

                                        <div className="sm:flex sm:justify-between sm:gap-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 sm:text-xl capitalize">
                                                    {emulator.name}
                                                </h3>
                                            </div>

                                            <div className="hidden sm:block sm:shrink-0">
                                                <Image
                                                    alt={emulator.pictureAlt}
                                                    width={64}
                                                    height={64}
                                                    src={emulator.picture}
                                                    className="h-16 w-16 object-cover"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="max-w-[40ch] text-sm text-gray-500">
                                                {emulator.text}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                    </div>
                )}
            </>
        )
    }

    switch (emulatorState.name) {
        case 'yuzu':
            return <EmulatorPage emulatorName={emulatorState.name} />
        case 'ryujinx':
            return <EmulatorPage emulatorName={emulatorState.name} />
        default:
            return <></>
    }
}
