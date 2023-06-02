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
export async function clearConfigFile() {
    const { path, fs, process } = await import('@tauri-apps/api')

    try {
        const configDir = await path.resolve(await path.configDir(), 'TTKMM')
        const exists = await fs.exists(configDir)

        if (exists) {
            await fs.removeDir(configDir, { recursive: true })
        }
        await process.relaunch()
    } catch (e) {
        console.error(e)
        await process.exit(0)
    }
}
