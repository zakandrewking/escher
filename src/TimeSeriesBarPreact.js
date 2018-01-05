/** TimeSeriesBar */

/** @jsx h */
import { h, Component } from 'preact'
import './TimeSeriesBar.css'

class TimeSeriesBar extends Component {

  constructor (props) {
    super(props)

    this.state = {
      visible: props.visible,
      builder: props.builder
    }

  }

  close () {
    this.setState({visible: false})
  }

  openTab (typeOfData, builder) {

  }

  render () {
    return (
      <div
        className='timeSeriesContainer'
        style={this.state.visible ? {display: 'inline-flex'} : {display: 'none'}}>

        <div>

          <div>
            <button
              className='timeSeriesButton'
              onClick={this.openTab('reaction', this.state.builder)}
            >Reaction / Gene Data
            </button>
            <button
              className='timeSeriesButton'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Metabolite Data
            </button>

          </div>


          <div>
            <button
              className='timeSeriesButton'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Time Series
            </button>

            <button
              className='timeSeriesButton'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Difference Mode
            </button>
          </div>

          <div>
            <div>
              <select>Reference</select>
              <input
                type='range'
              > </input>
            </div>

            <div>
              <select>Target</select>
              <input
                type='range'
              > </input>
            </div>
          </div>

          <div>
            <button
              className='timeSeriesButton play'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Play
            </button>

            <input
              type='checkbox'
            > Interpolation</input>

            <input
              type='checkbox'
            >Sliding Window</input>

            <button
              className='timeSeriesButton escape'
              onClick={() => this.close()}
            >
              <i className='icon-cancel' style={{marginTop: '-2px', verticalAlign: 'middle'}}/>
            </button>

          </div>
        </div>
      </div>

    )

  }
}

export default TimeSeriesBar
