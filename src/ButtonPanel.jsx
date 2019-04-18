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
    const menuSetting = this.props.settings.get('menu')
    const enableKeys = this.props.settings.get('enable_keys')
    const enableEditing = this.props.settings.get('enable_editing')

    return (
      <ul className='button-panel'>
        <li>
          <button
            className='button btn'
            onClick={() => this.props.zoomContainer.zoom_in()}
            title={`Zoom in${enableKeys ? ' (+)' : ''}`}
          >
            <i className='icon-zoom-in' />
          </button>
        </li>
        <li>
          <button
            className='button btn'
            onClick={() => this.props.zoomContainer.zoom_out()}
            title={`Zoom out${enableKeys ? ' (-)' : ''}`}
          >
            <i className='icon-zoom-out' />
          </button>
        </li>
        <li>
          <button
            className='button btn'
            onClick={() => this.props.map.zoom_extent_canvas()}
            title={`Zoom to canvas${enableKeys ? ' (1)' : ''}`}
          >
            <i className='icon-resize-full' />
          </button>
        </li>
        <li style={{display: this.props.settings.get('full_screen_button') !== false ? 'block' : 'none'}}>
          <button
            className='button btn'
            onClick={() => this.props.fullScreen()}
            title={`Toggle full screen${enableKeys ? ' (Ctrl+2)' : ''}`}
          >
            <i className='icon-resize-full-alt' />
          </button>
        </li>
        <li
          className='grouping'
          style={{display: menuSetting === 'all' && enableEditing ? 'block' : 'none'}}
        >
          <button
            className='buttonGroup btn'
            title={`Pan mode${enableKeys ? ' (Z)' : ''}`}
            for='zoom'
            id={this.props.mode === 'zoom' ? 'currentMode' : null}
            onClick={() => this.props.setMode('zoom')}
          >
            <i className='icon-move' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Select mode${enableKeys ? ' (V)' : ''}`}
            for='brush'
            id={this.props.mode === 'brush' ? 'currentMode' : null}
            onClick={() => this.props.setMode('brush')}
          >
            <i className='icon-mouse-pointer' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Add reaction mode${enableKeys ? ' (N)' : ''}`}
            for='build'
            onClick={() => this.props.setMode('build')}
            id={this.props.mode === 'build' ? 'currentMode' : null}>
            <i className='icon-wrench' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Rotate mode${enableKeys ? ' (R)' : ''}`}
            for='rotate'
            id={this.props.mode === 'rotate' ? 'currentMode' : null}
            onClick={() => this.props.setMode('rotate')}
          >
            <i className='icon-cw' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Text mode${enableKeys ? ' (T)' : ''}`}
            for='text'
            id={this.props.mode === 'text' ? 'currentMode' : null}
            onClick={() => this.props.setMode('text')}
          >
            <i className='icon-font' />
          </button>
        </li>
        <li
          className='grouping'
          style={{display: this.props.mode === 'build' && menuSetting === 'all' && enableEditing ? 'block' : 'none'}}
        >
          <button
            className='buttonGroup btn'
            title={`Direction arrow${enableKeys ? ' (←)' : ''}`}
            onClick={() => this.props.buildInput.direction_arrow.left()}
          >
            <i className='icon-left-big' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Direction arrow${enableKeys ? ' (→)' : ''}`}
            onClick={() => this.props.buildInput.direction_arrow.right()}
          >
            <i className='icon-right-big' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Direction arrow${enableKeys ? ' (↑)' : ''}`}
            onClick={() => this.props.buildInput.direction_arrow.up()}
          >
            <i className='icon-up-big' />
          </button>
          <button
            className='buttonGroup btn'
            title={`Direction arrow${enableKeys ? ' (↓)' : ''}`}
            onClick={() => this.props.buildInput.direction_arrow.down()}
          >
            <i className='icon-down-big' />
          </button>
        </li>
      </ul>
    )
  }
}

export default ButtonPanel
