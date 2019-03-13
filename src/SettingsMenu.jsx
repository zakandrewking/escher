/** @jsx h */
import { h, Component } from 'preact'
import ScaleSelector from './ScaleSelector'
import ScaleSlider from './ScaleSlider'
import ScaleSelection from './ScaleSelection'
import _ from 'underscore'
import './SettingsMenu.css'
import scalePresets from './colorPresets'

/**
 * SettingsMenu. Handles the functions associated with the UI for changing
 * settings. Implements Settings.js but otherwise only uses
 * Preact.
 */
class SettingsMenu extends Component {
  componentWillMount () {
    this.props.settings.holdChanges()
    this.setState({
      clearEscape: this.props.map.key_manager.add_escape_listener(
        () => this.abandonChanges(),
        true
      ),
      clearEnter: this.props.map.key_manager.add_key_listener(
        ['enter'],
        () => this.saveChanges(),
        true
      )
    })
  }

  componentWillUnmount () {
    this.state.clearEscape()
    this.state.clearEnter()
  }

  abandonChanges () {
    this.props.settings.abandonChanges()
    this.props.setDisplay(false)
  }

  saveChanges () {
    this.props.settings.acceptChanges()
    this.props.setDisplay(false)
  }

  /**
   * Function to toggle one option in the reaction or metabolite styling.
   * @param {String} value - the style option to be added or removed
   * @param {String} type - reaction_style or metabolite_style
   */
  handleStyle (value, type) {
    const currentSetting = this.props.settings.get(type)
    const index = currentSetting.indexOf(value)
    if (index === -1) {
      this.props.settings.set(type, [...currentSetting, value])
    } else {
      this.props.settings.set(type, [
        ...currentSetting.slice(0, index),
        ...currentSetting.slice(index + 1)
      ])
    }
  }

