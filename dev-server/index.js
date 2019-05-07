import map from '../docs/_static/example_data/S5_iJO1366.Glycolysis_PPP_AA_Nucleotides.json'
import model from '../docs/_static/example_data/iJO1366.json'
import { Builder, libs } from '../src/main'

window.builder = new Builder( // eslint-disable-line no-new
  map,
  model,
  null,
  libs.d3_select('#root'),
  {
    fill_screen: true,
    never_ask_before_quit: true
  }
)
