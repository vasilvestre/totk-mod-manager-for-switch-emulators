type Metadata = {
    _nRecordCount: number
    _nPerpage: number
    _bIsComplete: boolean
}

type Submitter = {
    _sName: string
    _sProfileUrl: string
}

type RootCategory = { _sName: string }
type ImageRecord = {
    _sBaseUrl: string
    _sFile: string
}
type Medias = { _aImages: ImageRecord[] }
type ModRecord = {
    _idRow: number
    _sModelName: string
    _sName: string
    _aTags: string[]
    _aSubmitter: Submitter
    _aRootCategory: RootCategory
    _sVersion: string
    _bHasFiles: boolean
    _aPreviewMedia: Medias
    _nLikeCount: number
}

export type RequestParams = {
    _nPage?: number
    _sName?: string
    _csvModelInclusions?: string
    _sSort?: string
}

export type ApiResponse = { _aMetadata: Metadata; _aRecords: ModRecord[] }
