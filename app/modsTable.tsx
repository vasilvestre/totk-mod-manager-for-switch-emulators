import { ModContext, useModContext } from '@/app/modContext'
import { ModRow } from '@/app/modRow'
import { LocalModRow } from '@/app/localModRow'

export function ModsTable() {
    const { mods, localMods, setLocalMods, setAlert } =
        useModContext(ModContext)

    const localUnsportedMods = localMods.filter((localMod) => {
        return typeof localMod.config === 'undefined'
    })

    return (
        <>
            {localUnsportedMods.length > 0 && (
                <table className="divide-y-2 divide-gray-200 bg-grey text-sm w-full">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Local unsupported mods
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-center">
                        {localUnsportedMods.map((mod) => (
                            <LocalModRow key={mod.config?.id} mod={mod} />
                        ))}
                    </tbody>
                </table>
            )}
            {mods && (
                <table className="divide-y-2 divide-gray-200 bg-white text-sm w-full">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Title
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Mod version
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Author
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Category
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Game version
                            </th>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Incompatibility
                            </th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-center">
                        {mods.map((mod) => (
                            <ModRow key={mod.config.id} mod={mod} mods={mods} />
                        ))}
                    </tbody>
                </table>
            )}
        </>
    )
}
