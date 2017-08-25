import '../css/src/builder.css'
import map from '../docs/_static/example_data/S5_iJO1366.Glycolysis_PPP_AA_Nucleotides.json'
import { Builder, libs } from '../js/src/main'

new Builder( // eslint-disable-line no-new
  map,
  null,
  null,
  libs.d3_select('#root'),
  {
    fill_screen: true,
    never_ask_before_quit: true
  }
)
