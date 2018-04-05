/** @jsx h */
import { h, Component } from 'preact'
import ScaleSelector from './ScaleSelector'
import ScaleSlider from './ScaleSlider'
import ScaleSelection from './ScaleSelection'
import update from 'immutability-helper'
import * as _ from 'underscore'
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
    this.state = {
      display: props.display
    }
    if (props.display) {
      this.componentWillAppear()
    }

    /* TODO where should this happen? */
    /* if (props.reaction_scale_preset) {
     *   props.settings.set_conditional(
     *     'reaction_scale', scalePresets[props.reaction_scale_preset]
     *   )
     * }
     * if (props.metabolite_scale_preset) {
     *   props.settings.set_conditional(
     *     'metabolite_scale', scalePresets[props.metabolite_scale_preset]
     *   )
     * } */
  }

  componentWillReceiveProps (nextProps) {
    this.setState({display: nextProps.display})
    if (nextProps.display && !this.props.display) {
      this.componentWillAppear()
    }
    if (!nextProps.display && this.props.display) {
      this.componentWillDisappear()
    }
  }

  componentWillAppear () {
    this.props.settings.hold_changes()
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

  componentWillDisappear () {
    this.props.closeMenu() // Function to pass display = false to the settings menu
    this.state.clearEscape()
    this.state.clearEnter()
  }

  abandonChanges () {
    this.props.settings.abandon_changes()
    this.componentWillDisappear()
  }

  saveChanges () {
    this.props.settings.accept_changes()
    this.componentWillDisappear()
  }

  /**
   * Function to handle changes to the reaction or metabolite styling.
   * @param {String} value - the style option to be added or removed
   * @param {String} type - reaction_style or metabolite_style
   */
  handleStyle (value, type) {
    if (this.props[type].indexOf(value) === -1) {
      this.props.settings.set_conditional(type,
        update(this.props[type], {$push: [value]})
      )
    } else if (this.props[type].indexOf(value) > -1) {
      this.props.settings.set_conditional(type,
        update(this.props[type], {$splice: [[this.props[type].indexOf(value), 1]]})
      )
    }
  }

  is_visible () {
    return this.state.display
  }

  render () {
    return (
      <div
        className='settingsBackground'
        style={this.props.display ? {display: 'block'} : {display: 'none'}}
      >
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
                          this.props.settings.set_conditional(
                            'identifiers_on_map',
                            'bigg_id'
                          )
                        }}
                        checked={this.props.identifiers_on_map === 'bigg_id'}
                      />
                      ID&apos;s
                    </label>
                    <label className='optionGroup'>
                      <input
                        type='radio'
                        name='identifiers'
                        onClick={() => {
                          this.props.settings.set_conditional(
                            'identifiers_on_map',
                            'name'
                          )
                        }}
                        checked={this.props.identifiers_on_map === 'name'}
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
                    this.props.scroll_behavior === 'zoom'
                    ? this.props.settings.set_conditional('scroll_behavior', 'pan')
                    : this.props.settings.set_conditional('scroll_behavior', 'zoom')
                  }}
                  checked={this.props.scroll_behavior === 'zoom'}
                />
                Scroll to zoom (instead of scroll to pan)
              </label>
              <label title='If checked, then only the primary metabolites will be displayed.'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.props.settings.set_conditional(
                      'hide_secondary_metabolites',
                      !this.props.hide_secondary_metabolites
                    )
                  }
                  checked={this.props.hide_secondary_metabolites}
                />
                Hide secondary metabolites
              </label>
              <label
                title='If checked, then gene reaction rules will be displayed below each reaction label. (Gene reaction rules are always shown when gene data is loaded.)'
              >
                <input
                  type='checkbox'
                  onClick={() =>
                    this.props.settings.set_conditional(
                      'show_gene_reaction_rules',
                      !this.props.show_gene_reaction_rules
                    )
                  }
                  checked={this.props.show_gene_reaction_rules}
                  />
                  Show gene reaction rules
              </label>
              <label title='If checked, hide all reaction, gene, and metabolite labels'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.props.settings.set_conditional(
                      'hide_all_labels',
                      !this.props.hide_all_labels
                    )
                  }
                  checked={this.props.hide_all_labels}
                />
                Hide reaction, gene, and metabolite labels
              </label>
              <label title='If checked, then allow duplicate reactions during model building.'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.props.settings.set_conditional(
                      'allow_building_duplicate_reactions',
                      !this.props.allow_building_duplicate_reactions
                    )
                  }
                  checked={this.props.allow_building_duplicate_reactions}
                />
                Allow duplicate reactions
              </label>
              <label title='If checked, then highlight in red all the reactions on the map that are not present in the loaded model.'>
                <input
                  type='checkbox'
                  onClick={() => {
                    this.props.settings.set_conditional(
                      'highlight_missing',
                      !this.props.highlight_missing
                    )
                  }}
                  checked={this.props.highlight_missing}
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
                        onClick={() =>
                          this.props.settings.set_conditional(
                            'enable_tooltips',
                            this.props.enable_tooltips.indexOf('label') > -1
                              ? update(this.props.enable_tooltips, {$splice: [[this.props.enable_tooltips.indexOf('label'), 1]]})
                              : update(this.props.enable_tooltips, {$push: ['label']})
                          )
                        }
                        checked={this.props.enable_tooltips.indexOf('label') > -1}
                        />
                      Labels
                    </label>
                    <label className='tooltipOption' title='If checked, tooltips will display over the reaction line segments and metabolite circles'>
                      <input
                        type='checkbox'
                        onClick={() =>
                          this.props.settings.set_conditional(
                            'enable_tooltips',
                            this.props.enable_tooltips.indexOf('object') > -1
                              ? update(this.props.enable_tooltips, {$splice: [[this.props.enable_tooltips.indexOf('object'), 1]]})
                              : update(this.props.enable_tooltips, {$push: ['object']})
                          )
                        }
                        checked={this.props.enable_tooltips.indexOf('object') > -1}
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
              <ScaleSelector>
                {Object.values(_.mapObject(scalePresets, (value, key) => {
                  return (
                    <ScaleSelection
                      name={key}
                      scale={value}
                      onClick={() => this.props.settings.set_conditional(
                        'reaction_scale', value
                      )}
                    />
                  )
                }))}
              </ScaleSelector>
            </div>
            <ScaleSlider
              scale={this.props.reaction_scale}
              settings={this.props.settings}
              type='Reaction'
              stats={this.props.map.get_data_statistics().reaction}
              noDataColor={this.props.reaction_no_data_color}
              noDataSize={this.props.reaction_no_data_size}
              onChange={(scale) => {
                console.log('slider change', scale)
                this.props.settings.set_conditional('reaction_scale', scale)
              }}
              abs={this.props.reaction_styles.indexOf('abs') > -1}
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
                      checked={this.props.reaction_styles.indexOf('abs') > -1}
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
                      checked={this.props.reaction_styles.indexOf('size') > -1}
                    />
                    Size
                  </label>
                  <label className='optionGroup' title='If checked, then color the reaction lines according to the value of the reaction data'>
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('color', 'reaction_styles')}
                      checked={this.props.reaction_styles.indexOf('color') > -1}
                    />
                    Color
                  </label>
                  <br />
                  <label className='optionGroup' title='If checked, then show data values in the reaction labels'>
                    <input
                      type='checkbox'
                      name='reactionStyle'
                      onClick={() => this.handleStyle('text', 'reaction_styles')}
                      checked={this.props.reaction_styles.indexOf('text') > -1}
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
                        this.props.settings.set_conditional(
                        'reaction_compare_style', 'fold'
                        )
                      }}
                      checked={this.props.reaction_compare_style === 'fold'}
                    />
                    Fold Change
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => {
                        this.props.settings.set_conditional(
                        'reaction_compare_style', 'log2_fold'
                        )
                      }}
                      checked={this.props.reaction_compare_style === 'log2_fold'}
                    />
                    Log2 (Fold Change)
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='reactionCompare'
                      onClick={() => {
                        this.props.settings.set_conditional(
                        'reaction_compare_style', 'diff'
                        )
                      }}
                      checked={this.props.reaction_compare_style === 'diff'}
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
                        this.props.settings.set_conditional(
                        'and_method_in_gene_reaction_rule', 'mean'
                        )
                      }}
                      checked={this.props.and_method_in_gene_reaction_rule === 'mean'}
                    />
                    Mean
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='andMethod'
                      onClick={() => {
                        this.props.settings.set_conditional(
                        'and_method_in_gene_reaction_rule', 'min'
                        )
                      }}
                      checked={this.props.and_method_in_gene_reaction_rule === 'min'}
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
              <ScaleSelector>
                {Object.values(_.mapObject(scalePresets, (value, key) => {
                  return (
                    <ScaleSelection
                      name={key}
                      scale={value}
                      onClick={() => this.props.settings.set_conditional(
                        'reaction_scale', value
                      )}
                    />
                  )
                }))}
              </ScaleSelector>
            </div>
            <ScaleSlider
              scale={this.props.metabolite_scale}
              settings={this.props.settings}
              type='Metabolite'
              stats={this.props.map.get_data_statistics().metabolite}
              noDataColor={this.props.metabolite_no_data_color}
              noDataSize={this.props.metabolite_no_data_size}
              onChange={(scale) => {
                this.props.settings.set_conditional('metabolite_scale', scale)
              }}
              abs={this.props.metabolite_styles.indexOf('abs') > -1}
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
                      checked={this.props.metabolite_styles.indexOf('abs') > -1}
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
                      checked={this.props.metabolite_styles.indexOf('size') > -1}
                    />
                    Size
                  </label>
                  <label className='optionGroup' title='If checked, then color the reaction lines according to the value of the metabolite data'>
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('color', 'metabolite_styles')}
                      checked={this.props.metabolite_styles.indexOf('color') > -1}
                    />
                    Color
                  </label>
                  <br />
                  <label className='optionGroup' title='If checked, then show data values in the metabolite labels'>
                    <input
                      type='checkbox'
                      name='metaboliteStyle'
                      onClick={() => this.handleStyle('text', 'metabolite_styles')}
                      checked={this.props.metabolite_styles.indexOf('text') > -1}
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
                        this.props.settings.set_conditional(
                        'metabolite_compare_style', 'fold'
                        )
                      }}
                      checked={this.props.metabolite_compare_style === 'fold'}
                    />
                    Fold Change
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => {
                        this.props.settings.set_conditional(
                        'metabolite_compare_style', 'log2_fold'
                        )
                      }}
                      checked={this.props.metabolite_compare_style === 'log2_fold'}
                    />
                    Log2 (Fold Change)
                  </label>
                  <label className='optionGroup'>
                    <input
                      type='radio'
                      name='metaboliteCompare'
                      onClick={() => {
                        this.props.settings.set_conditional(
                        'metabolite_compare_style', 'diff'
                        )
                      }}
                      checked={this.props.metabolite_compare_style === 'diff'}
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
