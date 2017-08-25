/* global window, XMLHttpRequest */

/**
 * Define a Tooltip component and interface with Tinier.
 */

var utils = require('./utils')
var tinier = require('tinier')
var createComponent = tinier.createComponent
var createInterface = tinier.createInterface
var typ = tinier.interfaceTypes
var h = tinier.createElement
var render = tinier.render
var _ = require('underscore')

// Define styles
var containerStyle = {
  'min-width': '270px',
  'min-height': '100px',
  'border-radius': '2px',
  'border': '1px solid #b58787',
  'padding': '7px',
  'background-color': '#fff',
  'text-align': 'left',
  'font-size': '16px',
  'font-family': 'sans-serif',
  'color': '#111',
  'box-shadow': '4px 6px 20px 0px rgba(0, 0, 0, 0.4)',
}

var idStyle = {
  'font-size': '18px',
  'font-weight': 'bold',
}

var buttonStyle = {
  'border-radius': '3px',
  'background-color': '#eee',
  'border': '1px solid #ddd',
  'margin-top': '4px',
}

var typeLabelStyle = {
  'position': 'absolute',
  'top': '4px',
  'right': '4px',
  'color': '#d27066',
  'background-color': '#ffeded',
  'border-radius': '2px',
  'font-size': '14px',
  'text-align': 'right',
  'padding': '0px 5px',
}

function decompartmentalizeCheck (id, type) {
  // ID without compartment, if metabolite.
  return type === 'metabolite' ? utils.decompartmentalize(id)[0] : id

}

function capitalizeFirstLetter (s) {
  return s === null ? s : s.charAt(0).toUpperCase() + s.slice(1)
}

// Create the component
var DefaultTooltip = createComponent({
  displayName: 'DefaultTooltip',

  init: function () {
    return {
      biggId: '',
      name: '',
      loc: { x: 0, y: 0 },
      data: null,
      type: null,
    }
  },

  reducers: {
    setContainerData: function (args) {
      return Object.assign({}, args.state, {
        biggId: args.biggId,
        name: args.name,
        loc: args.loc,
        data: args.data,
        type: args.type,
      })
    },
  },

  methods: {
    openBigg: function (args) {
      var type = args.state.type
      var biggId = args.state.biggId
      var pref = 'http://bigg.ucsd.edu/'
      var url = (type === 'gene' ?
                 pref + 'search?query=' + biggId :
                 pref + 'universal/' + type + 's/' + decompartmentalizeCheck(biggId, type))
      window.open(url)
    },
  },

  render: function (args) {
    var decomp = decompartmentalizeCheck(args.state.biggId, args.state.type)
    var biggButtonText = 'Open ' + decomp + ' in BiGG Models.'

    return render(
      // parent node
      args.el,
      // the new tooltip element
      h('div',
        // tooltip style
        { style: containerStyle },
        // id
        h('span', { style: idStyle }, args.state.biggId),
        h('br'),
        // descriptive name
        'name: ' + args.state.name,
        h('br'),
        // data
        'data: ' + (args.state.data && args.state.data !== '(nd)' ?
                    args.state.data : 'no data'),
        h('br'),
        // BiGG Models button
        h('button',
          { style: buttonStyle, onClick: args.methods.openBigg, },
          biggButtonText),
        // type label
        h('div',
          { style: typeLabelStyle },
          capitalizeFirstLetter(args.state.type)))
    )
  },
})

module.exports = DefaultTooltip
