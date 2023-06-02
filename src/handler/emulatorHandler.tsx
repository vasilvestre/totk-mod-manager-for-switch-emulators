import { SupportedEmulators } from '@/src/enum'
import { EmulatorState } from '@/src/types'

interface Emulator {
    name: string
    path?: string | undefined
}

export async function askEmulator(emulator: Emulator) {
    switch (emulator.name.toLowerCase()) {
        case 'yuzu':
            return await askFor(emulator, 'Select Yuzu Directory')
        case 'ryujinx':
            return await askFor(emulator, 'Select Ryujinx Directory')
        default:
            return undefined
    }
}

export async function checkEmulator(emulator: Emulator): Promise<EmulatorState> {
    switch (emulator.name.toLowerCase()) {
        case 'yuzu':
            return await check(emulator)
        case 'ryujinx':
            return await check(emulator)
        default:
            throw new Error('Unknown emulator')
    }
}

export async function emulatorDefaultModFolder(emulator: Emulator) {
    const { path } = await import('@tauri-apps/api')
    const emulatorDir = await check(emulator)

    switch (emulator.name.toLowerCase()) {
        case 'yuzu':
            return await path.resolve(emulatorDir.path, 'load', '0100F2C0115B6000')
        case 'ryujinx':
            return await path.resolve(
                emulatorDir.path,
                'mods',
                'contents',
                '0100F2C0115B6000'.toLowerCase()
            )
        default:
            throw new Error('Unknown emulator')
    }
}

async function emulatorDefaultFolder(emulator: Emulator) {
    const { path } = await import('@tauri-apps/api')
    switch (emulator.name.toLowerCase()) {
        case 'yuzu':
            return await path.resolve(await path.dataDir(), 'yuzu')
        case 'ryujinx':
            return await path.resolve(await path.configDir(), 'Ryujinx')
        default:
            throw new Error('Unknown emulator')
    }
}

async function check(emulator: Emulator) {
    const { fs } = await import('@tauri-apps/api')
    const configuration = await readConfiguration()
    let emulatorDir
    if (
        configuration &&
        configuration.find((e: Emulator) => e.name.toLowerCase() === emulator.name.toLowerCase())
    ) {
        const emulatorConfig = configuration.find(
            (e: Emulator) => e.name.toLowerCase() === emulator.name.toLowerCase()
        )
        emulatorDir = emulatorConfig?.path
    }
    if (!emulatorDir) {
        emulatorDir = await emulatorDefaultFolder(emulator)
        if (await fs.exists(emulatorDir)) {
            await writeConfiguration({ ...emulator, path: emulatorDir })
        }
    }
    const emulatorFound = await fs.exists(emulatorDir)
    return {
        name: emulator.name,
        found: emulatorFound,
        path: emulatorDir,
        version: undefined,
    }
}

async function askFor(emulator: Emulator, dialogTitle: string): Promise<EmulatorState> {
    const { open } = await import('@tauri-apps/api/dialog')

    try {
        const selectedPath = await open({
            directory: true,
            multiple: false,
            title: dialogTitle,
            recursive: true,
        })
        if (selectedPath && typeof selectedPath === 'string') {
            await writeConfiguration({ ...emulator, path: selectedPath })
            return {
                name: emulator.name,
                path: selectedPath,
                found: true,
                version: undefined,
            }
        }
        throw new Error('No path selected')
    } catch (e: unknown) {
        console.error(e)
        return {
            name: emulator.name,
            path: undefined,
            found: false,
            version: undefined,
        }
    }
}

async function readConfiguration(): Promise<Emulator[] | null | undefined> {
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
            const config: Emulator[] = []
            for (const emulator in SupportedEmulators) {
                config.push({
                    name: emulator.toLowerCase(),
                    path: undefined,
                })
            }
            await fs.writeFile(configPath, yaml.stringify(config))
        }

        const contents = await fs.readTextFile(configPath)
        return yaml.parse(contents)
    } catch (e: unknown) {
        console.error(e)
    }
}

async function writeConfiguration(content: Emulator) {
    const { fs, path } = await import('@tauri-apps/api')
    const yaml = await import('yaml')

    try {
        const configDir = await path.resolve(await path.configDir(), 'TTKMM')
        const exists = await fs.exists(configDir)

        if (!exists) {
            await fs.createDir(configDir)
        }

        const configPath = await path.resolve(configDir, 'config.yaml')
        const currentConfig = await readConfiguration()

        const contentToWrite: Emulator[] = []

        if (!currentConfig) {
            contentToWrite.push(content)
        } else {
            currentConfig.forEach((config: Emulator) => {
                if (config.name.toLowerCase() === content.name.toLowerCase()) {
                    config.path = content.path
                }
                contentToWrite.push(config)
            })
        }
        await fs.writeFile(configPath, yaml.stringify(contentToWrite))
    } catch (e: unknown) {
        console.error(e)
    }
}
