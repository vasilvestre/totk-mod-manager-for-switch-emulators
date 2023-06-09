import { ModContext, useModContext } from '@/src/context/modContext'
import { AppContext, useAppContext } from '@/src/context/appContext'
import { useEffect, useState } from 'react'
import { LocalMod, ModFile } from '@/src/types'
import { CategoryNames, Enum } from '@/src/enum'
import { tryInstall, tryRemove, tryUpdate } from '@/src/handler/modHandler'
import { ModModel } from '@/src/gamebanana/types'

export function GamebananaModRow(props: { mod: LocalMod; mods: LocalMod[] }) {
    const { setAlert } = useAppContext(AppContext)
    const { localMods, setLocalMods, emulatorState, searchTerms } = useModContext(ModContext)
    const [visibility, setVisibility] = useState<'visible' | 'hidden'>('visible')

    const mod = props.mod
    const mods = props.mods
    const metadata = mod.gamebanana
    const modMetadata = metadata?.mod
    const fileMetadata = metadata?.file

    useEffect(() => {
        if (
            searchTerms !== '' &&
            !modMetadata?._sName.toLowerCase().includes(searchTerms.toLowerCase()) &&
            !modMetadata?._aRootCategory._sName.toLowerCase().includes(searchTerms.toLowerCase())
        ) {
            setVisibility('hidden')
        } else {
            setVisibility('visible')
        }
    }, [modMetadata?._aRootCategory._sName, modMetadata?._sName, searchTerms])

    return (
        <tr key={modMetadata?._idRow} className={visibility + ' ' + 'hover'}>
            <td>{modMetadata?._sName}</td>
            <td></td>
            <td>{modMetadata?._aSubmitter?._sName}</td>
            <td>{modMetadata?._aRootCategory._sName}</td>
            <td></td>
            <td></td>
            <td>Gamebanana</td>
            <td className="whitespace-nowrap px-4 py-2">
                <div className="btn-group btn-group-vertical lg:btn-group-horizontal">
                    <>
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
                </div>
            </td>
        </tr>
    )
}
