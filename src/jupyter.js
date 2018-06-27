/* global ESCHER_VERSION */

import { default as Builder } from './Builder'
import { select as d3Select } from 'd3-selection'

const version = ESCHER_VERSION

/**
 * @jupyter-widgets/base is optional, so only initialize if it's called
 */
export default function initializeJupyterWidget () {
  const base = require('@jupyter-widgets/base')

  class EscherMapModel extends base.DOMWidgetModel {
    constructor () {
      super()
      this._model_name = 'EscherMapModel'
      this._view_name = 'EscherMapView'
      this._model_module = 'escher'
      this._view_module = 'escher'
      this._model_module_version = version
      this._view_module_version = version
      this.value = 'Hello World'
      this.height = 600
    }
  }

  class EscherMapView extends base.DOMWidgetView {
    render () {
      console.log(this.model)
      this.el.style.height = `${this.model.get('height')}px`
      Builder(null, null, null, d3Select(this.el), {})
    }
  }

  return { EscherMapView, EscherMapModel }
}
