var createComponent = require('tinier').createComponent
var createInterface = require('tinier').createInterface
var interfaceTypes = require('tinier').interfaceTypes
var h = require('tinier-dom').h
var render = require('tinier-dom').render

var DefaultTooltip = createComponent({
  displayName: 'DefaultTooltip',

  // reaplce with interface:
  init: function (arg) { return arg },
  signalNames: [ 'changeIsPrimary', 'didHide', ],

  render: function (args) {
    var isPrimary = args.state.isPrimary
    return render(
      args.el,
      h('div',
        null,
        args.state.bigg_id,
        h('button',
          { onClick: function () { args.signals.changeIsPrimary() } }))
    )
  },
})

// var TooltipInterface = createInterface({
//   state: {
//     bigg_id: interfaceTypes.string,
//     name: interfaceTypes.string,
//     loc: {
//       x: interfaceTypes.number,
//       y: interfaceTypes.number,
//     },
//     visibleArea: {
//       left: interfaceTypes.number,
//       right: interfaceTypes.number,
//       top: interfaceTypes.number,
//       bottom: interfaceTypes.number,
//     },
//     //
//     shouldDisplay: interfaceTypes.boolean,
//     isPrimary: interfaceTypes.boolean,
//   },

//   signals: {
//     changeIsPrimary: interfaceTypes.noArgument,
//   },
// })

module.exports = {
  DefaultTooltip: DefaultTooltip,
  // TooltipInterface: TooltipInterface,
}
