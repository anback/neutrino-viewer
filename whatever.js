
// @flow
const fs = require('fs')
const PolygonTickers = JSON.parse(fs.readFileSync('./src/PolygonTickers.json', { encoding: 'utf8' }))
const exchanges = PolygonTickers.reduce((a, { primaryExch }) => { a[primaryExch] = a[primaryExch] ? a[primaryExch] + 1 : 1; return a }, {})
console.log(exchanges)
