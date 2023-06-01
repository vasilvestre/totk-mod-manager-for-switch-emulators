import { AppContext, useAppContext } from '@/src/context/appContext'

export default function Alert() {
    const { alert } = useAppContext(AppContext)

    if (!alert) {
        return null
    }

    return (
        <div className="toast toast-top toast-end">
            <div className={'shadow-lg alert alert-' + alert.type}>
                <div>
                    {alert.type === 'error' && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current flex-shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                    {alert.type === 'success' && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current flex-shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    )}
                    <span>{alert.message}</span>
                    <span>
                        {' '}
                        {alert.data &&
                            alert.data.map((data: string, index: number) => (
                                <li key={index}>{data}</li>
                            ))}
                    </span>
                </div>
            </div>
        </div>
    )
}
