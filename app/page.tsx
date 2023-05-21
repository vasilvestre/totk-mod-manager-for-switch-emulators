'use client';

import fetchTotkMods from "./fetchYuzuMods";
import {useEffect, useState} from "react";
import {FileEntry} from "@tauri-apps/api/fs";
import {fetchGithubUpdatedMods, GithubRelease} from "@/app/fetchGithubUpdatedMods";

export default function Home() {
    const [installedMods, setInstalledMods] = useState<FileEntry[]>([]);
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease|null>(null);

    useEffect(() => {
        fetchTotkMods().then((mods) => {
            setInstalledMods(mods);
        })
        fetchGithubUpdatedMods().then((mods) => {
            setUpToDateMods(mods);
            console.log(mods.data);
        })
    }, []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="grid grid-cols-2 items-center justify-center">
                <div>
                    Up to date mods metadata :
                    <ul>
                        {upToDateMods && (
                            <>
                                <li key={upToDateMods.data.name}>{upToDateMods.data.name}</li>
                                <li key={upToDateMods.data.created_at}>{upToDateMods.data.created_at}</li>
                            </>
                        )}
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
