import { ModContext, useModContext } from '@/src/context/modContext'
import { LocalModRow } from '@/app/emulators/[name]/localModRow'
import { ModRow } from '@/app/emulators/[name]/modRow'
import { GamebananaModRow } from '@/app/emulators/[name]/gamebananaModRow'

export function ModsTable() {
    const { mods, localMods } = useModContext(ModContext)

    const localUnsportedMods = localMods
        .filter((localMod) => {
            return (
                typeof localMod.config === 'undefined' && typeof localMod.gamebanana === 'undefined'
            )
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
    const gameBananaMods = localMods.filter((localMod) => {
        return typeof localMod.gamebanana !== 'undefined'
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
                                <th>Source</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {gameBananaMods.length > 0 &&
                                gameBananaMods.map((mod) => (
                                    <GamebananaModRow
                                        key={mod.gamebanana?.mod._idRow}
                                        mod={mod}
                                        mods={mods}
                                    />
                                ))}
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
