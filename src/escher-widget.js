/* global ESCHER_VERSION */

import Builder from './Builder.jsx'
import { select as d3Select } from 'd3-selection'

/**
 * anywidget ESM module for the Escher Builder.
 *
 * anywidget calls render({ model, el }) when the widget is displayed.
 * model.get/set/on mirrors the Python traitlet schema in plots.py.
 */
export function render ({ model, el }) {
  const container = d3Select(el).append('div')
  container.style('height', model.get('height') + 'px')

  const parseJson = s => (s && s !== 'null' ? JSON.parse(s) : null)

  const optionsJson = model.get('_options_json')
  const extraOptions = optionsJson ? JSON.parse(optionsJson) : {}

  const builder = new Builder(
    parseJson(model.get('map_json')),
    null,   // model_json never crosses the bridge
    null,   // embedded_css: Builder handles its own CSS via ?raw
    container,
    {
      ...extraOptions,
      reaction_data: parseJson(model.get('reaction_data')),
      metabolite_data: parseJson(model.get('metabolite_data')),
      gene_data: parseJson(model.get('gene_data')),
      first_load_callback: b => {
        // Wire metabolite selection: fires when a node is clicked
        b.map.callback_manager.set('select_selectable', (nodeCount, node) => {
          if (node && node.node_type === 'metabolite' && node.bigg_id) {
            model.set('selected_metabolite', node.bigg_id)
            model.save_changes()
          }
        })
        // Wire reaction hover: fires when tooltip is shown for a reaction
        // (no dedicated click event exists for reactions in the current map)
        b.map.callback_manager.set('show_tooltip.escher_widget', (type, d) => {
          if ((type === 'reaction_object' || type === 'reaction_label') && d && d.bigg_id) {
            model.set('selected_reaction', d.bigg_id)
            model.save_changes()
          }
        })
      }
    }
  )

  // Reactive updates pushed from Python
  model.on('change:height', () => {
    container.style('height', model.get('height') + 'px')
  })
  model.on('change:map_json', () => {
    builder.load_map(parseJson(model.get('map_json')))
  })
  model.on('change:reaction_data', () => {
    builder.set_reaction_data(parseJson(model.get('reaction_data')))
  })
  model.on('change:metabolite_data', () => {
    builder.set_metabolite_data(parseJson(model.get('metabolite_data')))
  })
  model.on('change:gene_data', () => {
    builder.set_gene_data(parseJson(model.get('gene_data')))
  })
}
