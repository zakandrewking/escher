import map from '/Users/zaking/repos/escher.github.io/1-0-0/6/maps/Homo sapiens/RECON1.Amino acid metabolism (partial).json'
import model from '/Users/zaking/repos/escher.github.io/1-0-0/6/models/Homo sapiens/RECON1.json'
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
