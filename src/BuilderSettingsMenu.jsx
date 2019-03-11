/** @jsx h */
import { h, Component } from 'preact'
import ScaleSelector from './ScaleSelector'
import ScaleSlider from './ScaleSlider'
import ScaleSelection from './ScaleSelection'
import _ from 'underscore'
import './BuilderSettingsMenu.css'
import scalePresets from './colorPresets'

/**
 * SettingsMenu. Handles the functions associated with the UI for changing
 * settings. Implements Settings.js but otherwise only uses
 * Preact.
 */
class BuilderSettingsMenu extends Component {
  constructor (props) {
    super(props)
    // keep props as state
    this.state = { ...props }
    if (props.display) {
      this.componentDidAppear()
    }
  }

  componentWillReceiveProps (nextProps) {
    // keep props as state
    this.setState({ ...nextProps })
  }

  componentDidUpdate (_, prevState) {
    if (!prevState.display && this.state.display) {
      this.componentDidAppear()
    }
    if (prevState.display && !this.state.display) {
      this.componentDidDisappear()
    }
  }

  componentDidAppear () {
    this.state.settings.holdChanges()
    this.setState({
      clearEscape: this.state.map.key_manager.add_escape_listener(
        () => this.abandonChanges(),
        true
      ),
      clearEnter: this.state.map.key_manager.add_key_listener(
        ['enter'],
        () => this.saveChanges(),
        true
      )
    })
  }

  componentDidDisappear () {
    this.state.clearEscape()
    this.state.clearEnter()
  }

  abandonChanges () {
    this.state.settings.abandonChanges()
    this.setState({ display: false })
  }

  saveChanges () {
    this.state.settings.acceptChanges()
    this.setState({ display: false })
  }

  /**
   * Function to toggle one option in the reaction or metabolite styling.
   * @param {String} value - the style option to be added or removed
   * @param {String} type - reaction_style or metabolite_style
   */
  handleStyle (value, type) {
    const currentSetting = this.state.settings.get(type)
    const index = currentSetting.indexOf(value)
    if (index === -1) {
      this.state.settings.set(type, [...currentSetting, value])
    } else {
      this.state.settings.set(type, [
        ...currentSetting.slice(0, index),
        ...currentSetting.slice(index + 1)
      ])
    }
  }

  is_visible () { // eslint-disable-line camelcase
    return this.state.display
  }

