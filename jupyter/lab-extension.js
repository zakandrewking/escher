const escher = require('../dist/escher.min')
const base = require('@jupyter-widgets/base')

module.exports = {
  id: 'escher',
  requires: [base.IJupyterWidgetRegistry],
  activate: (app, widgets) => widgets.registerWidget({
    name: 'escher',
    version: escher.version,
    exports: escher
  }),
  autoStart: true
}
