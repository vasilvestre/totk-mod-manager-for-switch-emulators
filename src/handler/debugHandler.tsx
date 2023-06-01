export async function clearInnerCache() {
    const { path, fs, process } = await import('@tauri-apps/api')
    if (!(await fs.exists(await path.appDataDir()))) {
        await fs.removeDir(await path.appDataDir())
    }
    try {
        await process.relaunch()
    } catch (e) {
        console.error(e)
        await process.exit(0)
    }
}
