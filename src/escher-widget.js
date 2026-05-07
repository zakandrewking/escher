/* global ESCHER_VERSION */

import Builder from './Builder.jsx'
import { select as d3Select } from 'd3-selection'
import embeddedCss from './Builder-embed.css?raw'

/**
 * anywidget ESM module for the Escher Builder.
 *
 * anywidget calls render({ model, el }) when the widget is displayed.
 * model.get/set/on mirrors the Python traitlet schema in plots.py.
 */
export function render ({ model, el }) {
  // Set height as an inline style on the host element directly so that
  // ZoomContainer.getSize() (which uses getBoundingClientRect) has a non-zero
  // height before the Builder initializes — regardless of whether external CSS loads.
  const height = model.get('height')
  el.style.height = height + 'px'
  el.style.display = 'block'
  const container = d3Select(el).append('div')
  container.style('height', height + 'px')
  container.style('width', '100%')

  const parseJson = s => (s && s !== 'null' ? JSON.parse(s) : null)

  const optionsJson = model.get('_options_json')
  const extraOptions = optionsJson ? JSON.parse(optionsJson) : {}

  const builder = new Builder(
    parseJson(model.get('map_json')),
    parseJson(model.get('model_json')),
    embeddedCss,  // scopes CSS inside the widget container for notebook environments
    container,
    {
      ...extraOptions,
      reaction_data: parseJson(model.get('reaction_data')),
      metabolite_data: parseJson(model.get('metabolite_data')),
      gene_data: parseJson(model.get('gene_data')),
      first_load_callback: b => {
        // Re-fit the map after the browser has laid out the container, since
        // getBoundingClientRect() returns 0 during synchronous initialization
        // in anywidget (layout hasn't been calculated yet when render() runs).
        requestAnimationFrame(() => {
          if (b.map) b.map.zoom_extent_canvas()
        })

        // Scope keyboard shortcuts to the map: only active while the mouse
        // is over the Escher container, so typing in other notebook cells
        // is unaffected. Start disabled; enable on mouseenter.
        b.map.key_manager.toggle(false)
        const containerNode = container.node()
        containerNode.addEventListener('mouseenter', () => b.map.key_manager.toggle(true))
        containerNode.addEventListener('mouseleave', () => b.map.key_manager.toggle(false))

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
    const newHeight = model.get('height')
    el.style.height = newHeight + 'px'
    container.style('height', newHeight + 'px')
    requestAnimationFrame(() => {
      if (builder.map) builder.map.zoom_extent_canvas()
    })
  })
  model.on('change:model_json', () => {
    builder.load_model(parseJson(model.get('model_json')))
  })
  model.on('change:map_json', () => {
    builder.load_map(parseJson(model.get('map_json')))
    requestAnimationFrame(() => {
      if (builder.map) builder.map.zoom_extent_canvas()
    })
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
