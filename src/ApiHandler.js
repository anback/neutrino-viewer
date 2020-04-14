// @flow
import withMemoryCache from './withMemoryCache.js'
const baseUrl = 'http://localhost:3000'

export const getTickers = (): Promise<Array<PolygonTicker>> => sendRequest('/tickers')
export const getQuotesForIdentifier = (identifier: string): Promise<Array<Quote>> => sendRequest(`/quotes?identifier=${identifier}`)

const sendRequest = (url: string) => withMemoryCache(() => _sendRequest(url), url)()
const _sendRequest = (url: string) => fetch(`${baseUrl}${url}`).then(res => res.json())
