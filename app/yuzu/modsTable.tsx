import { ModContext, useModContext } from '@/app/yuzu/modContext'
import { ModRow } from '@/app/yuzu/modRow'
import { LocalModRow } from '@/app/yuzu/localModRow'

export function ModsTable() {
    const { mods, localMods } = useModContext(ModContext)

    const localUnsportedMods = localMods
        .filter((localMod) => {
            return typeof localMod.config === 'undefined'
        })
        .map((localMod) => {
            if (
                mods?.find((mod) => {
                    return localMod.name?.includes(mod?.config?.title)
                })
            ) {
                return { ...localMod, supported: true }
            }
            return localMod
        })

    return (
        <>
            {localUnsportedMods.length > 0 && (
                <>
                    <table className="table table-zebra table-compact w-full">
                        <thead>
                            <tr className={'text-center'}>
                                <th>Local unsupported mods</th>
                            </tr>
                        </thead>
                        <tbody className={'text-center'}>
                            {localUnsportedMods.map((mod) => (
                                <LocalModRow key={mod.name} localMod={mod} />
                            ))}
                        </tbody>
                    </table>
                    <div className="divider"></div>
                </>
            )}
            {mods && (
                <>
                    <table className="table table-zebra table-compact w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Mod version</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Game version</th>
                                <th>Incompatibility</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mods.map((mod) => (
                                <ModRow key={mod.config.id} mod={mod} mods={mods} />
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}
