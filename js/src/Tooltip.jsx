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
  decompartmentalizeCheck (id, type) {
  // ID without compartment, if metabolite.
    return type === 'metabolite'
    ? utils.decompartmentalize(id)[0]
    : id
  }

  openBigg () {
    let type = this.props.type
    let biggId = this.props.biggId
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

  render () {
    const decomp = this.decompartmentalizeCheck(this.props.biggId, this.props.type)
    const biggButtonText = `Open ${decomp} in BiGG Models.`
    return (
      <div className='Tooltip' style={containerStyle}>
        <div id='ID' style={idStyle}>
          {this.props.biggId}
        </div>
        <div id='data'>
          data: {(this.props.data && this.props.data !== '(nd)'
          ? this.props.data
          : 'no data')}
        </div>
        <button
          id='biggIdButton'
          style={buttonStyle}
          onClick={() => this.openBigg()}
          >
          {biggButtonText}
        </button>
        <div
          id='typeLabel'
          style={typeLabelStyle}
        >
          {this.capitalizeFirstLetter(this.props.type)}
        </div>
      </div>
    )
  }
}

export default DefaultTooltip
