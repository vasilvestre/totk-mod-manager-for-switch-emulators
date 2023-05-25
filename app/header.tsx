import {ModContext, useModContext} from "@/app/modContext";

export function Header() {
    const { upToDateMods } = useModContext(ModContext);
    return <header
        aria-label="Page Header"
        className={
            "min-h-[300px] bg-[url('https://wallpapercave.com/wp/wp11520757.jpg')]"
        }
    >
        <div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <div className="text-center sm:text-left">
                    {upToDateMods && (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                Last version is {upToDateMods.data.name}
                            </h1>
                            <p className="mt-1.5 text-sm text-white">
                                Last release was made
                                at {new Date(Date.parse(upToDateMods.data.created_at)).toLocaleDateString()} !
                            </p>
                        </>
                    )}
                </div>

                <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
                    <button
                        className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                        type="button"
                    >
                        Auto update not available
                    </button>
                </div>
            </div>
        </div>
    </header>;
}