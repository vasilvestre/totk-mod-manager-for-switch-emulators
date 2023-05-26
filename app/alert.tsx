import { AppContext, useAppContext } from '@/app/appContext'

export default function Alert() {
    const { alert } = useAppContext(AppContext)

    if (!alert) {
        return null
    }
    return (
        <div
            className="fixed bottom-5 flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
            role="alert"
        >
            <svg
                aria-hidden="true"
                className="flex-shrink-0 inline w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                ></path>
            </svg>
            <span className="sr-only">Info</span>
            <div>
                <span className="font-medium">{alert.message}</span>
                <ul className="mt-1.5 ml-4 list-disc list-inside">
                    {alert.data &&
                        alert.data.map((data: string, index: number) => (
                            <li key={index}>{data}</li>
                        ))}
                </ul>
            </div>
        </div>
    )
}
