/* global window, XMLHttpRequest */

/**
 * Define a Tooltip component and interface with Tinier.
 */
import { h, Component } from 'preact'

const utils = require('./utils')
const _ = require('underscore')

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
  'box-shadow': '4px 6px 20px 0px rgba(0, 0, 0, 0.4)'
}

var idStyle = {
  'font-size': '18px',
  'font-weight': 'bold'
}

var buttonStyle = {
  'border-radius': '3px',
  'background-color': '#eee',
  'border': '1px solid #ddd',
  'margin-top': '4px'
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
  'padding': '0px 5px'
}

class DefaultTooltip extends Component {
  constructor (props) {
    super(props)
    this.state = {
      biggId: null,
      name: null,
      loc: null,
      data: null,
      type: null
    }
  }

  componentDidMount (props) {
    this.props.callbackManager.set('setState', this.setState.bind(this))
  }

  decompartmentalizeCheck (id, type) {
  // ID without compartment, if metabolite.
    return type === 'metabolite'
    ? utils.decompartmentalize(id)[0]
    : id
  }

  openBigg (props) {
    let type = this.props.state.type
    let biggId = this.props.state.biggId
    let pref = 'http://bigg.ucsd.edu/'
    let url = (type === 'gene'
              ? pref + 'search?query=' + biggId
              : pref + 'universal/' + type + 's/' + this.decompartmentalizeCheck(biggId, type))
    window.open(url)
  }

  capitalizeFirstLetter (s) {
    return s === null
    ? s
    : s.charAt(0).toUpperCase() + s.slice(1)
  }

  render (props) {
    const decomp = this.decompartmentalizeCheck(this.props.biggId, this.props.type)
    const biggButtonText = `Open ${decomp} in BiGG Models.`
    return (
      <div className='Tooltip' style={containerStyle}>
        <div id='ID' style={idStyle}>
        'Hi2: ' + {props.name}
        </div>
        {/* h('br'),
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
          capitalizeFirstLetter(args.state.type))) */}
      </div>
    )
  }
}

export default DefaultTooltip
