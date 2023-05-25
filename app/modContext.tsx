import {Context, createContext, useContext} from "react";
import {LocalMod, ModFile} from "@/app/types";
import {GithubRelease} from "@/app/(handler)/fetchGithubUpdatedMods";

interface ModContextType {
    mods: ModFile[] | undefined;
    localMods: LocalMod[];
    upToDateMods: GithubRelease | null;
    downloadProgress: number;
    alert: { message: string; type: string; data?: any[] } | undefined;
    setAlert: Function;
    setLocalMods: Function;
    setMods: Function;
}
export const ModContext = createContext<ModContextType | null>(null);

export const useModContext = (context: Context<ModContextType | null>) => {
    const modContext = useContext(context);

    if (!modContext) {
        throw new Error('useAlert must be used within a ModContext')
    }

    return modContext;
}