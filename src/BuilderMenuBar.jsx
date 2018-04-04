/** @jsx h */
import { h, Component } from 'preact'
import Dropdown from './Dropdown'
import MenuButton from './MenuButton'

/**
 * BuilderMenuBar. Wrapper class that implements generic Dropdown and MenuButton
 * objects to create the Builder menu bar. Currently re-renders every time an
 * edit mode is chosen. This can be changed once Builder is ported to Preact.
 */
class BuilderMenuBar extends Component {
  componentDidMount () {
    this.props.sel.selectAll('#canvas').on(
      'touchend', () => this.setState({visible: false})
    )
    this.props.sel.selectAll('#canvas').on(
      'click', () => this.setState({visible: false})
    )
  }

  render () {
    return (
      <ul className='menuBar'>
        <Dropdown name='Map' visible={this.state.visible}>
          <MenuButton
            name={'Save map JSON' + (this.props.enable_keys ? ' (Ctrl+S)' : '')}
            onClick={() => this.props.saveMap()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Load map JSON' + (this.props.enable_keys ? ' (Ctrl+O)' : '')}
            onClick={file => this.props.loadMap(file)}
            type='load'
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Export as SVG' + (this.props.enable_keys ? ' (Ctrl+Shift+S)' : '')}
            onClick={() => this.props.saveSvg()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Export as PNG' + (this.props.enable_keys ? ' (Ctrl+Shift+P)' : '')}
            onClick={() => this.props.savePng()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Clear map'
            onClick={() => this.props.clearMap()}
            disabledButtons={this.props.disabled_buttons}
          />
        </Dropdown>
        <Dropdown name='Model' visible={this.state.visible}>
          <MenuButton
            name={'Load COBRA model JSON' + (this.props.enable_keys ? ' (Ctrl+M)' : '')}
            onClick={file => this.props.loadModel(file)}
            type='load'
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Update names and gene reaction rules using model'
            onClick={() => this.props.updateRules()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Clear model'
            onClick={() => this.props.loadModel(null)}
            disabledButtons={this.props.disabled_buttons}
          />
        </Dropdown>
        <Dropdown name='Data' visible={this.state.visible}>
          <MenuButton
            name='Load reaction data'
            onClick={file => this.props.loadReactionData(file)}
            type='load'
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Clear reaction data'
            onClick={() => this.props.loadReactionData(null)}
            disabledButtons={this.props.disabled_buttons}
          />
          <li name='divider' />
          <MenuButton
            name='Load gene data'
            onClick={file => this.props.loadGeneData(file)}
            type='load'
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Clear gene data'
            onClick={() => this.props.loadGeneData(null)}
            disabledButtons={this.props.disabled_buttons}
          />
          <li name='divider' />
          <MenuButton
            name='Load metabolite data'
            onClick={file => this.props.loadMetaboliteData(file)}
            type='load'
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Clear metabolite data'
            onClick={() => this.props.loadMetaboliteData(null)}
            disabledButtons={this.props.disabled_buttons}
          />
        </Dropdown>
        <Dropdown
          name='Edit'
          rightMenu='true'
          visible={this.state.visible}
          disabledEditing={!this.props.enable_editing}
        >
          <MenuButton
            name={'Pan mode' + (this.props.enable_keys ? ' (Z)' : '')}
            modeName='zoom'
            mode={this.props.mode}
            onClick={() => this.props.setMode('zoom')}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Select mode' + (this.props.enable_keys ? ' (V)' : '')}
            modeName='brush'
            mode={this.props.mode}
            onClick={() => this.props.setMode('brush')}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Add reaction mode' + (this.props.enable_keys ? ' (N)' : '')}
            modeName='build'
            mode={this.props.mode}
            onClick={() => this.props.setMode('build')}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Rotate mode' + (this.props.enable_keys ? ' (R)' : '')}
            modeName='rotate'
            mode={this.props.mode}
            onClick={() => this.props.setMode('rotate')}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Text mode' + (this.props.enable_keys ? ' (T)' : '')}
            modeName='text'
            mode={this.props.mode}
            onClick={() => this.props.setMode('text')}
            disabledButtons={this.props.disabled_buttons}
          />
          <li name='divider' />
          <MenuButton
            name={'Delete' + (this.props.enable_keys ? ' (Del)' : '')}
            onClick={() => this.props.deleteSelected()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Undo' + (this.props.enable_keys ? ' (Ctrl+Z)' : '')}
            onClick={() => this.props.undo()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Redo' + (this.props.enable_keys ? ' (Ctrl+Shift+Z)' : '')}
            onClick={() => this.props.redo()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Toggle primary/secondary' + (this.props.enable_keys ? ' (P)' : '')}
            onClick={() => this.props.togglePrimary()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Rotate reactant locations' + (this.props.enable_keys ? ' (C)' : '')}
            onClick={() => this.props.cyclePrimary()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Select all' + (this.props.enable_keys ? ' (Ctrl+A)' : '')}
            onClick={() => this.props.selectAll()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Select none' + (this.props.enable_keys ? ' (Ctrl+Shift+A)' : '')}
            onClick={() => this.props.selectNone()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name='Invert selection'
            onClick={() => this.props.invertSelection()}
            disabledButtons={this.props.disabled_buttons}
          />
        </Dropdown>
        <Dropdown name='View' rightMenu='true' visible={this.state.visible}>
          <MenuButton
            name={'Zoom in' + (this.props.enable_keys ? ' (+)' : '')}
            onClick={() => this.props.zoomIn()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Zoom out' + (this.props.enable_keys ? ' (-)' : '')}
            onClick={() => this.props.zoomOut()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Zoom to nodes' + (this.props.enable_keys ? ' (0)' : '')}
            onClick={() => this.props.zoomExtentNodes()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Zoom to canvas' + (this.props.enable_keys ? ' (1)' : '')}
            onClick={() => this.props.zoomExtentCanvas()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={'Find' + (this.props.enable_keys ? ' (F)' : '')}
            onClick={() => this.props.search()}
            disabledButtons={this.props.disabled_buttons}
          />
          <MenuButton
            name={!this.props.beziers_enabled ? ('Show control points' +
            (this.props.enable_keys ? ' (B)' : '')) : ('Hide control points' +
            (this.props.enable_keys ? ' (B)' : ''))}
            onClick={
              () => {
                this.props.toggleBeziers()
                this.props.setMode(this.props.mode)
              }
            }
            disabledButtons={this.props.disabled_buttons}
          />
          <li name='divider' />
          <MenuButton
            name={'Settings' + (this.props.enable_keys ? ' (,)' : '')}
            onClick={() => this.props.renderSettingsMenu()}
            disabledButtons={this.props.disabled_buttons}
            type='settings'
          />
        </Dropdown>
        <a className='helpButton' target='#' href='https://escher.readthedocs.org'>?</a>
      </ul>
    )
  }
}

export default BuilderMenuBar
