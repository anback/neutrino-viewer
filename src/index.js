// @flow
import TradingViewDataFeed from './TradingViewDataFeed.js'

// eslint-disable-next-line new-cap
window.tvWidget = new TradingView.widget({
  symbol: 'AAPL', // default symbol
  interval: '1D', // default interval
  fullscreen: true, // displays the chart in the fullscreen mode
  container_id: 'tv_chart_container',
  datafeed: TradingViewDataFeed,
  library_path: './charting_library/'
})
