/** @jsx h */
import { h, Component } from 'preact'
import Dropdown from './Dropdown'
import MenuButton from './MenuButton'

/**
 * MenuBar implements generic Dropdown and MenuButton objects to create the
 * Builder menu bar. Currently re-renders every time an edit mode is chosen.
 * This can be changed once Builder is ported to Preact.
 */
class MenuBar extends Component {
  componentWillMount () {
    this.props.sel.selectAll('.escher-zoom-container')
        .on('touchend.menuBar', () => this.setState({ dropdownVisible: false }))
        .on('click.menuBar', () => this.setState({ dropdownVisible: false }))
  }

  componentWillUnmount () {
    this.props.sel.selectAll('.escher-zoom-container')
        .on('touchend.menuBar', null)
        .on('click.menuBar', null)
  }

  render () {
    const enableKeys = this.props.settings.get('enable_keys')
    const disabledButtons = this.props.settings.get('disabled_buttons')
    const beziersEnabled = this.props.map.beziers_enabled

    return (
      <ul className='menu-bar'>
        <Dropdown name='Map' dropdownVisible={this.props.dropdownVisible}>
          <MenuButton
            name={'Save map JSON' + (enableKeys ? ' (Ctrl+S)' : '')}
            onClick={() => this.props.saveMap()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Load map JSON' + (enableKeys ? ' (Ctrl+O)' : '')}
            onClick={file => this.props.loadMap(file)}
            type='load'
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Export as SVG' + (enableKeys ? ' (Ctrl+Shift+S)' : '')}
            onClick={() => this.props.saveSvg()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Export as PNG' + (enableKeys ? ' (Ctrl+Shift+P)' : '')}
            onClick={() => this.props.savePng()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Clear map'
            onClick={() => this.props.clearMap()}
            disabledButtons={disabledButtons}
          />
        </Dropdown>
        <Dropdown name='Model' dropdownVisible={this.props.dropdownVisible}>
          <MenuButton
            name={'Load COBRA model JSON' + (enableKeys ? ' (Ctrl+M)' : '')}
            onClick={file => this.props.loadModel(file)}
            type='load'
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Update names and gene reaction rules using model'
            onClick={() => this.props.updateRules()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Clear model'
            onClick={() => this.props.clearModel()}
            disabledButtons={disabledButtons}
          />
        </Dropdown>
        <Dropdown name='Data' dropdownVisible={this.props.dropdownVisible}>
          <MenuButton
            name='Load reaction data'
            onClick={d => this.props.setReactionData(d)}
            type='load'
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Clear reaction data'
            onClick={() => this.props.setReactionData(null)}
            disabledButtons={disabledButtons}
          />
          <li name='divider' />
          <MenuButton
            name='Load gene data'
            onClick={d => this.props.setGeneData(d)}
            type='load'
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Clear gene data'
            onClick={() => this.props.setGeneData(null)}
            disabledButtons={disabledButtons}
          />
          <li name='divider' />
          <MenuButton
            name='Load metabolite data'
            onClick={d => this.props.setMetaboliteData(d)}
            type='load'
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Clear metabolite data'
            onClick={() => this.props.setMetaboliteData(null)}
            disabledButtons={disabledButtons}
          />
        </Dropdown>
        <Dropdown
          name='Edit'
          rightMenu='true'
          dropdownVisible={this.props.dropdownVisible}
          disabledEditing={!this.props.settings.get('enable_editing')}
        >
          <MenuButton
            name={'Pan mode' + (enableKeys ? ' (Z)' : '')}
            modeName='zoom'
            mode={this.props.mode}
            onClick={() => this.props.setMode('zoom')}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Select mode' + (enableKeys ? ' (V)' : '')}
            modeName='brush'
            mode={this.props.mode}
            onClick={() => this.props.setMode('brush')}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Add reaction mode' + (enableKeys ? ' (N)' : '')}
            modeName='build'
            mode={this.props.mode}
            onClick={() => this.props.setMode('build')}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Rotate mode' + (enableKeys ? ' (R)' : '')}
            modeName='rotate'
            mode={this.props.mode}
            onClick={() => this.props.setMode('rotate')}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Text mode' + (enableKeys ? ' (T)' : '')}
            modeName='text'
            mode={this.props.mode}
            onClick={() => this.props.setMode('text')}
            disabledButtons={disabledButtons}
          />
          <li name='divider' />
          <MenuButton
            name={'Delete' + (enableKeys ? ' (Del)' : '')}
            onClick={() => this.props.deleteSelected()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Undo' + (enableKeys ? ' (Ctrl+Z)' : '')}
            onClick={() => this.props.undo()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Redo' + (enableKeys ? ' (Ctrl+Shift+Z)' : '')}
            onClick={() => this.props.redo()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Toggle primary/secondary' + (enableKeys ? ' (P)' : '')}
            onClick={() => this.props.togglePrimary()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Rotate reactant locations' + (enableKeys ? ' (C)' : '')}
            onClick={() => this.props.cyclePrimary()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Select all' + (enableKeys ? ' (Ctrl+A)' : '')}
            onClick={() => this.props.selectAll()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={'Select none' + (enableKeys ? ' (Ctrl+Shift+A)' : '')}
            onClick={() => this.props.selectNone()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name='Invert selection'
            onClick={() => this.props.invertSelection()}
            disabledButtons={disabledButtons}
          />
        </Dropdown>
        <Dropdown name='View' rightMenu='true' dropdownVisible={this.props.dropdownVisible}>
          <MenuButton
            name={`Zoom in${enableKeys ? ' (+)' : ''}`}
            onClick={() => this.props.zoomIn()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={`Zoom out${enableKeys ? ' (-)' : ''}`}
            onClick={() => this.props.zoomOut()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={`Zoom to nodes${enableKeys ? ' (0)' : ''}`}
            onClick={() => this.props.zoomExtentNodes()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={`Zoom to canvas${enableKeys ? ' (1)' : ''}`}
            onClick={() => this.props.zoomExtentCanvas()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={`Toggle full screen${enableKeys ? ' (2)' : ''}`}
            onClick={() => this.props.map.full_screen()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={`Find${enableKeys ? ' (F)' : ''}`}
            onClick={() => this.props.search()}
            disabledButtons={disabledButtons}
          />
          <MenuButton
            name={`${beziersEnabled ? 'Hide' : 'Show'} control points${enableKeys ? ' (B)' : ''}`}
            onClick={() => this.props.toggleBeziers()}
            disabledButtons={disabledButtons}
          />
          <li name='divider' />
          <MenuButton
            name={`Settings${enableKeys ? ' (,)' : ''}`}
            onClick={() => this.props.renderSettingsMenu()}
            disabledButtons={disabledButtons}
            type='settings'
          />
        </Dropdown>
        <a className='helpButton' target='#' href='https://escher.readthedocs.org'>?</a>
      </ul>
    )
  }
}

export default MenuBar
