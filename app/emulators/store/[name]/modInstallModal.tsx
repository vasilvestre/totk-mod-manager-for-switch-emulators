import { useEffect, useState } from 'react'
import { tryGamebananaInstall } from '@/src/handler/modHandler'
import { ModModel, ModType } from '@/src/gamebanana/types'
import { AlertType, EmulatorState, LocalMod } from '@/src/types'
import { getMod } from '@/src/gamebanaApi'

export function GamebananaModInstallModal(props: {
    modRecord: ModModel
    localMods: LocalMod[]
    setLocalMods: (mods: LocalMod[]) => void
    setAlert: (alert: AlertType | undefined) => void
    emulatorState: EmulatorState | undefined
}) {
    const [modInformations, setModInformations] = useState<ModType>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        ;(async () => {
            setModInformations(await getMod(props.modRecord._idRow))
            setLoading(false)
        })()
    }, [props.modRecord._idRow])

    return (
        <dialog id={'my_modal_' + props.modRecord._idRow} className="modal">
            <form method="dialog" className="modal-box w-fit max-w-full">
                <h3 className="font-bold text-lg">Files</h3>
                {loading && (
                    <>
                        <span className="loading loading-ring loading-xs"></span>
                        <span className="loading loading-ring loading-sm"></span>
                        <span className="loading loading-ring loading-md"></span>
                        <span className="loading loading-ring loading-lg"></span>
                    </>
                )}
                <table className={'table'}>
                    <thead>
                        <tr>
                            <th>File name</th>
                            <th>Description</th>
                            <th>Number of download</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modInformations &&
                            modInformations._aFiles &&
                            modInformations._aFiles
                                .sort((a, b) => b._nDownloadCount - a._nDownloadCount)
                                .map((file) => (
                                    <tr key={file._idRow}>
                                        <td>{file._sFile}</td>
                                        <td>{file._sDescription}</td>
                                        <td>{file._nDownloadCount}</td>
                                        <td>
                                            <button
                                                className="btn"
                                                onClick={tryGamebananaInstall(
                                                    file,
                                                    props.modRecord,
                                                    props.localMods,
                                                    props.setLocalMods,
                                                    props.setAlert,
                                                    props.emulatorState
                                                )}
                                            >
                                                Install in{' '}
                                                <label className={'uppercase'}>
                                                    {props.emulatorState?.name}
                                                </label>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                    </tbody>
                </table>
            </form>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}