  render () {
    if (!this.state.display) return null

    const enableTooltips = this.state.settings.get('enable_tooltips') || []
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
                        onClick={() => {
                          this.state.settings.set(
                            'identifiers_on_map',
                            'bigg_id'
                          )
                        }}
                        checked={this.state.settings.get('identifiers_on_map') === 'bigg_id'}
                      />
                      ID&apos;s
                    </label>
                    <label className='optionGroup'>
                      <input
                        type='radio'
                        name='identifiers'
                        onClick={() => {
                          this.state.settings.set(
                            'identifiers_on_map',
                            'name'
                          )
                        }}
                        checked={this.state.settings.get('identifiers_on_map') === 'name'}
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
                    if (this.state.settings.get('scroll_behavior') === 'zoom') {
                      this.state.settings.set('scroll_behavior', 'pan')
                    } else {
                      this.state.settings.set('scroll_behavior', 'zoom')
                    }
                  }}
                  checked={this.state.settings.get('scroll_behavior') === 'zoom'}
                />
                Scroll to zoom (instead of scroll to pan)
              </label>
              <label title='If checked, then only the primary metabolites will be displayed.'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.state.settings.set(
                      'hide_secondary_metabolites',
                      !this.state.settings.get('hide_secondary_metabolites')
                    )
                  }
                  checked={this.state.settings.get('hide_secondary_metabolites')}
                />
                Hide secondary metabolites
              </label>
              <label
                title='If checked, then gene reaction rules will be displayed below each reaction label. (Gene reaction rules are always shown when gene data is loaded.)'
              >
                <input
                  type='checkbox'
                  onClick={() =>
                    this.state.settings.set(
                      'show_gene_reaction_rules',
                      !this.state.settings.get('show_gene_reaction_rules')
                    )
                  }
                  checked={this.state.settings.get('show_gene_reaction_rules')}
                  />
                  Show gene reaction rules
              </label>
              <label title='If checked, hide all reaction, gene, and metabolite labels'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.state.settings.set(
                      'hide_all_labels',
                      !this.state.settings.get('hide_all_labels')
                    )
                  }
                  checked={this.state.settings.get('hide_all_labels')}
                />
                Hide reaction, gene, and metabolite labels
              </label>
              <label title='If checked, then allow duplicate reactions during model building.'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.state.settings.set(
                      'allow_building_duplicate_reactions',
                      !this.state.settings.get('allow_building_duplicate_reactions')
                    )
                  }
                  checked={this.state.settings.get('allow_building_duplicate_reactions')}
                />
                Allow duplicate reactions
              </label>
              <label title='If checked, then highlight in red all the reactions on the map that are not present in the loaded model.'>
                <input
                  type='checkbox'
                  onClick={() => {
                    this.state.settings.set(
                      'highlight_missing',
                      !this.state.settings.get('highlight_missing')
                    )
                  }}
                  checked={this.state.settings.get('highlight_missing')}
                />Highlight reactions not in model
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
                          this.state.settings.set('enable_tooltips', newEnableTooltips)
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
                          this.state.settings.set('enable_tooltips', newEnableTooltips)
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
              <ScaleSelector disabled={this.state.map.get_data_statistics().reaction === null}>
                {Object.values(_.mapObject(scalePresets, (value, key) => {
                  return (
                    <ScaleSelection
                      name={key}
                      scale={value}
                      onClick={() => this.state.settings.set(
                        'reaction_scale', value
                      )}
                    />
                  )
                }))}
              </ScaleSelector>
            </div>
            <ScaleSlider
              scale={this.state.settings.get('reaction_scale')}
              settings={this.state.settings}
              type='Reaction'
              stats={this.state.map.get_data_statistics().reaction}
              noDataColor={this.state.settings.get('reaction_no_data_color')}
              noDataSize={this.state.settings.get('reaction_no_data_size')}
              onChange={scale => {
                this.state.settings.set('reaction_scale', scale)
              }}
              onNoDataColorChange={val => {
                this.state.settings.set('reaction_no_data_color', val)
              }}
              onNoDataSizeChange={val => {
                this.state.settings.set('reaction_no_data_size', val)
              }}
              abs={this.state.settings.get('reaction_styles').indexOf('abs') > -1}
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
                      checked={this.state.settings.get('reaction_styles').indexOf('abs') > -1}
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
                      checked={this.state.settings.get('reaction_styles').indexOf('size') > -1}
                    />
                    Size
                  </label>
                  <label className='optionGroup' title='If checked, then color the reaction lines according to the value of the reaction data'>
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('color', 'reaction_styles')}
                      checked={this.state.settings.get('reaction_styles').indexOf('color') > -1}
                    />
                    Color
                  </label>
                  <br />
                  <label className='optionGroup' title='If checked, then show data values in the reaction labels'>
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('text', 'reaction_styles')}
                      checked={this.state.settings.get('reaction_styles').indexOf('text') > -1}
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
                      onClick={() => {
                        this.state.settings.set(
                        'reaction_compare_style', 'fold'
                        )
                      }}
                      checked={this.state.settings.get('reaction_compare_style') === 'fold'}
                    />
                    Fold Change
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => {
                        this.state.settings.set(
                        'reaction_compare_style', 'log2_fold'
                        )
                      }}
                      checked={this.state.settings.get('reaction_compare_style') === 'log2_fold'}
                    />
                    Log2 (Fold Change)
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => {
                        this.state.settings.set(
                        'reaction_compare_style', 'diff'
                        )
                      }}
                      checked={this.state.settings.get('reaction_compare_style') === 'diff'}
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
                      onClick={() => {
                        this.state.settings.set(
                        'and_method_in_gene_reaction_rule', 'mean'
                        )
                      }}
                      checked={this.state.settings.get('and_method_in_gene_reaction_rule') === 'mean'}
                    />
                    Mean
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='andMethod'
                      onClick={() => {
                        this.state.settings.set(
                        'and_method_in_gene_reaction_rule', 'min'
                        )
                      }}
                      checked={this.state.settings.get('and_method_in_gene_reaction_rule') === 'min'}
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
              <ScaleSelector disabled={this.state.map.get_data_statistics().metabolite === null}>
                {Object.values(_.mapObject(scalePresets, (value, key) => {
                  return (
                    <ScaleSelection
                      name={key}
                      scale={value}
                      onClick={() => this.state.settings.set(
                        'metabolite_scale', value
                      )}
                    />
                  )
                }))}
              </ScaleSelector>
            </div>
            <ScaleSlider
              scale={this.state.settings.get('metabolite_scale')}
              settings={this.state.settings}
              type='Metabolite'
              stats={this.state.map.get_data_statistics().metabolite}
              noDataColor={this.state.settings.get('metabolite_no_data_color')}
              noDataSize={this.state.settings.get('metabolite_no_data_size')}
              onChange={scale => {
                this.state.settings.set('metabolite_scale', scale)
              }}
              onNoDataColorChange={val => {
                this.state.settings.set('metabolite_no_data_color', val)
              }}
              onNoDataSizeChange={val => {
                this.state.settings.set('metabolite_no_data_size', val)
              }}
              abs={this.state.settings.get('metabolite_styles').indexOf('abs') > -1}
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
                      checked={this.state.settings.get('metabolite_styles').indexOf('abs') > -1}
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
                      checked={this.state.settings.get('metabolite_styles').indexOf('size') > -1}
                    />
                    Size
                  </label>
                  <label className='optionGroup' title='If checked, then color the reaction lines according to the value of the metabolite data'>
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('color', 'metabolite_styles')}
                      checked={this.state.settings.get('metabolite_styles').indexOf('color') > -1}
                    />
                    Color
                  </label>
                  <br />
                  <label className='optionGroup' title='If checked, then show data values in the metabolite labels'>
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('text', 'metabolite_styles')}
                      checked={this.state.settings.get('metabolite_styles').indexOf('text') > -1}
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
                      onClick={() => {
                        this.state.settings.set(
                        'metabolite_compare_style', 'fold'
                        )
                      }}
                      checked={this.state.settings.get('metabolite_compare_style') === 'fold'}
                    />
                    Fold Change
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => {
                        this.state.settings.set(
                          'metabolite_compare_style', 'log2_fold'
                        )
                      }}
                      checked={this.state.settings.get('metabolite_compare_style') === 'log2_fold'}
                    />
                    Log2 (Fold Change)
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => {
                        this.state.settings.set(
                          'metabolite_compare_style', 'diff'
                        )
                      }}
                      checked={this.state.settings.get('metabolite_compare_style') === 'diff'}
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
export default BuilderSettingsMenu
