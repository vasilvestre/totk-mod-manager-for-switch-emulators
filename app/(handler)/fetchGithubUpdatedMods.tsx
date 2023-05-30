import { Octokit } from 'octokit'
import { Endpoints } from '@octokit/types'

export type GithubRelease = Endpoints['GET /repos/{owner}/{repo}/releases/latest']['response']

export async function fetchGithubUpdatedMods(
    setDownloadProgress: (value: number) => void
): Promise<GithubRelease> {
    const { fs } = await import('@tauri-apps/api')
    const octokit = new Octokit({
        auth: process.env.NEXT_PUBLIC_GITHUB_AUTH_TOKEN,
    })
    const mods = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
        owner: 'HolographicWings',
        repo: 'TOTK-Mods-collection',
        headers: {
            'X-GitHub-Api-Version': '2022-11-28',
        },
    })

    const zipAsset = mods.data.assets.find((asset) => {
        return asset.name.endsWith('.zip')
    })

    if (!zipAsset) {
        throw new Error('No zip asset found')
    } else if (
        !(await fs.exists(zipAsset.name, {
            dir: fs.BaseDirectory.Download,
        }))
    ) {
        await fetchGithubUpdatedModsSource(
            zipAsset.browser_download_url,
            zipAsset.name,
            zipAsset.size,
            setDownloadProgress
        )
    }
    await extractZip(zipAsset.name, mods.data.name)
    return mods
}

export async function fetchGithubUpdatedModsSource(
    url: string,
    filename: string,
    totalSize: number | null = null,
    setDownloadProgress: (value: number) => void
) {
    const { download } = await import('tauri-plugin-upload-api')
    const { path } = await import('@tauri-apps/api')
    const downloadDir = await path.downloadDir()
    const downloadProgress = {
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
    const downloadDir = await path.downloadDir()
    const filePath = await path.resolve(downloadDir, filename)
    const targetDir = await path.resolve(await path.appDataDir(), version ? version : 'latest')
    if (!(await fs.exists(await path.appDataDir()))) {
        await fs.createDir(await path.appDataDir())
    }
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
    setDownloadProgress: (value: number) => void
) {
    downloadProgress.downloaded = downloadProgress.downloaded + progress
    downloadProgress.percent = (downloadProgress.downloaded / total) * 100
    setDownloadProgress(downloadProgress.percent)
}
