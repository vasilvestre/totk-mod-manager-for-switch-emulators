import { ModContext, useModContext } from '@/app/yuzu/modContext'
import { ModRow } from '@/app/yuzu/modRow'
import { LocalModRow } from '@/app/yuzu/localModRow'

export function ModsTable() {
    const { mods, localMods, setSearchTerms } = useModContext(ModContext)

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
                <table className="divide-y-2 divide-gray-200 bg-grey text-sm w-full">
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                Local unsupported mods
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-center">
                        {localUnsportedMods.map((mod) => (
                            <LocalModRow key={mod.name} localMod={mod} />
                        ))}
                    </tbody>
                </table>
            )}
            {mods && (
                <>
                    <div className={'flex justify-center'}>
                        <div className="w-full md:w-1/2">
                            <form className="flex items-center">
                                <label
                                    htmlFor="simple-search"
                                    className="sr-only"
                                >
                                    Search
                                </label>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg
                                            aria-hidden="true"
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="simple-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                                        placeholder="Search"
                                        required={false}
                                        autoComplete={'off'}
                                        onChange={(event) =>
                                            setSearchTerms(event.target.value)
                                        }
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                    <table className="divide-y-2 divide-gray-200 bg-white text-sm w-full">
                        <thead className="ltr:text-left rtl:text-right">
                            <tr>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Title
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Mod version
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Author
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Category
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Game version
                                </th>
                                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                                    Incompatibility
                                </th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-center">
                            {mods.map((mod) => (
                                <ModRow
                                    key={mod.config.id}
                                    mod={mod}
                                    mods={mods}
                                />
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </>
    )
}
