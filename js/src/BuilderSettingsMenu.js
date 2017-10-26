/**
 * SettingsMenu. Handles the functions associated with the UI for changing
 * settings. Implements Settings.js and ScaleEditor but otherwise only uses
 * Preact.
 */

/** @jsx h */
import { h, Component } from 'preact'
import ScaleSelector from './ScaleSelector.js'
import ScaleSlider from './ScaleSlider.js'
import ScaleSelection from './ScaleSelection.js'
import update from 'immutability-helper'
import * as _ from 'underscore'
import '../../css/src/SettingsMenu.css'

const scalePresets = {
  GaBuGeRd: [
    {type: 'min', color: '#c8c8c8', size: 12},
    {type: 'value', value: 0.01, color: '#9696ff', size: 16},
    {type: 'value', value: 20, color: '#209123', size: 20},
    {type: 'max', color: '#ff0000', size: 25}
  ],
  GaBuRd: [
    { type: 'min', color: '#c8c8c8', size: 12 },
    { type: 'median', color: '#9696ff', size: 20 },
    { type: 'max', color: '#ff0000', size: 25 }
  ],
  RdYlBu: [
    { type: 'min', color: '#d7191c', size: 12 },
    { type: 'median', color: '#ffffbf', size: 20 },
    { type: 'max', color: '#2c7bb6', size: 25 }
  ]
}

class BuilderSettingsMenu extends Component {
  constructor (props) {
    super(props)
    this.state = {
      display: props.display,
      defaultScale: props.reaction_scale
    }
    if (props.display) {
      this.componentWillAppear()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      display: nextProps.display
    })
    if (nextProps.display && !this.props.display) {
      this.componentWillAppear()
    }
    if (!nextProps.display && this.props.display) {
      this.componentWillDisappear()
    }
  }

  componentWillAppear () {
    this.props.settings.hold_changes()
  }

  componentWillDisappear () {
  }

  abandonChanges () {
    this.props.settings.abandon_changes()
  }

  saveChanges () {
    this.props.settings.accept_changes()
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
        style={this.state.display
          ? {display: 'block'}
          : {display: 'none'}
        }
      >
        <div className='settingsBoxContainer'>
          <button className='discardChanges' onClick={() => this.abandonChanges()}>
            <i className='fa fa-close' aria-hidden='true' />
          </button>
          <button className='saveChanges' onClick={() => this.saveChanges()}>
            <i className='fa fa-check' aria-hidden='true' />
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
                          'identifiers_on_map', 'bigg_id'
                          )
                        }}
                        checked={this.props.identifiers_on_map === 'bigg_id'}
                      />
                      ID's
                    </label>
                    <label className='optionGroup'>
                      <input
                        type='radio'
                        name='identifiers'
                        onClick={() => {
                          this.props.settings.set_conditional(
                          'identifiers_on_map', 'name'
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
                      'hide_all_labels', !this.props.hide_all_labels
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
                      'highlight_missing', !this.props.highlight_missing
                    )
                  }}
                  checked={this.props.highlight_missing}
                />Highlight reactions not in model
              </label>
              <label title='Show tooltips when hovering over reactions, metabolites, and genes'>
                <input
                  type='checkbox'
                  onClick={() =>
                    this.props.settings.set_conditional(
                      'enable_tooltips', !this.props.enable_tooltips
                    )
                  }
                  checked={this.props.enable_tooltips}
                  />
                  Show tooltips
              </label>
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
              scale={
                this.props.reaction_scale
                  ? this.props.reaction_scale
                  : this.state.defaultScale
              }
              settings={this.props.settings}
              type='Reaction'
              stats={this.props.map.get_data_statistics().reaction}
              noDataColor={this.props.reaction_no_data_color}
              noDataSize={this.props.reaction_no_data_size}
              onChange={(scale) => {
                this.props.settings.set_conditional('reaction_scale', scale)
              }}
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
              scale={
                this.props.metabolite_scale
                  ? this.props.metabolite_scale
                  : this.state.defaultScale
              }
              settings={this.props.settings}
              type='Metabolite'
              stats={this.props.map.get_data_statistics().metabolite}
              noDataColor={this.props.metabolite_no_data_color}
              noDataSize={this.props.metabolite_no_data_size}
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
