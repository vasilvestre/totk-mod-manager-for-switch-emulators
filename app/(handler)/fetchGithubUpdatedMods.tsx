import { Octokit } from 'octokit'
import { Endpoints } from '@octokit/types'

export type GithubRelease =
    Endpoints['GET /repos/{owner}/{repo}/releases/latest']['response']

export async function fetchGithubUpdatedMods(
    setDownloadProgress: Function
): Promise<GithubRelease> {
    const { fs } = await import('@tauri-apps/api')
    const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN,
    })
    let mods: GithubRelease
    try {
        mods = await octokit.request(
            'GET /repos/{owner}/{repo}/releases/latest',
            {
                owner: 'vasilvestre',
                repo: 'TOTK-Mods-collection',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            }
        )
    } catch (e) {
        mods = await octokit.request(
            'GET /repos/{owner}/{repo}/releases/latest',
            {
                owner: 'HolographicWings',
                repo: 'TOTK-Mods-collection',
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            }
        )
    }

    if (
        !(await fs.exists(mods.data.assets[0].name, {
            dir: fs.BaseDirectory.Download,
        }))
    ) {
        await fetchGithubUpdatedModsSource(
            mods.data.assets[0].browser_download_url,
            mods.data.assets[0].name,
            mods.data.assets[0].size,
            setDownloadProgress
        )
    }
    await extractZip(mods.data.assets[0].name, mods.data.name)
    return mods
}

export async function fetchGithubUpdatedModsSource(
    url: string,
    filename: string,
    totalSize: number | null = null,
    setDownloadProgress: Function
) {
    const { download } = await import('tauri-plugin-upload-api')
    const { path } = await import('@tauri-apps/api')
    let downloadDir = await path.downloadDir()
    let downloadProgress = {
        downloaded: 0,
        percent: 0,
    }
    await download(
        url,
        await path.resolve(downloadDir, filename),
        (progress, total) =>
            updateProgress(
                progress,
                totalSize ? totalSize : total,
                downloadProgress,
                setDownloadProgress
            ),
        new Map([['user-agent', 'cors-bypass']])
    )
}

export async function extractZip(filename: string, version: string | null) {
    const { path, fs, invoke } = await import('@tauri-apps/api')
    let downloadDir = await path.downloadDir()
    let filePath = await path.resolve(downloadDir, filename)
    let targetDir = await path.resolve(
        await path.appDataDir(),
        version ? version : 'latest'
    )
    if (
        !(await fs.exists(version ? version : 'latest', {
            dir: fs.BaseDirectory.AppData,
        }))
    ) {
        try {
            await invoke('unzip', { filePath: filePath, targetDir: targetDir })
        } catch (e) {
            console.error(e)
        }
    }
}

function updateProgress(
    progress: number,
    total: number,
    downloadProgress: { downloaded: number; percent: number },
    setDownloadProgress: Function
) {
    downloadProgress.downloaded = downloadProgress.downloaded + progress
    downloadProgress.percent = (downloadProgress.downloaded / total) * 100
    setDownloadProgress(downloadProgress.percent)
}
