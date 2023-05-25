'use client'

import fetchYuzuMods from './(handler)/fetchYuzuMods'
import { useEffect, useState } from 'react'
import {
    fetchGithubUpdatedMods,
    GithubRelease,
} from '@/app/(handler)/fetchGithubUpdatedMods'
import listMods from '@/app/(handler)/listmods'
import { Enum, CategoryNames } from '@/app/enum'
import { ModFile, LocalMod, ModConfig } from '@/app/types'
import {
    checkIncompatibilities,
    installSingleMod,
    removeSingleMod, tryInstall, tryRemove, tryUpdate,
} from '@/app/(handler)/modHandler'
import { FileEntry } from '@tauri-apps/api/fs'

export default function Home() {
    const [localMods, setLocalMods] = useState<LocalMod[]>([])
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease | null>(null)
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState<ModFile[]>()
    const [alert, setAlert] = useState<
        { message: string; type: string; data?: any[] } | undefined
    >()

    useEffect(() => {
        ;(async () => {
            try {
                setLocalMods(await fetchYuzuMods())
                setUpToDateMods(
                    await fetchGithubUpdatedMods(setDownloadProgress)
                )
                setMods(await listMods(upToDateMods?.data.name))
            } catch (e: any) {
                console.error(e.message)
                setAlert({ message: e.message, type: 'error' })
            }
            setDownloadProgress(100)
        })()
    }, [upToDateMods?.data.name])

    useEffect(() => {
        setTimeout(() => {
            setAlert(undefined)
        }, 5000)
    }, [alert])

    return (
        <main className="min-h-screen justify-between">
            <header
                aria-label="Page Header"
                className={
                    "min-h-[300px] bg-[url('https://wallpapercave.com/wp/wp11520757.jpg')]"
                }
            >
                <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            {upToDateMods && (
                                <>
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        Last version is {upToDateMods.data.name}
                                    </h1>
                                    <p className="mt-1.5 text-sm text-gray-800">
                                        Last release was made at{' '}
                                        {upToDateMods.data.created_at} !
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                            <button
                                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                type="button"
                            >
                                Auto update enabled
                            </button>
                            <button
                                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                type="button"
                            >
                                Install/update selected mod
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: downloadProgress + '%' }}
                ></div>
            </div>
            <div
                className={
                    'overflow-x-auto'
                }
            >
                <table className="divide-y-2 divide-gray-200 bg-white text-sm w-full">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Title
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Mod version
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Author
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Category
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Game version
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Incompatibility
                            </th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-center">
                        {mods &&
                            mods.map((mod) => {
                                let config = mod.config
                                return (
                                    <tr key={config.id} className={"odd:bg-blue-100"}>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            {config.title}
                                            <br/>
                                            {config?.subtitle !== config.title && (
                                                <p className="mt-1.5 text-sm text-gray-700">
                                                    {config.subtitle}
                                                </p>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            {config.version}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {config.author?.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {
                                                CategoryNames[
                                                    Enum[
                                                        config.category
                                                    ] as keyof typeof CategoryNames
                                                ]
                                            }
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {config.game.version.map(
                                                (item, index) => (
                                                    <div key={index}>
                                                        {item}
                                                    </div>
                                                )
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {mods
                                                .filter((mod) =>
                                                    config.compatibility?.blacklist?.includes(
                                                        mod.config.id
                                                    )
                                                )
                                                .map((mod, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {mod.config.title}
                                                        </div>
                                                    )
                                                })}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2">
                                            <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
                                                {typeof localMods.find(
                                                    (localMod) =>
                                                        localMod.name ===
                                                        mod.name
                                                ) === 'undefined' ? (
                                                    <button
                                                        className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                        onClick={tryInstall(
                                                            mod,
                                                            localMods,
                                                            setLocalMods,
                                                            setAlert
                                                        )}
                                                    >
                                                        Install
                                                    </button>
                                                ) : (
                                                    <>
                                                        {localMods.find(
                                                            (localMod) =>
                                                                localMod.name ===
                                                                mod.name
                                                        )?.config?.version !==
                                                            mod.config
                                                                .version && (
                                                            <button
                                                                className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:relative"
                                                                onClick={tryUpdate(
                                                                    mod,
                                                                    localMods,
                                                                    setLocalMods,
                                                                    setAlert
                                                                )}
                                                            >
                                                                Update
                                                            </button>
                                                        )}
                                                        <button
                                                            className="inline-block px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:relative"
                                                            onClick={tryRemove(
                                                                localMods.find(
                                                                    (
                                                                        localMod
                                                                    ) =>
                                                                        localMod.name ===
                                                                        mod.name
                                                                ),
                                                                setLocalMods,
                                                                setAlert
                                                            )}
                                                        >
                                                            Remove
                                                        </button>
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
            {alert && (
                <div
                    className={
                        'flex sticky top-[100vh] items-center justify-center p-4 mb-auto'
                    }
                >
                    <div
                        role="alert"
                        className="rounded border-s-4 border-red-500 bg-red-50 p-4 sticky top-[100vh]"
                    >
                        <strong className="block font-medium text-red-800">
                            {alert.message}
                        </strong>
                        <div className="mt-2 text-sm text-red-700">
                            <ul>
                                {alert.data &&
                                    alert.data.map(
                                        (data: string, index: number) => (
                                            <li key={index}>{data}</li>
                                        )
                                    )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
