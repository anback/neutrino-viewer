// @flow
/* eslint-disable no-unused-vars */
declare var TradingView : any

type Quote = {
  bid: number,
  ask: number,
  last: number,
  timestamp: number,
  identifier: string,
  isIndex?: boolean
}

type PolygonTicker = {
  ticker: string,
  name: string,
  market: string,
  locale: string,
  currency: string,
  active: boolean,
  primaryExch: string,
  updated: string,
  url: string
}
