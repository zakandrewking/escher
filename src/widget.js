/* global ESCHER_VERSION */

import { default as Builder } from './Builder'
import { select as d3Select } from 'd3-selection'
import _ from 'underscore'
// @jupyter-widgets/base is optional, so only initialize if it's called
let base
try {
  base = require('@jupyter-widgets/base')
} catch (e) {
}

const version = ESCHER_VERSION

/**
 * Jupyter widget implementation for the Escher Builder.
 */
export default function initializeJupyterWidget () {
  if (!base) {
    throw Error('@jupyter-widgets/base not installed. You must install it to ' +
                'use the jupyter widget')
  }

  class EscherMapView extends base.DOMWidgetView {
    render () {
      const sel = d3Select(this.el).append('div')

      // set height before loading map
      this.setHeight(sel)

      _.defer(() => {
        this.builder = new Builder(
          this.getMapData(),
          this.getModelData(),
          this.model.get('embedded_css'),
          sel,
          {
            // options
            reaction_data: this.model.get('reaction_data'),
            metabolite_data: this.model.get('metabolite_data'),
            gene_data: this.model.get('gene_data'),
            first_load_callback: builder => {
              // reset map json in widget
              builder.callback_manager.set('clear_map', () => {
                this.model.set('_loaded_map_json', null)
                this.model.save_changes()
              })

              // reset model json in widget
              builder.callback_manager.set('clear_model', () => {
                this.model.set('_loaded_model_json', null)
                this.model.save_changes()
              })

              // update functions
              this.model.on('change:height', () => {
                this.setHeight(sel)
              })
              this.model.on('change:_loaded_map_json', () => {
                builder.load_map(this.getMapData())
              })
              this.model.on('change:_loaded_model_json', () => {
                builder.load_model(this.getModelData())
              })
              // this.model.on('change:reaction_data', () => {
              //   builder.set_reaction_data(this.model.get('reaction_data'))
              // })
              // this.model.on('change:metabolite_data', () => {
              //   builder.set_metabolite_data(this.model.get('metabolite_data'))
              // })
              // this.model.on('change:gene_data', () => {
              //   builder.set_gene_data(this.model.get('gene_data'))
              // })

              // set the rest of the options
              Object.keys(builder.settings.streams).map(key => {
                const alreadySet = [] // 'reaction_data', 'metabolite_data', 'gene_data']
                if (alreadySet.includes(key)) {
                  return
                }
                if (this.model.keys().includes(key)) {
                  const val = this.model.get(key)
                  // ignore null because that means to use the default
                  if (val !== null) builder.settings.set(key, val)

                  // reactive updates
                  this.model.on(`change:${key}`, () => {
                    const val = this.model.get(key)
                    // ignore null because that means to use the default
                    if (val !== null) {
                      builder.settings.set(key, val)
                    }
                  })
                }
              })

              // get changes from options
              _.mapObject(builder.settings.streams, (stream, key) => {
                if (key in this.model.attributes) {
                  stream.onValue(value => {
                    this.model.set(key, value)
                    this.model.save_changes()
                    // default to drawing everything, unless it's a common
                    // option where that's not necessary
                    const noDraw = ['scroll_behavior']
                    if (!noDraw.includes(key)) {
                      builder.map.draw_everything()
                    }
                  })
                }
              })
            }
          }
        )
      })
    }

    setHeight (sel) {
      sel.style('height', `${this.model.get('height')}px`)
    }

    getMapData () {
      const json = this.model.get('_loaded_map_json')
      return json ? JSON.parse(json) : null
    }

    getModelData () {
      const json = this.model.get('_loaded_model_json')
      return json ? JSON.parse(json) : null
    }
  }

  class EscherMapModel extends base.DOMWidgetModel {
    defaults () {
      return _.extend(super.defaults(), {
        _model_name: 'EscherMapModel',
        _view_name: 'EscherMapView',
        _model_module: 'jupyter-escher',
        _view_module: 'jupyter-escher',
        _model_module_version: version,
        _view_module_version: version
      })
    }
  }

  return { EscherMapView, EscherMapModel }
}
