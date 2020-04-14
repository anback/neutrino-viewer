// @flow
import { getQuotesForIdentifier, getTickers } from './ApiHandler.js'

type ResolutionString = '1D'
type CustomTimezones = 'Africa/Cairo' | 'Africa/Johannesburg' | 'Africa/Lagos' | 'America/Argentina/Buenos_Aires' | 'America/Bogota' | 'America/Caracas' | 'America/Chicago' | 'America/El_Salvador' | 'America/Juneau' | 'America/Lima' | 'America/Los_Angeles' | 'America/Mexico_City' | 'America/New_York' | 'America/Phoenix' | 'America/Santiago' | 'America/Sao_Paulo' | 'America/Toronto' | 'America/Vancouver' | 'Asia/Almaty' | 'Asia/Ashkhabad' | 'Asia/Bahrain' | 'Asia/Bangkok' | 'Asia/Chongqing' | 'Asia/Dubai' | 'Asia/Ho_Chi_Minh' | 'Asia/Hong_Kong' | 'Asia/Jakarta' | 'Asia/Jerusalem' | 'Asia/Kathmandu' | 'Asia/Kolkata' | 'Asia/Kuwait' | 'Asia/Muscat' | 'Asia/Qatar' | 'Asia/Riyadh' | 'Asia/Seoul' | 'Asia/Shanghai' | 'Asia/Singapore' | 'Asia/Taipei' | 'Asia/Tehran' | 'Asia/Tokyo' | 'Atlantic/Reykjavik' | 'Australia/ACT' | 'Australia/Adelaide' | 'Australia/Brisbane' | 'Australia/Perth' | 'Australia/Sydney' | 'Europe/Athens' | 'Europe/Belgrade' | 'Europe/Berlin' | 'Europe/Copenhagen' | 'Europe/Helsinki' | 'Europe/Istanbul' | 'Europe/London' | 'Europe/Luxembourg' | 'Europe/Madrid' | 'Europe/Moscow' | 'Europe/Oslo' | 'Europe/Paris' | 'Europe/Riga' | 'Europe/Rome' | 'Europe/Stockholm' | 'Europe/Tallinn' | 'Europe/Vilnius' | 'Europe/Warsaw' | 'Europe/Zurich' | 'Pacific/Auckland' | 'Pacific/Chatham' | 'Pacific/Fakaofo' | 'Pacific/Honolulu' | 'Pacific/Norfolk' | 'US/Mountain';
type SeriesFormat = 'price' | 'volume'
type Timezone = 'Etc/UTC' | CustomTimezones
type SearchSymbolResultItem = {symbol: string, full_name: string, description: string, exchange: string, type: string}
type SearchSymbolsCallback = (items: SearchSymbolResultItem[]) => void
type LibrarySymbolInfo = {name: string, full_name: string, ticker: string, description: string, type: string, session: string, exchange: string, listed_exchange: string, timezone: Timezone, format: SeriesFormat, pricescale: number, minmov: number, supported_resolutions: Array<ResolutionString>, currency_code: string}
type ResolveCallback = (symbolInfo: LibrarySymbolInfo) => void
type ErrorCallback = (reason: string) => void
type Bar = {time: number, open: number, high: number, low: number, close: number, volume?: number}
type HistoryMetadata = {noData: boolean, nextTime?: number | null}
type HistoryCallback = (bars: Bar[], meta: HistoryMetadata) => void
type SubscribeBarsCallback = (bar: Bar) => void;

const SUPPORTED_RESOLUTIONS = ['1D']
const TIME_ZONE = 'Etc/UTC'
const SESSION = '0930-1600'
const exchanges = ['AMX', 'ARCA', 'BATS', 'NYE', 'NSD', 'NGS'].map(exchange => ({ name: exchange, value: exchange, desc: exchange }))
const CONFIG = { supported_resolutions: SUPPORTED_RESOLUTIONS, exchanges, symbols_types: ['STOCKS'].map(value => ({ name: value, value })) }

export default {
  onReady: (callback: Function) => { console.log('TradingViewDataFeed onReady'); setTimeout(() => callback(CONFIG)) },
  searchSymbols: (userInput: string, exchange: string, symbolType: string, onResult: SearchSymbolsCallback): void => {
    console.log('TradingViewDataFeed', 'searchSymbols', 'userInput', userInput, 'exchange', exchange, 'symbolType', symbolType)
    getTickers()
      .then(tickers => {
        const res =
        tickers
          .reduce((a, polygonTicker: PolygonTicker) => {
            const { ticker: symbol, name: description, primaryExch: exchange, market: type } = polygonTicker
            if (symbol.includes(userInput)) a.push({ symbol, full_name: symbol, description, exchange, type })
            return a
          }, [])

        onResult(res)
      })
  },
  resolveSymbol: (symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void => {
    console.log('TradingViewDataFeed', 'resolveSymbol', 'symbolName', symbolName)

    getTickers()
      .then(tickers => {
        const polygonTicker = tickers.find(({ ticker }) => ticker === symbolName)
        if (!polygonTicker) throw new Error(`Cant find symbol info for ticker: ${symbolName}`)
        const { ticker, name: description, primaryExch: exchange, currency: currency_code, market: type } = polygonTicker

        onResolve({
          name: ticker,
          full_name: ticker,
          ticker,
          description,
          type,
          session: SESSION,
          exchange,
          listed_exchange: exchange,
          timezone: TIME_ZONE,
          format: 'price',
          pricescale: 100,
          minmov: 1,
          supported_resolutions: SUPPORTED_RESOLUTIONS,
          currency_code
        })
      })
      .catch(createErrorCallback(onError))
  },
  getBars: ({ ticker }: LibrarySymbolInfo, resolution: ResolutionString, rangeStartDate: number, rangeEndDate: number, onResult: HistoryCallback, onError: ErrorCallback, isFirstCall: boolean): void => {
    console.log('TradingViewDataFeed', 'getBars', 'resolution', resolution, 'rangeStartDate', moment(rangeStartDate).format(), 'rangeEndDate', moment(rangeEndDate).format(), 'isFirstCall', isFirstCall)
    getQuotesForIdentifier(ticker)
      .then(quotes => {
        const startDate = moment(rangeStartDate)
        const endDate = moment(rangeEndDate)
        const bars =
        quotes
          .reduce((a, { timestamp: time, last: close, ask: high, bid: low }) => {
            if (startDate.isSameOrBefore() && (isFirstCall || endDate.isSameOrAfter(time))) a.push({ time, open: close, high, low, close })
            return a
          }, [])

        const meta = { noData: quotes.length === 0 }
        onResult(bars, meta)
      })
      .catch(createErrorCallback(onError))
  },

  subscribeBars: (symbolInfo: LibrarySymbolInfo, resolution: ResolutionString, onTick: SubscribeBarsCallback, listenerGuid: string, onResetCacheNeededCallback: () => void): void => {},
  unsubscribeBars: (listenerGuid: string): void => {}
}

const createErrorCallback = (onError: Function) => (err: Error) => {
  const errMessage = err.message + err.stack
  console.error(errMessage)
  onError(errMessage)
}
