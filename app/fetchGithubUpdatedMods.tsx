import {Octokit} from "octokit";
import {Endpoints} from "@octokit/types";

export type GithubRelease = Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]

export async function fetchGithubUpdatedMods(): Promise<GithubRelease> {
    const octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN });
    return await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'HolographicWings',
        repo: 'TOTK-Mods-collection',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
}

export async function modsSourceExists(filename: string): Promise<boolean> {
    const {fs} = await import("@tauri-apps/api")
    return await fs.exists(filename, { dir: fs.BaseDirectory.Download })
}
export async function fetchGithubUpdatedModsSource(url: string, filename: string, totalSize: number | null = null, setDownloadProgress: Function) {
    const {download} = await import("tauri-plugin-upload-api")
    const {path} = await import("@tauri-apps/api")
    let downloadDir = await path.downloadDir();
    let downloadProgress = {
        downloaded: 0,
        percent: 0
    }
    await download(
        url,
        await path.resolve(downloadDir, filename),
        (progress, total) => updateProgress(progress, totalSize ? totalSize : total, downloadProgress, setDownloadProgress),
        new Map([
            ['user-agent', 'cors-bypass']
        ])
    )
}

export async function extractZip(filename: string, version: string | null) {
    const {path, fs, invoke} = await import("@tauri-apps/api")
    let downloadDir = await path.downloadDir();
    let filePath = await path.resolve(downloadDir, filename);
    let targetDir = await path.resolve(await path.appDataDir(), version ? version : 'latest');
    if (!await fs.exists(version ? version : 'latest', { dir: fs.BaseDirectory.AppData })) {
        invoke('unzip', { filePath: filePath, targetDir: targetDir})
            .catch(console.error)
    }
}

function updateProgress(progress: number, total: number, downloadProgress: { downloaded: number, percent: number }, setDownloadProgress: Function) {
    downloadProgress.downloaded = downloadProgress.downloaded + progress;
    downloadProgress.percent = downloadProgress.downloaded / total * 100;
    setDownloadProgress(downloadProgress.percent)
}