'use client';

import fetchTotkMods from "./fetchYuzuMods";
import {useEffect, useState} from "react";
import {FileEntry} from "@tauri-apps/api/fs";
import {
    modsSourceExists,
    fetchGithubUpdatedMods,
    fetchGithubUpdatedModsSource,
    GithubRelease, extractZip
} from "@/app/fetchGithubUpdatedMods";
import listMods from "@/app/listmods";

export default function Home() {
    const [installedMods, setInstalledMods] = useState<FileEntry[]>([]);
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease|null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0)
    const [mods, setMods] = useState({categories: []});

    useEffect(() => {
        fetchTotkMods().then((mods) => {
            setInstalledMods(mods);
        })
        fetchGithubUpdatedMods().then((mods) => {
            setUpToDateMods(mods);
            modsSourceExists(mods.data.assets[0].name)
                .then((exists) => {
                    if (!exists) {
                        fetchGithubUpdatedModsSource(mods.data.assets[0].browser_download_url, mods.data.assets[0].name, mods.data.assets[0].size, setDownloadProgress)
                            .catch(() => console.error('Error while downloading mods source'))
                    } else {
                        setDownloadProgress(100)
                    }
                    extractZip(mods.data.assets[0].name, mods.data.name)
                        .then(() => {
                            listMods(mods.data.name)
                                .then((mods) => {
                                    setMods(mods)
                                })
                        })
                })
        })
    }, []);

    return (
        <main className="min-h-screen">
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{width: downloadProgress+'%'}}></div>
            </div>
            <div className={'grid grid-cols-2 min-h-full items-center justify-between p-4'}>
                <div className={'flex-col items-center'}>
                    <label>Up to date mods metadata :</label>
                    <ul>
                        {upToDateMods && (
                            <>
                                <li key={upToDateMods.data.name}>{upToDateMods.data.name}</li>
                                <li key={upToDateMods.data.created_at}>{upToDateMods.data.created_at}</li>
                            </>
                        )}
                        {mods && mods.categories.map((mod) => (
                            <li key={mod}>{mod}</li>
                        ))}
                    </ul>

                </div>
                <div>
                    Already installed mods :
                    <ul>
                        {installedMods.map((mod) => (
                            <li key={mod.path}>{mod.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
  );
}
