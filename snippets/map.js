/* global rootDiv, d3 */

var escher = require('escher')
var url = 'https://escher.github.io/1-0-0/5/maps/Escherichia coli/e_coli_core.Core metabolism.json'

d3.json(url, function (error, map_data) {
  escher.Builder(map_data, null, null, d3.select(rootDiv), {
    fill_screen: true,
    menu: 'zoom',
    never_ask_before_quit: true
  })
})
