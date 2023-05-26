'use client'

import React from 'react'
import Yuzu from '@/app/yuzu/page'
import Image from 'next/image'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/app/emulatorChoiceContext'
import { AppContext, useAppContext } from '@/app/appContext'

export default function Home() {
    const { setAlert } = useAppContext(AppContext)
    const { emulatorChoice, setEmulatorChoice, supportedEmulators } =
        useEmulatorChoiceContext(EmulatorChoiceContext)

    return (
        <>
            {emulatorChoice && emulatorChoice === 'yuzu' ? <Yuzu /> : <></>}
            {!emulatorChoice && (
                <div
                    className={
                        'flex flex-row h-screen justify-evenly items-center'
                    }
                >
                    {supportedEmulators &&
                        supportedEmulators.map((emulator) => {
                            return (
                                <button
                                    className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 bg-gray-200"
                                    key={emulator.name}
                                    onClick={() => {
                                        if (emulator.name === 'ryujinx') {
                                            setAlert({
                                                message: 'Not available yet',
                                                type: 'error',
                                            })
                                            return
                                        }
                                        setEmulatorChoice(emulator.name)
                                    }}
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
