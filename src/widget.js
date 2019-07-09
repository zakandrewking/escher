/* global ESCHER_VERSION */

import { default as Builder } from './Builder'
import { select as d3Select } from 'd3-selection'
import _ from 'underscore'

// These will be conditionally defined below
export let EscherMapView = null
export let EscherMapModel = null

// @jupyter-widgets/base is optional, so only initialize if it's called
let base
try {
  base = require('@jupyter-widgets/base')
} catch (e) {
}
if (base) {
  const version = ESCHER_VERSION

  // These options can be set without explicitly redrawing the map. List is
  // probably not complete.
  const NO_DRAW_OPTIONS = [
    'menu',
    'scroll_behavior',
    'use_3d_transform',
    'enable_editing',
    'enable_keys',
    'full_screen_button',
    // these already redraw
    'reaction_data',
    'metabolite_data',
    'gene_data'
  ]

  const WITH_API_FUNCTIONS = {
    reaction_data: 'set_reaction_data',
    metabolite_data: 'set_metabolite_data',
    gene_data: 'set_gene_data'
  }

  /**
   * Jupyter widget implementation for the Escher Builder.
   */
  // eslint-disable-next-line no-unused-vars
  class EscherMapViewRef extends base.DOMWidgetView {
    render () {
      if (!base) {
        throw Error('@jupyter-widgets/base not installed. You must install it to ' +
                    'use the jupyter widget')
      }

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

              // sync changes from options (only after they have been accepted)
              _.mapObject(builder.settings.acceptedStreams, (stream, key) => {
                if (this.model.keys().includes(key)) {
                  const val = this.model.get(key)
                  if (val !== null) {
                    // if set, use the value from Python
                    if (key in WITH_API_FUNCTIONS) {
                      builder[WITH_API_FUNCTIONS[key]](val)
                    } else {
                      builder.settings.set(key, val)
                    }
                  } else {
                    // otherwise use the default from JavaScript
                    this.model.set(key, builder.settings.get(key))
                    this.model.save_changes()
                  }

                  // reactive updates
                  this.model.on(`change:${key}`, () => {
                    const val = this.model.get(key)
                    // stop if hasn't changed
                    if (!_.isEqual(val, builder.settings.get(key))) {
                      if (key in WITH_API_FUNCTIONS) {
                        builder[WITH_API_FUNCTIONS[key]](val)
                      } else {
                        builder.settings.set(key, val)
                      }

                      // default to drawing everything, unless it's a common
                      // option where that's not necessary
                      if (!NO_DRAW_OPTIONS.includes(key)) {
                        builder.map.draw_everything()
                      }
                    }
                  })
                }

                stream.onValue(val => {
                  // avoid a loop with a deep comparison
                  if (!_.isEqual(val, this.model.get(key))) {
                    this.model.set(key, val)
                    this.model.save_changes()
                  }
                })
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

  // eslint-disable-next-line no-unused-vars
  class EscherMapModelRef extends base.DOMWidgetModel {
    defaults () {
      return _.extend(super.defaults(), {
        _model_name: 'EscherMapModel',
        _view_name: 'EscherMapView',
        _model_module: 'escher',
        _view_module: 'escher',
        _model_module_version: version,
        _view_module_version: version
      })
    }
  }

  // Trick for conditional exports
  EscherMapView = EscherMapViewRef
  EscherMapModel = EscherMapModelRef
}
