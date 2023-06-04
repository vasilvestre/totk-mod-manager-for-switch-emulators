import { RequestParams } from '@/src/gamebanana/types'

const baseUrl = 'https://gamebanana.com/apiv11'

async function getArtist(username: string) {
    const res = await fetch(`https://api.example.com/artist/${username}`)
    return res.json()
}

async function getArtistAlbums(username: string) {
    const res = await fetch(`https://api.example.com/artist/${username}/albums`)
    return res.json()
}

export async function getMods(params: RequestParams) {
    params['_csvModelInclusions'] = 'Mod'
    params['_sSort'] = params['_sSort'] ? params['_sSort'] : 'default'
    const res = await fetch(baseUrl + '/Game/7617/Subfeed?' + buildURLSearchParams(params))
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.

    // Recommendation: handle errors
    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}

function buildURLSearchParams(params: RequestParams) {
    const query = new URLSearchParams()
    if (params._csvModelInclusions) {
        query.set('_csvModelInclusions', params._csvModelInclusions.toString())
    }
    if (params._nPage) {
        query.set('_nPage', params._nPage.toString())
    }
    if (params._sName) {
        query.set('_sName', params._sName)
    }
    return new URLSearchParams(query)
}
