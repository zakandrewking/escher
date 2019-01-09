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
      const builder = Builder(null, null, null, sel, {
        enable_keys: false,
        first_load_callback: builder => {
          this.setHeight(sel)
          this.setLoadedMapJson(builder)
        }
      })
      this.model.on('change:height', () => this.setHeight(sel))
      this.model.on('change:_loaded_map_json', () => this.setLoadedMapJson(builder))
    }

    setHeight (sel) {
      sel.style('height', `${this.model.get('height')}px`)
    }

    setLoadedMapJson (builder) {
      const json = this.model.get('_loaded_map_json')
      console.log(json)
      builder.load_map(json ? JSON.parse(json) : null)
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
        _loaded_map_json: null
      })
    }
  }

  return { EscherMapView, EscherMapModel }
}
