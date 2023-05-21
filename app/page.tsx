"use client";

import fetchTotkMods from "./fetchYuzuMods";
import {useEffect, useState} from "react";
import {FileEntry} from "@tauri-apps/api/fs";

export default function Home() {
    const [installedMods, setInstalledMods] = useState<FileEntry[]>([]);
    const [upToDateMods, setUpToDateMods] = useState<[]>([]);

    useEffect(() => {
        fetchTotkMods().then((mods) => {
            setInstalledMods(mods);
        })

    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="grid grid-cols-2 items-center justify-center">
                <div>
                    Future to install mods
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
