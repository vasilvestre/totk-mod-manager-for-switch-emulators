import { ModContext, useModContext } from '@/app/modContext'

export function DownloadBar() {
    const { downloadProgress } = useModContext(ModContext)

    return (
        <div className="bg-gray-200 h-2.5 dark:bg-gray-700">
            <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: downloadProgress + '%' }}
            ></div>
        </div>
    )
}
