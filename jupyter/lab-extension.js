const escher = require('../dist/escher.min')
const base = require('@jupyter-widgets/base')

module.exports = {
  id: 'jupyter.extensions.jupyter-escher',
  requires: [base.IJupyterWidgetRegistry],
  activate: (app, widgets) => widgets.registerWidget({
    name: 'jupyter-escher',
    version: escher.version,
    exports: escher.initializeJupyterWidget()
  }),
  autoStart: true
}
