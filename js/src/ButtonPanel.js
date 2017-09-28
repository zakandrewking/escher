/** @jsx h */

import {h, Component} from 'preact'
import '../../css/src/ButtonPanel.css'

class ButtonPanel extends Component {
  render () {
    return (
      <ul className='buttonPanel'>
        <li>
          <button className='button' onClick={() => this.props.zoomContainer.zoom_in()}
            title='Zoom in (+)'>
            <i className='fa fa-plus-circle fa-2x' />
          </button>
        </li>
        <li>
          <button className='button' onClick={() =>
          this.props.zoomContainer.zoom_out()} title='Zoom out (-)'>
            <i className='fa fa-minus-circle fa-2x' />
          </button>
        </li>
        <li>
          <button
            className='button'
            onClick={() => this.props.map.zoom_extent_canvas()}
            title='Zoom to canvas (1)'
          >
            <i className='fa fa-expand fa-2x' />
          </button>
        </li>
        <li className='grouping'>
          <label
            className='buttonGroup'
            title='Pan mode (Z)'
            for='zoom'
            id={this.props.mode === 'zoom' ? 'currentMode' : null}
          >
            <i className='fa fa-arrows fa-2x' />
          </label>
          <input
            type='radio'
            id='zoom'
            name='mode'
            style={{display: 'none'}}
            onChange={() => this.props.setMode('zoom')}
          />
          <label
            className='buttonGroup'
            title='Select mode (V)'
            for='brush'
            id={this.props.mode === 'brush' ? 'currentMode' : null}
          >
            <i className='fa fa-mouse-pointer fa-2x' />
          </label>
          <input type='radio' id='brush' name='mode' style={{display: 'none'}} onChange={() => this.props.setMode('brush')} />
          <label className='buttonGroup' title='Add reaction mode (N)' for='build' id={this.props.mode === 'build' ? 'currentMode' : null}>
            <i className='fa fa-wrench fa-2x' />
          </label>
          <input type='radio' id='build' name='mode' style={{display: 'none'}} onChange={() => this.props.setMode('build')} />
          <label className='buttonGroup' title='Rotate mode (R)' for='rotate' id={this.props.mode === 'rotate' ? 'currentMode' : null}>
            <i className='fa fa-rotate-right fa-2x' />
          </label>
          <input type='radio' id='rotate' name='mode' style={{display: 'none'}} onChange={() => this.props.setMode('rotate')} />
          <input type='radio' id='text' name='mode' style={{display: 'none'}} onChange={() => this.props.setMode('text')} />
          <label className='buttonGroup' title='Text mode (T)' for='text' id={this.props.mode === 'text' ? 'currentMode' : null}>
            <i className='fa fa-font fa-2x' />
          </label>
        </li>
        <li className='grouping' style={this.props.mode === 'build' ? {display: 'list-item'} : {display: 'none'}}>
          <button className='buttonGroup' title='Direction arrow (←)' onClick={() => this.props.buildInput.direction_arrow.left()}>
            <i className='fa fa-arrow-left fa-2x' />
          </button>
          <button className='buttonGroup' title='Direction arrow (→)' onClick={() => this.props.buildInput.direction_arrow.right()}>
            <i className='fa fa-arrow-right fa-2x' />
          </button>
          <button className='buttonGroup' title='Direction arrow (↑)' onClick={() => this.props.buildInput.direction_arrow.up()}>
            <i className='fa fa-arrow-up fa-2x' />
          </button>
          <button className='buttonGroup' title='Direction arrow (↓)' onClick={() => this.props.buildInput.direction_arrow.down()}>
            <i className='fa fa-arrow-down fa-2x' />
          </button>
        </li>
      </ul>
    )
  }
}

export default ButtonPanel
