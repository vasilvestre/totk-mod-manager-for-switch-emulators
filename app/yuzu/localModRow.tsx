import { LocalMod } from '@/app/types'

export function LocalModRow(props: {
    localMod: LocalMod & { supported: boolean }
}) {
    const mod = props.localMod
    return (
        <tr key={mod.name} className={'bg-amber-50'}>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                {mod.name}{' '}
                <div className={'text-red-900'}>
                    {mod.supported &&
                        'This mod can be installed via the mod manager to get updates, find the install button in the list.'}
                </div>
            </td>
        </tr>
    )
}
