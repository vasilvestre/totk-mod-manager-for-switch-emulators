import { LocalMod } from '@/src/types'

export function LocalModRow(props: { localMod: LocalMod & { supported?: boolean | undefined } }) {
    const mod = props.localMod
    return (
        <tr key={mod.name}>
            <td>
                {mod.name} <br />
                <span className="badge badge-ghost badge-sm">
                    {' '}
                    {mod.supported &&
                        'This mod can be installed via the mod manager to get updates, find the install button in the list.'}
                </span>
            </td>
        </tr>
    )
}
