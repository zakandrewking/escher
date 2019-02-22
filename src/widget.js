/* global ESCHER_VERSION */

import { default as Builder } from './Builder'
import { select as d3Select } from 'd3-selection'
import _ from 'underscore'

const version = ESCHER_VERSION

/**
 * @jupyter-widgets/base is optional, so only initialize if it's called
 */
export default function initializeJupyterWidget () {
  const base = require('@jupyter-widgets/base')

  class EscherMapView extends base.DOMWidgetView {
    render () {
      const sel = d3Select(this.el).append('div')

      // set height before loading map
      this.setHeight(sel)

      _.defer(() => {
        const builder = Builder(
          this.getMapData(),
          this.getModelData(),
          this.model.get('embedded_css'),
          sel,
          {
            // options
            enable_keys: false,
            reaction_data: this.model.get('reaction_data'),
            metabolite_data: this.model.get('metabolite_data'),
            gene_data: this.model.get('gene_data'),
            scroll_behavior: this.model.get('scroll_behavior'),
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

              // get changes from options
              _.mapObject(builder.settings.streams, (stream, key) => {
                if (key in this.model.attributes) {
                  stream.onValue(value => {
                    this.model.set(key, value)
                    this.model.save_changes()
                  })
                }
              })
            }
          }
        )

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
        this.model.on('change:reaction_data', () => {
          builder.set_reaction_data(this.model.get('reaction_data'))
        })
        this.model.on('change:metabolite_data', () => {
          builder.set_metabolite_data(this.model.get('metabolite_data'))
        })
        this.model.on('change:gene_data', () => {
          builder.set_gene_data(this.model.get('gene_data'))
        })
        this.model.on('change:scroll_behavior', () => {
          builder.settings.set('scroll_behavior', this.model.get('scroll_behavior'))
          // TODO make this automatic. see:
          // https://github.com/zakandrewking/escher/blob/45b59cb6c959dde5cece709a6a937944d8a8a1eb/src/Builder.jsx#L286
          const newBehavior = builder.settings.get('scroll_behavior')
          builder.zoom_container.set_scroll_behavior(newBehavior)
        })

        // // for the rest of the options
        // Object.keys(builder.options).map(key => {
        //   if (this.model.keys.indexOf(key) > -1) {

        //   }
        // })
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
        _view_module_version: version,
        height: 500,
        _loaded_map_json: null,
        _loaded_model_json: null,
        embedded_css: null,
        reaction_data: null,
        metabolite_data: null,
        gene_data: null,
        scroll_behavior: 'pan'
      })
    }
  }

  return { EscherMapView, EscherMapModel }
}
