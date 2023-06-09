'use client'

import { ModContext, useModContext } from '@/src/context/modContext'
import {
    EmulatorChoiceContext,
    useEmulatorChoiceContext,
} from '@/src/context/emulatorChoiceContext'
import React, { useCallback } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import debounce from 'lodash.debounce'
import { useRouter, usePathname } from 'next/navigation'

export function Header(props: { title?: string; setPageLoaded: (number: number) => void }) {
    const router = useRouter()
    const { downloadProgress, searchTerms, setSearchTerms } = useModContext(ModContext)
    const { emulatorState } = useEmulatorChoiceContext(EmulatorChoiceContext)

    const changeHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        const target = event.target as HTMLButtonElement
        if (target.value.length >= 3 || target.value.length === 0) {
            props.setPageLoaded(1)
            setSearchTerms(target.value)
        }
    }

    const debouncedChangeHandler = useCallback(debounce(changeHandler, 500), [])

    return (
        <>
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <Link className="btn btn-square btn-ghost" href="/">
                        <Icon icon={'mdi:home-outline'} height={32} width={32} />
                    </Link>
                    <button className="btn btn-square btn-ghost" onClick={() => router.back()}>
                        <Icon icon={'mdi:arrow-left'} height={32} width={32} />
                    </button>
                </div>
                <>
                    <div className="navbar-center">
                        <p className="normal-case text-xl">{props.title ? props.title : ''}</p>
                    </div>
                </>
                <div className="navbar-end">
                    <p className={'capitalize'}>{emulatorState?.name}</p>

                    <button
                        className={'btn btn-square btn-ghost'}
                        onClick={() => window.app_modal.showModal()}
                    >
                        <Icon icon={'carbon:debug'} height={32} width={32} />
                    </button>
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={(event) => toggleTheme(event)}
                    >
                        <label className="swap swap-rotate">
                            <input
                                type="checkbox"
                                data-toggle-theme="light,dark"
                                data-act-class="ACTIVECLASS"
                            />
                            <Icon
                                icon={'ph:sun'}
                                className={'swap-on fill-current'}
                                width={32}
                                height={32}
                            ></Icon>
                            <Icon
                                icon={'ph:moon'}
                                className={'swap-off fill-current'}
                                width={32}
                                height={32}
                            ></Icon>
                        </label>
                    </button>
                </div>
            </div>
            {downloadProgress && downloadProgress !== 100 && (
                <progress className="progress w-full"></progress>
            )}
            <header
                aria-label="Page Header"
                className={"min-h-[300px] bg-[url('https://wallpapercave.com/wp/wp11520757.jpg')]"}
            >
                <div className={'flex flex-row h-[300px] justify-evenly items-center'}>
                    <input
                        type="text"
                        placeholder="Search by name, description or category"
                        className="input input-bordered w-1/2"
                        minLength={3}
                        defaultValue={searchTerms}
                        // @ts-ignore
                        onChange={debouncedChangeHandler}
                    />
                </div>
            </header>
        </>
    )
}

function toggleTheme(evt: React.MouseEvent<HTMLButtonElement>) {
    const target = evt.target as HTMLButtonElement
    const themesList = target.getAttribute('data-toggle-theme')
    if (themesList) {
        const themesArray = themesList.split(',')
        if (document.documentElement.getAttribute('data-theme') == themesArray[0]) {
            if (themesArray.length == 1) {
                document.documentElement.removeAttribute('data-theme')
                localStorage.removeItem('theme')
            } else {
                document.documentElement.setAttribute('data-theme', themesArray[1])
                localStorage.setItem('theme', themesArray[1])
            }
        } else {
            document.documentElement.setAttribute('data-theme', themesArray[0])
            localStorage.setItem('theme', themesArray[0])
        }
    }
}
