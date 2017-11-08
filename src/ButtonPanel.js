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
            className='button'
            onClick={() => this.props.zoomContainer.zoom_in()}
            title='Zoom in (+)'
          >
            <i className='fa fa-plus-circle' />
          </button>
        </li>
        <li>
          <button
            className='button'
            onClick={() => this.props.zoomContainer.zoom_out()}
            title='Zoom out (-)'
          >
            <i className='fa fa-minus-circle' />
          </button>
        </li>
        <li>
          <button
            className='button'
            onClick={() => this.props.map.zoom_extent_canvas()}
            title='Zoom to canvas (1)'
          >
            <i className='fa fa-expand' />
          </button>
        </li>
        <li className='grouping'>
          <button
            className='buttonGroup'
            title='Pan mode (Z)'
            for='zoom'
            id={this.props.mode === 'zoom' ? 'currentMode' : null}
            onClick={() => this.props.setMode('zoom')}
          >
            <i className='fa fa-arrows' />
          </button>
          <button
            className='buttonGroup'
            title='Select mode (V)'
            for='brush'
            id={this.props.mode === 'brush' ? 'currentMode' : null}
            onClick={() => this.props.setMode('brush')}
          >
            <i className='fa fa-mouse-pointer' />
          </button>
          <button
            className='buttonGroup'
            title='Add reaction mode (N)'
            for='build'
            onClick={() => this.props.setMode('build')}
            id={this.props.mode === 'build' ? 'currentMode' : null}>
            <i className='fa fa-wrench' />
          </button>
          <button
            className='buttonGroup'
            title='Rotate mode (R)'
            for='rotate'
            id={this.props.mode === 'rotate' ? 'currentMode' : null}
            onClick={() => this.props.setMode('rotate')}
          >
            <i className='fa fa-rotate-right' />
          </button>
          <button
            className='buttonGroup'
            title='Text mode (T)'
            for='text'
            id={this.props.mode === 'text' ? 'currentMode' : null}
            onClick={() => this.props.setMode('text')}
          >
            <i className='fa fa-font' />
          </button>
        </li>
        <li
          className='grouping'
          style={this.props.mode === 'build'
            ? {display: 'list-item'}
            : {display: 'none'}}
        >
          <button
            className='buttonGroup'
            title='Direction arrow (←)'
            onClick={() => this.props.buildInput.direction_arrow.left()}
          >
            <i className='fa fa-arrow-left' />
          </button>
          <button
            className='buttonGroup'
            title='Direction arrow (→)'
            onClick={() => this.props.buildInput.direction_arrow.right()}
          >
            <i className='fa fa-arrow-right' />
          </button>
          <button
            className='buttonGroup'
            title='Direction arrow (↑)'
            onClick={() => this.props.buildInput.direction_arrow.up()}
          >
            <i className='fa fa-arrow-up' />
          </button>
          <button
            className='buttonGroup'
            title='Direction arrow (↓)'
            onClick={() => this.props.buildInput.direction_arrow.down()}
          >
            <i className='fa fa-arrow-down' />
          </button>
        </li>
      </ul>
    )
  }
}

export default ButtonPanel
