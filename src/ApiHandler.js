// @flow
const baseUrl = 'http://localhost:8000'

export const getTickers = (): Promise<Array<PolygonTicker>> => fetch('PolygonTickers.json').then(res => res.json())
export const getQuotesForIdentifier = (identifier: string) => {
  // sendRequest(`${baseUrl}/quotes?identifier=${identifier}`)
  return Promise.resolve([])
}

const sendRequest = (url: string, options: Object) =>
  fetch(`${baseUrl}/${url}`, options)
    .then(res => res.json())
