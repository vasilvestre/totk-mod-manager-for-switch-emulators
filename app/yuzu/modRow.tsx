import { CategoryNames, Enum } from '@/app/enum'
import { tryInstall, tryRemove, tryUpdate } from '@/app/(handler)/modHandler'
import { ModContext, useModContext } from '@/app/yuzu/modContext'
import { ModFile } from '@/app/types'
import { AppContext, useAppContext } from '@/app/appContext'

export function ModRow(props: { mod: ModFile; mods: ModFile[] }) {
    const { setAlert } = useAppContext(AppContext)
    const { localMods, setLocalMods, yuzuState } = useModContext(ModContext)

    const mod = props.mod
    const mods = props.mods
    const config = mod.config
    return (
        <tr key={config.id} className={'odd:bg-blue-100'}>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {config.title}
                <br />
                {config?.subtitle !== config.title && (
                    <p className="mt-1.5 text-sm text-gray-700">
                        {config.subtitle}
                    </p>
                )}
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {config.version}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {config.author?.name}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {
                    CategoryNames[
                        Enum[config.category] as keyof typeof CategoryNames
                    ]
                }
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {config.game.version.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                {mods
                    .filter((mod) =>
                        config.compatibility?.blacklist?.includes(mod.config.id)
                    )
                    .map((mod, index) => {
                        return <div key={index}>{mod.config.title}</div>
                    })}
            </td>
            <td className="whitespace-nowrap px-4 py-2">
                <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
                    {typeof localMods.find(
                        (localMod) => localMod?.config?.id === mod.config.id
                    ) === 'undefined' ? (
                        <button
                            className="inline-block px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            onClick={tryInstall(
                                mod,
                                localMods,
                                setLocalMods,
                                setAlert,
                                yuzuState?.path
                            )}
                        >
                            Install
                        </button>
                    ) : (
                        <>
                            {localMods.find(
                                (localMod) => localMod.name === mod.name
                            )?.config?.version !== mod.config.version && (
                                <button
                                    className="inline-block px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:relative"
                                    onClick={tryUpdate(
                                        mod,
                                        localMods,
                                        setLocalMods,
                                        setAlert,
                                        yuzuState?.path
                                    )}
                                >
                                    Update
                                </button>
                            )}
                            <button
                                className="inline-block px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 focus:relative"
                                onClick={tryRemove(
                                    localMods.find(
                                        (localMod) => localMod.name === mod.name
                                    ),
                                    setLocalMods,
                                    setAlert,
                                    yuzuState?.path
                                )}
                            >
                                Remove
                            </button>
                        </>
                    )}
                </span>
            </td>
        </tr>
    )
}
