/* global window */
/** @jsx h */

/**
 * Define a Tooltip component and interface with Preact.
 */
import { h, Component } from 'preact'
import './DefaultTooltip.css'

const utils = require('./utils')

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
    if (s !== undefined) {
      return s === null
      ? s
      : s.charAt(0).toUpperCase() + s.slice(1)
    }
  }

  render () {
    const decomp = this.decompartmentalizeCheck(this.props.biggId, this.props.type)
    const biggButtonText = `Open ${decomp} in BiGG Models.`
    return (
      <div className='tooltip'>
        <div className='id'>
          {this.props.biggId}
        </div>
        <div className='name'>
          name: {this.props.name}
        </div>
        <div className='data'>
          data: {(this.props.data && this.props.data !== '(nd)'
          ? this.props.data
          : 'no data')}
        </div>
        <button
          className='biggIdButton'
          onClick={() => this.openBigg()}
          >
          {biggButtonText}
        </button>
        <div
          className='typeLabel'
        >
          {this.capitalizeFirstLetter(this.props.type)}
        </div>
      </div>
    )
  }
}

export default DefaultTooltip
