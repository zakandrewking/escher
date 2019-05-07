/* global window */
/** @jsx h */

/**
 * Define a Tooltip component and interface with Preact.
 */
import { h, Component } from 'preact'
import './DefaultTooltip.css'
import * as utils from './utils'

class DefaultTooltip extends Component {
  decompartmentalizeCheck (id, type) {
  // ID without compartment, if metabolite.
    return type === 'metabolite'
      ? utils.decompartmentalize(id)[0]
      : id
  }

  openBigg () {
    const type = this.props.type
    const biggId = this.props.biggId
    const pref = 'http://bigg.ucsd.edu/'
    const url = type === 'gene'
      ? `${pref}search?query=${biggId}`
      : `${pref}universal/${type}s/${this.decompartmentalizeCheck(biggId, type)}`
    window.open(url)
  }

  capitalizeFirstLetter (s) {
    return typeof s === 'string'
    ? s.charAt(0).toUpperCase() + s.slice(1)
    : console.warn('capitalizeFirstLetter was passed something other than a string')
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
