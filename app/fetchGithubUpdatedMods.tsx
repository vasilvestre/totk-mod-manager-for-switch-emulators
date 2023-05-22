import {Octokit} from "octokit";
import {Endpoints} from "@octokit/types";
import {download} from "tauri-plugin-upload-api";
import {BaseDirectory} from "@tauri-apps/api/fs";
import {fs, invoke, path} from "@tauri-apps/api";
import {resolve} from "@tauri-apps/api/path";

const octokit = new Octokit({ auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN });

export type GithubRelease = Endpoints["GET /repos/{owner}/{repo}/releases/latest"]["response"]

export async function fetchGithubUpdatedMods(): Promise<GithubRelease> {
    return await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'HolographicWings',
        repo: 'TOTK-Mods-collection',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });
}

export async function modsSourceExists(filename: string): Promise<boolean> {
    return await fs.exists(filename, { dir: BaseDirectory.Download })
}
export async function fetchGithubUpdatedModsSource(url: string, filename: string, totalSize: number | null = null, setDownloadProgress) {
    let downloadDir = await path.downloadDir();
    let downloadProgress = {
        downloaded: 0,
        percent: 0
    }
    await download(
        url,
        await resolve(downloadDir, filename),
        (progress, total) => updateProgress(progress, totalSize ? totalSize : total, downloadProgress, setDownloadProgress),
        new Map([
            ['user-agent', 'cors-bypass']
        ])
    )
}

export async function extractZip(filename: string, version: string | null) {
    let downloadDir = await path.downloadDir();
    let filePath = await resolve(downloadDir, filename);
    let targetDir = await path.resolve(await path.appDataDir(), version ? version : 'latest');
    if (!await fs.exists(version ? version : 'latest', { dir: BaseDirectory.AppData })) {
        invoke('unzip', { filePath: filePath, targetDir: targetDir})
            .catch(console.error)
    }
}

function updateProgress(progress: number, total: number, downloadProgress: { downloaded: number, percent: number }, setDownloadProgress) {
    downloadProgress.downloaded = downloadProgress.downloaded + progress;
    downloadProgress.percent = downloadProgress.downloaded / total * 100;
    setDownloadProgress(downloadProgress.percent)
}