/* global ESCHER_VERSION */

import { default as Builder } from './Builder'
import { select as d3Select } from 'd3-selection'

import { DOMWidgetView, DOMWidgetModel } from '@jupyter-widgets/base'

const version = ESCHER_VERSION

/**
 * @jupyter-widgets/base is optional, so only initialize if it's called
 */
export default function initializeJupyterWidget () {
  class EscherMapModel extends DOMWidgetModel {
    constructor () {
      super()
      this._model_name = 'EscherMapModel'
      this._view_name = 'EscherMapView'
      this._model_module = 'escher'
      this._view_module = 'escher'
      this._model_module_version = version
      this._view_module_version = version
      this.value = 'Hello World'
    }
  }

  class EscherMapView extends DOMWidgetView {
    render () {
      Builder(null, null, null, d3Select(this.el), {})
    }
  }

  return { EscherMapView, EscherMapModel }
}
