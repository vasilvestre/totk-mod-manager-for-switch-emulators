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
    removeSingleMod,
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

    function tryInstall(mod: { config: ModConfig } & FileEntry) {
        return async () => {
            try {
                await checkIncompatibilities(mod, localMods)
                await installSingleMod(mod)
                setLocalMods(await fetchYuzuMods())
            } catch (e: any) {
                console.error(e)
                setAlert({
                    message: e.message,
                    type: 'error',
                    data: e.data,
                })
            }
        }
    }

    function tryRemove(mod: LocalMod | undefined) {
        return async () => {
            try {
                if (mod) {
                    await removeSingleMod(mod)
                    setLocalMods(await fetchYuzuMods())
                } else {
                    throw new Error()
                }
            } catch (e: any) {
                console.error(e)
                setAlert({
                    message: e.message,
                    type: 'error',
                    data: e.data,
                })
            }
        }
    }

    return (
        <main className="min-h-screen justify-between">
            <header
                aria-label="Page Header"
                className={
                    "min-h-[300px] bg-[url('https://wallpapercave.com/wp/wp11520757.jpg')]"
                }
            >
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: downloadProgress + '%' }}
                ></div>
            </div>
            <div
                className={
                    'flex flex-col min-h-full min-w-full items-center justify-center p-4 mb-auto overflow-x-auto'
                }
            >
                <table className="min-w-fit divide-y-2 divide-gray-200 bg-white text-sm">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="px-4 py-2">
                                <label htmlFor="SelectAll" className="sr-only">
                                    Select All
                                </label>

                                <input
                                    type="checkbox"
                                    id="SelectAll"
                                    className="h-5 w-5 rounded border-gray-300"
                                />
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Title
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Description
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
                    <tbody className="divide-y divide-gray-200">
                        {mods &&
                            mods.map((mod) => {
                                let config = mod.config
                                return (
                                    <tr key={config.title}>
                                        <td className="px-4 py-2">
                                            <label
                                                className="sr-only"
                                                htmlFor="Row1"
                                            >
                                                Row 1
                                            </label>

                                            <input
                                                className="h-5 w-5 rounded border-gray-300"
                                                type="checkbox"
                                                id="Row1"
                                            />
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                            {config.title}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {config.subtitle}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                                            {config.author.name}
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
                                                    config.compatibility.blacklist.includes(
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
                                            {typeof localMods.find(
                                                (localMod) =>
                                                    localMod.name === mod.name
                                            ) === 'undefined' ? (
                                                <a
                                                    href="#"
                                                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                                    onClick={tryInstall(mod)}
                                                >
                                                    Install
                                                </a>
                                            ) : (
                                                <a
                                                    href="#"
                                                    className="inline-block rounded px-4 py-2 text-xs font-medium text-white bg-red-700 hover:bg-red-800"
                                                    onClick={tryRemove(
                                                        localMods.find(
                                                            (localMod) =>
                                                                localMod.name ===
                                                                mod.name
                                                        )
                                                    )}
                                                >
                                                    Remove
                                                </a>
                                            )}
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
