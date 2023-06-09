'use client'

import { getMods } from '@/src/gamebanaApi'
import { useEffect, useState } from 'react'
import { ApiResponse } from '@/src/gamebanana/types'
import { AppContext, useAppContext } from '@/src/context/appContext'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import { ModContext, useModContext } from '@/src/context/modContext'
import { GamebananaModInstallModal } from '@/app/emulators/store/[name]/modInstallModal'
import Image from 'next/image'
import { Header } from '@/app/emulators/store/[name]/header'

const range = (start: number, end: number) => {
    const length = end - start
    return Array.from({ length }, (_, i) => start + i)
}

export default function Page() {
    const [apiResponse, setApiResponse] = useState<ApiResponse>()
    const [pageLoaded, setPageLoaded] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const { setAlert } = useAppContext(AppContext)
    const { emulatorState } = useEmulatorChoiceContext(EmulatorChoiceContext)
    const { localMods, searchTerms, setLocalMods } = useModContext(ModContext)

    useEffect(() => {
        ;(async () => {
            try {
                setLoading(true)
                setApiResponse(await getMods({ _nPage: pageLoaded, _sName: searchTerms }))
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        })()
    }, [pageLoaded, searchTerms])

    if (!apiResponse) {
        return <></>
    }

    return (
        <>
            <Header title={'Browsing Gamebanana store'} setPageLoaded={setPageLoaded} />
            <div className={'flex items-center content-center justify-center'}>
                <div className="join">
                    {range(
                        1,
                        Math.ceil(
                            apiResponse._aMetadata._nRecordCount / apiResponse._aMetadata._nPerpage
                        ) + 1
                    ).map((num, i) => (
                        <button
                            key={'pagination-' + i}
                            className={
                                'join-item btn' +
                                (pageLoaded === num ? ' ' + 'btn-active' : '') +
                                (loading ? ' ' + 'btn-disabled' : '')
                            }
                            onClick={() => setPageLoaded(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
            <div className="overflow-x-auto">
                {loading && <></>}
                <div className={'flex flex-row flex-wrap'}>
                    {loading && (
                        <div className={'flex w-full justify-center items-center'}>
                            <span className="flex loading loading-ring loading-xs"></span>
                            <span className="loading loading-ring loading-sm"></span>
                            <span className="loading loading-ring loading-md"></span>
                            <span className="loading loading-ring loading-lg"></span>
                        </div>
                    )}
                    {!loading &&
                        apiResponse._aRecords.map((modRecord) => (
                            <div
                                key={modRecord._idRow}
                                className="card p-2 sm:basis-1/3 md:basis-1/5 w-96 bg-base-300 shadow-xl odd:bg-base-100"
                            >
                                <figure>
                                    <Image
                                        src={
                                            modRecord._aPreviewMedia._aImages[0]._sBaseUrl +
                                            '/' +
                                            modRecord._aPreviewMedia._aImages[0]._sFile
                                        }
                                        alt={modRecord._sName}
                                        width={'300'}
                                        height={'300'}
                                        quality={50}
                                    />
                                </figure>
                                <div className="sm:p-3 lg:p-8 card-body">
                                    <h2 className="text-md">{modRecord._sName}</h2>
                                    <p>
                                        {' '}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            className="inline-block w-8 h-8 stroke-current"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            ></path>
                                        </svg>{' '}
                                        {modRecord._nLikeCount ? modRecord._nLikeCount : 0} likes{' '}
                                    </p>
                                    <div className={'flex justify-evenly'}>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() =>
                                                // @ts-ignore
                                                window['my_modal_' + modRecord._idRow].showModal()
                                            }
                                        >
                                            Install
                                        </button>
                                        <GamebananaModInstallModal
                                            emulatorState={emulatorState}
                                            localMods={localMods}
                                            modRecord={modRecord}
                                            setAlert={setAlert}
                                            setLocalMods={setLocalMods}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    )
}
