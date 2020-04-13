// @flow
import TradingViewDataFeed from "./TradingViewDataFeed.js"


window.tvWidget = new TradingView.widget({
  symbol: 'Bitfinex:BTC/USD', // default symbol
  interval: '1D', // default interval
  fullscreen: true, // displays the chart in the fullscreen mode
  container_id: 'tv_chart_container',
  datafeed: TradingViewDataFeed,
  library_path: '../../node_modules/charting_library/charting_library/'
})
