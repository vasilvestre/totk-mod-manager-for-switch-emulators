import { LocalMod } from '@/app/types'

export function LocalModRow(props: { mod: LocalMod }) {
    const mod = props.mod
    const config = mod.config
    return (
        <tr key={config?.id} className={'bg-amber-50'}>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {mod.name}
            </td>
        </tr>
    )
}
