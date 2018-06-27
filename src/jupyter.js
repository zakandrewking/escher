import { DOMWidgetView, DOMWidgetModel } from '@jupyter-widgets/base'

/**
 * @jupyter-widgets/base is optional, so only initialize if it's called
 */
export default function initializeJupyterWidget () {
  class EscherMapView extends DOMWidgetView {}
  class EscherMapModel extends DOMWidgetModel {}
  return {
    EscherMapView,
    EscherMapModel
  }
}
