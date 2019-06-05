const escher = require('../dist/escher.min')
const base = require('@jupyter-widgets/base')

module.exports = {
  id: 'jupyter.extensions.escher',
  requires: [base.IJupyterWidgetRegistry],
  activate: (app, widgets) => widgets.registerWidget({
    name: 'escher',
    version: escher.version,
    exports: escher.initializeJupyterWidget()
  }),
  autoStart: true
}
