/** @jsx h */
import {h, Component} from 'preact'
import './ButtonPanel.css'

/**
 * ButtonPanel. Sets up the button panel for Builder. Currently calls a
 * re-render on itself every time the mode is changed. This can be removed upon
 * porting Builder to Preact
 */
class ButtonPanel extends Component {
  render () {
    return (
      <ul className='buttonPanel'>
        <li>
          <button
            className='button btn'
            onClick={() => this.props.zoomContainer.zoom_in()}
            title='Zoom in (+)'
          >
            <i className='icon-plus-circled' />
          </button>
        </li>
        <li>
          <button
            className='button btn'
            onClick={() => this.props.zoomContainer.zoom_out()}
            title='Zoom out (-)'
          >
            <i className='icon-minus-circled' />
          </button>
        </li>
        <li>
          <button
            className='button btn'
            onClick={() => this.props.map.zoom_extent_canvas()}
            title='Zoom to canvas (1)'
          >
            <i className='icon-resize-full' />
          </button>
        </li>
        <li className='grouping'>
          <button
            className='buttonGroup btn'
            title='Pan mode (Z)'
            for='zoom'
            id={this.props.mode === 'zoom' ? 'currentMode' : null}
            onClick={() => this.props.setMode('zoom')}
          >
            <i className='icon-move' />
          </button>
          <button
            className='buttonGroup btn'
            title='Select mode (V)'
            for='brush'
            id={this.props.mode === 'brush' ? 'currentMode' : null}
            onClick={() => this.props.setMode('brush')}
          >
            <i className='icon-mouse-pointer' />
          </button>
          <button
            className='buttonGroup btn'
            title='Add reaction mode (N)'
            for='build'
            onClick={() => this.props.setMode('build')}
            id={this.props.mode === 'build' ? 'currentMode' : null}>
            <i className='icon-wrench' />
          </button>
          <button
            className='buttonGroup btn'
            title='Rotate mode (R)'
            for='rotate'
            id={this.props.mode === 'rotate' ? 'currentMode' : null}
            onClick={() => this.props.setMode('rotate')}
          >
            <i className='icon-cw' />
          </button>
          <button
            className='buttonGroup btn'
            title='Text mode (T)'
            for='text'
            id={this.props.mode === 'text' ? 'currentMode' : null}
            onClick={() => this.props.setMode('text')}
          >
            <i className='icon-font' />
          </button>
        </li>
        <li
          className='grouping'
          style={this.props.mode === 'build'
            ? {display: 'block'}
            : {display: 'none'}}
        >
          <button
            className='buttonGroup btn'
            title='Direction arrow (←)'
            onClick={() => this.props.buildInput.direction_arrow.left()}
          >
            <i className='icon-left-big' />
          </button>
          <button
            className='buttonGroup btn'
            title='Direction arrow (→)'
            onClick={() => this.props.buildInput.direction_arrow.right()}
          >
            <i className='icon-big-right' />
          </button>
          <button
            className='buttonGroup btn'
            title='Direction arrow (↑)'
            onClick={() => this.props.buildInput.direction_arrow.up()}
          >
            <i className='icon-big-up' />
          </button>
          <button
            className='buttonGroup btn'
            title='Direction arrow (↓)'
            onClick={() => this.props.buildInput.direction_arrow.down()}
          >
            <i className='icon-big-down' />
          </button>
        </li>
      </ul>
    )
  }
}

export default ButtonPanel
