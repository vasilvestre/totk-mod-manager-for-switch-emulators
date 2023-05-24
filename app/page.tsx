'use client'

import fetchTotkMods from "./fetchYuzuMods";
import {useEffect, useState} from "react";
import {
    modsSourceExists,
    fetchGithubUpdatedMods,
    fetchGithubUpdatedModsSource,
    GithubRelease, extractZip
} from "@/app/fetchGithubUpdatedMods";
import listMods from "@/app/listmods";
import {Categories, CategoryNames} from "@/app/categories";
import {ModFile, LocalMods} from "@/app/types";
import {checkIncompatibilities, installSingleMod} from "@/app/modHandler";

export default function Home() {
    const [localMods, setLocalMods] = useState<LocalMods[]>([]);
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState<ModFile[]>();
    const [alert, setAlert] = useState<{ message: string, type: string, data?: any[] } | undefined>()

    useEffect(() => {
        (async () => {
            try {
                setLocalMods(await fetchTotkMods())
                let mods = await fetchGithubUpdatedMods()
                setUpToDateMods(mods)
                if (!await modsSourceExists(mods.data.assets[0].name)) {
                    await fetchGithubUpdatedModsSource(mods.data.assets[0].browser_download_url, mods.data.assets[0].name, mods.data.assets[0].size, setDownloadProgress)
                }
                await extractZip(mods.data.assets[0].name, mods.data.name)
                setMods(await listMods(mods.data.name))
            } catch (e: any) {
                console.error(e.message)
                setAlert({message: e.message, type: 'error'})
            }
            setDownloadProgress(100)
        })();
    }, [])

    useEffect(() => {
        setTimeout(() => {
            // setAlert(undefined)
        }, 5000)
    }, [alert])

    return (
        <main className="min-h-screen justify-between">
            <header aria-label="Page Header"
                    className={"min-h-[300px] bg-[url('https://wallpapercave.com/wp/wp11520757.jpg')]"}>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div className="text-center sm:text-left">
                            {upToDateMods && (
                                <>
                                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        Last version is {upToDateMods.data.name}
                                    </h1>
                                    <p className="mt-1.5 text-sm text-gray-800">
                                        Last release was made at {upToDateMods.data.created_at} !
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
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: downloadProgress + '%'}}></div>
            </div>
            <div className={'flex flex-col min-h-full min-w-full items-center justify-center p-4 mb-auto overflow-x-auto'}>
                    <table className="min-w-fit divide-y-2 divide-gray-200 bg-white text-sm">
                        <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="px-4 py-2">
                                <label htmlFor="SelectAll" className="sr-only">Select All</label>

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
                            <th className="px-4 py-2"></th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {mods && mods.map((mod) => {
                            let config = mod.config
                            return (
                                <tr key={config.title}>
                                    <td className="px-4 py-2">
                                        <label className="sr-only" htmlFor="Row1">Row 1</label>

                                        <input
                                            className="h-5 w-5 rounded border-gray-300"
                                            type="checkbox"
                                            id="Row1"
                                        />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                        {config.title}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{config.subtitle}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{config.author.name}</td>
                                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">{CategoryNames[Categories[config.category] as keyof typeof CategoryNames]}</td>
                                    <td className="whitespace-nowrap px-4 py-2">
                                        <a
                                            href="#"
                                            className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                                            onClick={async (e) => {
                                                if (typeof localMods.find(localMod => localMod.name === mod.name) === 'object') return
                                                try {
                                                    await checkIncompatibilities(mod, localMods)
                                                    // await installSingleMod(mod)
                                                    setLocalMods(await fetchTotkMods())
                                                } catch (e: any) {
                                                    console.error(e)
                                                    setAlert({message: e.message, type: 'error', data: e.data})
                                                }
                                            }}
                                        >
                                            {typeof localMods.find(localMod => localMod.name === mod.name) === 'undefined' ? "Install" : "Already installed"}
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
            </div>
            {alert && (
            <div className={'flex sticky top-[100vh] items-center justify-center p-4 mb-auto'}>
                    <div role="alert" className="rounded border-s-4 border-red-500 bg-red-50 p-4 sticky top-[100vh]">
                        <strong className="block font-medium text-red-800">{alert.message}</strong>
                        <p className="mt-2 text-sm text-red-700">
                            { alert.data && alert.data.map((data: string, index: number) => <p key={index}>{data}</p>) }
                        </p>
                    </div>
            </div>
            )}
        </main>
    );
}
