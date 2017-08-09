console.log('loading map')
require('../../css/src/builder.css')
const map = require('../../docs/_static/example_data/S5_iJO1366.Glycolysis_PPP_AA_Nucleotides.json')
const escher = require('./main')
const d3Select = escher.libs.d3_select
const sel = d3Select('#root')
escher.Builder(map, null, null, sel, {
  menu: 'zoom',
  fill_screen: true,
  never_ask_before_quit: true
})
