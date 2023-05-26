import { CategoryNames, Enum } from '@/app/enum'
import { tryInstall, tryRemove, tryUpdate } from '@/app/(handler)/modHandler'
import { ModContext, useModContext } from '@/app/yuzu/modContext'
import { LocalMod, ModFile } from '@/app/types'

export function LocalModRow(props: { mod: LocalMod }) {
    const { localMods, setLocalMods, setAlert, yuzuState } =
        useModContext(ModContext)

    let mod = props.mod
    let config = mod.config
    return (
        <tr key={config?.id} className={'bg-amber-50'}>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {mod.name}
            </td>
        </tr>
    )
}
