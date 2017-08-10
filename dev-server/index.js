import '../css/src/builder.css'
import map from '../docs/_static/example_data/S5_iJO1366.Glycolysis_PPP_AA_Nucleotides.json'
import escher from '../js/src/main'

escher.Builder(map, null, null, escher.libs.d3_select('#root'), {
  fill_screen: true,
  never_ask_before_quit: true
})
