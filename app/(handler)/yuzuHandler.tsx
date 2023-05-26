export async function askForYuzu() {
    const { open } = await import('@tauri-apps/api/dialog')

    try {
        const selectedPath = await open({
            directory: true,
            multiple: false,
            title: 'Select Yuzu Directory',
            recursive: true,
        })
        if (selectedPath && typeof selectedPath === 'string') {
            await writeConfiguration({ yuzuDir: selectedPath })
            return {
                path: selectedPath,
                found: true,
                version: undefined,
            }
        }
    } catch (e: any) {
        console.error(e)
        return {
            path: undefined,
            found: false,
            version: undefined,
        }
    }
}

async function readConfiguration() {
    const { fs, path } = await import('@tauri-apps/api')
    const yaml = await import('yaml')

    try {
        const configDir = await path.resolve(await path.configDir(), 'TTKMM')
        const exists = await fs.exists(configDir)
        if (!exists) {
            await fs.createDir(configDir)
        }
        const configPath = await path.resolve(configDir, 'config.yaml')
        if (!(await fs.exists(configPath))) {
            await fs.writeFile(
                configPath,
                yaml.stringify({
                    yuzuDir: undefined,
                })
            )
        }
        return yaml.parse(await fs.readTextFile(configPath))
    } catch (e: any) {
        console.error(e)
    }
}
async function writeConfiguration(content: { yuzuDir: string | undefined }) {
    const { fs, path } = await import('@tauri-apps/api')
    const yaml = await import('yaml')

    try {
        const configDir = await path.resolve(await path.configDir(), 'TTKMM')
        const exists = await fs.exists(configDir)
        if (!exists) {
            await fs.createDir(configDir)
        }
        const configPath = await path.resolve(configDir, 'config.yaml')
        await fs.writeFile(configPath, yaml.stringify(content))
    } catch (e: any) {
        console.error(e)
    }
}

export async function checkYuzu() {
    const { fs, path } = await import('@tauri-apps/api')
    const configuration = await readConfiguration()
    let yuzuDir
    if (configuration.yuzuDir) {
        yuzuDir = configuration.yuzuDir
    } else {
        yuzuDir = await path.resolve(await path.dataDir(), 'yuzu')
    }
    const yuzuFound = await fs.exists(yuzuDir)
    return {
        found: yuzuFound,
        path: yuzuDir,
        version: undefined,
    }
}