  render () {
    const settings = this.props.settings
    const enableTooltips = settings.get('enable_tooltips') || []
    const dataStatistics = this.props.map.get_data_statistics()

    return (
      <div className='settingsBackground'>
        <div className='settingsBoxContainer'>
          <button className='discardChanges btn' onClick={() => this.abandonChanges()}>
            <i className='icon-cancel' aria-hidden='true' />
          </button>
          <button className='saveChanges btn' onClick={() => this.saveChanges()}>
            <i className='icon-ok' aria-hidden='true' />
          </button>
          <div className='settingsBox'>
            <div className='settingsTip'>
              <i>Tip: Hover over an option to see more details about it.</i>
            </div>
            <hr />
            <div className='title'>
              View and build options
            </div>
            <div className='settingsContainer'>
              <table className='radioSelection'>
                <tr title='The identifiers that are show in the reaction, gene, and metabolite labels on the map.'>
                  <td className='optionLabel'>Identifiers:</td>
                  <td className='singleLine'>
                    <label className='optionGroup'>
                      <input
                        type='radio'
                        name='identifiers'
                        onClick={() => { settings.set('identifiers_on_map', 'bigg_id') }}
                        checked={settings.get('identifiers_on_map') === 'bigg_id'}
                      />
                      ID&apos;s
                    </label>
                    <label className='optionGroup'>
                      <input
                        type='radio'
                        name='identifiers'
                        onClick={() => { settings.set('identifiers_on_map', 'name') }}
                        checked={settings.get('identifiers_on_map') === 'name'}
                      />
                      Descriptive names
                    </label>
                  </td>
                </tr>
              </table>
              <label title='If checked, then the scroll wheel and trackpad will control zoom rather than pan.'>
                <input
                  type='checkbox'
                  onClick={() => {
                    if (settings.get('scroll_behavior') === 'zoom') {
                      settings.set('scroll_behavior', 'pan')
                    } else {
                      settings.set('scroll_behavior', 'zoom')
                    }
                  }}
                  checked={settings.get('scroll_behavior') === 'zoom'}
                />
                Scroll to zoom (instead of scroll to pan)
              </label>
              <label title='If checked, then only the primary metabolites will be displayed.'>
                <input
                  type='checkbox'
                  onClick={() =>
                    settings.set(
                      'hide_secondary_metabolites',
                      !settings.get('hide_secondary_metabolites')
                    )
                  }
                  checked={settings.get('hide_secondary_metabolites')}
                />
                Hide secondary metabolites
              </label>
              <label
                title='If checked, then gene reaction rules will be displayed below each reaction label. (Gene reaction rules are always shown when gene data is loaded.)'
              >
                <input
                  type='checkbox'
                  onClick={() =>
                    settings.set(
                      'show_gene_reaction_rules',
                      !settings.get('show_gene_reaction_rules')
                    )
                  }
                  checked={settings.get('show_gene_reaction_rules')}
                  />
                  Show gene reaction rules
              </label>
              <label title='If checked, hide all reaction, gene, and metabolite labels'>
                <input
                  type='checkbox'
                  onClick={() =>
                    settings.set(
                      'hide_all_labels',
                      !settings.get('hide_all_labels')
                    )
                  }
                  checked={settings.get('hide_all_labels')}
                />
                Hide reaction, gene, and metabolite labels
              </label>
              <label title='If checked, then allow duplicate reactions during model building.'>
                <input
                  type='checkbox'
                  onClick={() =>
                    settings.set(
                      'allow_building_duplicate_reactions',
                      !settings.get('allow_building_duplicate_reactions')
                    )
                  }
                  checked={settings.get('allow_building_duplicate_reactions')}
                />
                Allow duplicate reactions
              </label>
              <label title='If checked, then highlight in red all the reactions on the map that are not present in the loaded model.'>
                <input
                  type='checkbox'
                  onClick={() => {
                    settings.set(
                      'highlight_missing',
                      !settings.get('highlight_missing')
                    )
                  }}
                  checked={settings.get('highlight_missing')}
                />
                Highlight reactions not in model
              </label>
              <label title='If true, then use CSS3 3D transforms to speed up panning and zooming.'>
                <input
                  type='checkbox'
                  onClick={() => {
                    settings.set(
                      'use_3d_transform',
                      !settings.get('use_3d_transform')
                    )
                  }}
                  checked={settings.get('use_3d_transform')}
                />
                Use 3D transform for responsive panning and zooming
              </label>
              <table>
                <tr title='Determines over which elements tooltips will display for reactions, metabolites, and genes'>
                  <td>
                      Show tooltips over:
                  </td>
                  <td className='singleLine' >
                    <label className='tooltipOption' title='If checked, tooltips will display over the gene, reaction, and metabolite labels'>
                      <input
                        type='checkbox'
                        onClick={() => {
                          const type = 'label'
                          const newEnableTooltips = _.contains(enableTooltips, type)
                                                  ? _.filter(enableTooltips, x => x !== type)
                                                  : [...enableTooltips, type]
                          settings.set('enable_tooltips', newEnableTooltips)
                        }}
                        checked={_.contains(enableTooltips, 'label')}
                      />
                      Labels
                    </label>
                    <label className='tooltipOption' title='If checked, tooltips will display over the reaction line segments and metabolite circles'>
                      <input
                        type='checkbox'
                        onClick={() => {
                          const type = 'object'
                          const newEnableTooltips = _.contains(enableTooltips, type)
                                                  ? _.filter(enableTooltips, x => x !== type)
                                                  : [...enableTooltips, type]
                          settings.set('enable_tooltips', newEnableTooltips)
                        }}
                        checked={_.contains(enableTooltips, 'object')}
                      />
                      Objects
                    </label>
                  </td>
                </tr>
              </table>
            </div>
            <div className='settingsTip' style={{marginTop: '16px'}}>
              <i>Tip: To increase map performance, turn off text boxes (i.e. labels and gene reaction rules).</i>
            </div>
            <hr />
            <div className='scaleTitle'>
              <div className='title'>
                Reactions
              </div>
              <ScaleSelector disabled={dataStatistics.reaction === null}>
                {Object.values(_.mapObject(scalePresets, (value, key) => {
                  return (
                    <ScaleSelection
                      name={key}
                      scale={value}
                      onClick={() => {
                        settings.set('reaction_scale', value)
                      }}
                    />
                  )
                }))}
              </ScaleSelector>
            </div>
            <ScaleSlider
              scale={settings.get('reaction_scale')}
              settings={settings}
              type='Reaction'
              stats={dataStatistics.reaction}
              noDataColor={settings.get('reaction_no_data_color')}
              noDataSize={settings.get('reaction_no_data_size')}
              onChange={scale => {
                settings.set('reaction_scale', scale)
              }}
              onNoDataColorChange={val => {
                settings.set('reaction_no_data_color', val)
              }}
              onNoDataSizeChange={val => {
                settings.set('reaction_no_data_size', val)
              }}
              abs={settings.get('reaction_styles').indexOf('abs') > -1}
            />
            <div className='subheading'>
              Reaction or Gene data
            </div>
            <table className='radioSelection'>
              <tr>
                <td
                  className='optionLabel'
                  title='Options for reactions data'
                >
                Options:
                </td>
                <td>
                  <label
                    className='optionGroup'
                    title='If checked, use the absolute value when calculating colors and sizes of reactions on the map'
                  >
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('abs', 'reaction_styles')}
                      checked={_.contains(settings.get('reaction_styles'), 'abs')}
                      disabled={dataStatistics.reaction === null}
                    />
                    Absolute value
                  </label>
                  <label
                    className='optionGroup'
                    title='If checked, then size the thickness of reaction lines according to the value of the reaction data'
                  >
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('size', 'reaction_styles')}
                      checked={_.contains(settings.get('reaction_styles'), 'size')}
                      disabled={dataStatistics.reaction === null}
                    />
                    Size
                  </label>
                  <label className='optionGroup' title='If checked, then color the reaction lines according to the value of the reaction data'>
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('color', 'reaction_styles')}
                      checked={_.contains(settings.get('reaction_styles'), 'color')}
                      disabled={dataStatistics.reaction === null}
                    />
                    Color
                  </label>
                  <br />
                  <label className='optionGroup' title='If checked, then show data values in the reaction labels'>
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('text', 'reaction_styles')}
                      checked={_.contains(settings.get('reaction_styles'), 'text')}
                      disabled={dataStatistics.reaction === null}
                    />
                    Text (Show data in label)
                  </label>
                </td>
              </tr>
              <tr title='The function that will be used to compare datasets, when paired data is loaded'>
                <td className='optionLabel'>Comparison</td>
                <td>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => settings.set('reaction_compare_style', 'fold')}
                      checked={settings.get('reaction_compare_style') === 'fold'}
                      disabled={dataStatistics.reaction === null}
                    />
                    Fold Change
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => settings.set('reaction_compare_style', 'log2_fold')}
                      checked={settings.get('reaction_compare_style') === 'log2_fold'}
                      disabled={dataStatistics.reaction === null}
                    />
                    Log2 (Fold Change)
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => settings.set('reaction_compare_style', 'diff')}
                      checked={settings.get('reaction_compare_style') === 'diff'}
                      disabled={dataStatistics.reaction === null}
                    />
                    Difference
                  </label>
                </td>
              </tr>
            </table>
            <table className='radioSelection'>
              <tr
                title='The function that will be used to evaluate AND connections in gene reaction rules (AND connections generally connect components of an enzyme complex)'
              >
                <td className='optionLabelWide'>Method for evaluating AND:</td>
                <td>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='andMethod'
                      onClick={() => settings.set('and_method_in_gene_reaction_rule', 'mean')}
                      checked={settings.get('and_method_in_gene_reaction_rule') === 'mean'}
                      disabled={dataStatistics.reaction === null}
                    />
                    Mean
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='andMethod'
                      onClick={() => settings.set('and_method_in_gene_reaction_rule', 'min')}
                      checked={settings.get('and_method_in_gene_reaction_rule') === 'min'}
                      disabled={dataStatistics.reaction === null}
                    />
                    Min
                  </label>
                </td>
              </tr>
            </table>
            <hr />
            <div className='scaleTitle'>
              <div className='title'>
                Metabolites
              </div>
              <ScaleSelector disabled={dataStatistics.metabolite === null}>
                {Object.values(_.mapObject(scalePresets, (value, key) => {
                  return (
                    <ScaleSelection
                      name={key}
                      scale={value}
                      onClick={() => settings.set('metabolite_scale', value)}
                    />
                  )
                }))}
              </ScaleSelector>
            </div>
            <ScaleSlider
              scale={settings.get('metabolite_scale')}
              settings={settings}
              type='Metabolite'
              stats={dataStatistics.metabolite}
              noDataColor={settings.get('metabolite_no_data_color')}
              noDataSize={settings.get('metabolite_no_data_size')}
              onChange={scale => {
                settings.set('metabolite_scale', scale)
              }}
              onNoDataColorChange={val => {
                settings.set('metabolite_no_data_color', val)
              }}
              onNoDataSizeChange={val => {
                settings.set('metabolite_no_data_size', val)
              }}
              abs={_.contains(settings.get('metabolite_styles'), 'abs')}
            />
            <div className='subheading'>
              Metabolite data
            </div>
            <table className='radioSelection'>
              <tr>
                <td
                  className='optionLabel'
                  title='Options for metabolite data'
                >
                Options:
                </td>
                <td>
                  <label
                    className='optionGroup'
                    title='If checked, use the absolute value when calculating colors and sizes of metabolites on the map'
                  >
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('abs', 'metabolite_styles')}
                      checked={_.contains(settings.get('metabolite_styles'), 'abs')}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Absolute value
                  </label>
                  <label
                    className='optionGroup'
                    title='If checked, then size the thickness of reaction lines according to the value of the metabolite data'
                  >
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('size', 'metabolite_styles')}
                      checked={_.contains(settings.get('metabolite_styles'), 'size')}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Size
                  </label>
                  <label className='optionGroup' title='If checked, then color the reaction lines according to the value of the metabolite data'>
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('color', 'metabolite_styles')}
                      checked={_.contains(settings.get('metabolite_styles'), 'color')}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Color
                  </label>
                  <br />
                  <label className='optionGroup' title='If checked, then show data values in the metabolite labels'>
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('text', 'metabolite_styles')}
                      checked={_.contains(settings.get('metabolite_styles'), 'text')}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Text (Show data in label)
                  </label>
                </td>
              </tr>
              <tr title='The function that will be used to compare datasets, when paired data is loaded'>
                <td className='optionLabel'>Comparison</td>
                <td>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => settings.set('metabolite_compare_style', 'fold')}
                      checked={settings.get('metabolite_compare_style') === 'fold'}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Fold Change
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => settings.set('metabolite_compare_style', 'log2_fold')}
                      checked={settings.get('metabolite_compare_style') === 'log2_fold'}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Log2 (Fold Change)
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => settings.set('metabolite_compare_style', 'diff')}
                      checked={settings.get('metabolite_compare_style') === 'diff'}
                      disabled={dataStatistics.metabolite === null}
                    />
                    Difference
                  </label>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    )
  }
}
export default SettingsMenu
