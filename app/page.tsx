"use client";

import fetchYuzuMods from "./(handler)/fetchYuzuMods";
import {useEffect, useState} from "react";
import {fetchGithubUpdatedMods, GithubRelease,} from "@/app/(handler)/fetchGithubUpdatedMods";
import listMods from "@/app/(handler)/listmods";
import {CategoryNames, Enum} from "@/app/enum";
import {LocalMod, ModFile} from "@/app/types";
import {filterMods, tryInstall, tryRemove, tryUpdate,} from "@/app/(handler)/modHandler";
import {ModContext} from "@/app/modContext";
import Alert from "@/app/alert";
import {Header} from "@/app/header";
import {DownloadBar} from "@/app/downloadBar";
import {ModsTable} from "@/app/modsTable";

export default function Home() {
    const [localMods, setLocalMods] = useState<LocalMod[]>([]);
    const [upToDateMods, setUpToDateMods] = useState<GithubRelease | null>(null);
    const [downloadProgress, setDownloadProgress] = useState<number>(0);
    const [mods, setMods] = useState<ModFile[]>();
    const [alert, setAlert] = useState<
        { message: string; type: string; data?: any[] } | undefined
    >();

    useEffect(() => {
        ;(async () => {
            try {
                setLocalMods(await fetchYuzuMods());
                setUpToDateMods(
                    await fetchGithubUpdatedMods(setDownloadProgress)
                );
            } catch (e: any) {
                console.error(e.message);
                setAlert({ message: e.message, type: "error" });
            }
            setDownloadProgress(100);
        })();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setAlert(undefined);
        }, 5000);
    }, [alert]);

    useEffect(() => {
        ;(async () => {
            try {
                if (upToDateMods?.data.name) {
                    setMods(filterMods(await listMods(upToDateMods.data.name), localMods));
                }
            } catch (e: any) {
                console.error(e);
                setAlert({ message: e.message, type: "error" });
            }
        })();
    }, [localMods, upToDateMods]);

    return (
        <ModContext.Provider
            value={{
                mods, localMods, upToDateMods, downloadProgress, alert, setAlert, setLocalMods, setMods
            }}>

            <main className="min-h-screen justify-between">
                <Header/>
                <DownloadBar/>
                <div
                    className={
                        "overflow-x-auto"
                    }
                >
                    <ModsTable/>
                </div>
                <Alert/>
            </main>
        </ModContext.Provider>
    )
}
