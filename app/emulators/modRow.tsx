import { ModContext, useModContext } from '@/src/context/modContext'
import { AppContext, useAppContext } from '@/src/context/appContext'
import { useEffect, useState } from 'react'
import { ModFile } from '@/src/types'
import { CategoryNames, Enum } from '@/src/enum'
import { tryInstall, tryRemove, tryUpdate } from '@/src/handler/modHandler'

export function ModRow(props: { mod: ModFile; mods: ModFile[] }) {
    const { setAlert } = useAppContext(AppContext)
    const { localMods, setLocalMods, emulatorState, searchTerms } = useModContext(ModContext)
    const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible')

    const mod = props.mod
    const mods = props.mods
    const config = mod.config

    useEffect(() => {
        if (
            searchTerms !== '' &&
            !config.title.toLowerCase().includes(searchTerms.toLowerCase()) &&
            !config.subtitle?.toLowerCase().includes(searchTerms.toLowerCase()) &&
            !CategoryNames[Enum[config.category] as keyof typeof CategoryNames]
                .toLowerCase()
                .includes(searchTerms.toLowerCase()) &&
            !config.game.version.includes(searchTerms)
        ) {
            setVisibility('hidden')
        } else {
            setVisibility('visible')
        }
    }, [searchTerms, config.title, config.subtitle, config.category, config.game.version])

    return (
        <tr key={config.id} className={visibility + ' ' + 'hover'}>
            <td>
                {config.title}
                <br />
                {config?.subtitle !== config.title && (
                    <p className="mt-1.5 text-sm">{config.subtitle}</p>
                )}
            </td>
            <td>{config.version}</td>
            <td>{config.author?.name}</td>
            <td>{CategoryNames[Enum[config.category] as keyof typeof CategoryNames]}</td>
            <td>
                {config.game.version.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </td>
            <td>
                {mods
                    .filter((mod) => config.compatibility?.blacklist?.includes(mod.config.id))
                    .map((mod, index) => {
                        return <div key={index}>{mod.config.title}</div>
                    })}
            </td>
            <td className="whitespace-nowrap px-4 py-2">
                <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
                    {typeof localMods.find((localMod) => localMod?.config?.id === mod.config.id) ===
                    'undefined' ? (
                        <button
                            className="btn btn-outline btn-xs"
                            onClick={tryInstall(
                                mod,
                                localMods,
                                setLocalMods,
                                setAlert,
                                emulatorState
                            )}
                        >
                            Install
                        </button>
                    ) : (
                        <>
                            {localMods.find((localMod) => localMod.name === mod.name)?.config
                                ?.version !== mod.config.version && (
                                <button
                                    className="btn btn-outline btn-info btn-xs"
                                    onClick={tryUpdate(
                                        mod,
                                        localMods,
                                        setLocalMods,
                                        setAlert,
                                        emulatorState
                                    )}
                                >
                                    Update
                                </button>
                            )}
                            <button
                                className="btn btn-outline btn-error btn-xs"
                                onClick={tryRemove(
                                    localMods.find((localMod) => localMod.name === mod.name),
                                    setLocalMods,
                                    setAlert,
                                    emulatorState
                                )}
                            >
                                Remove
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    )
}
