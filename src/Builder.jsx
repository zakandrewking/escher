/**
 * For documentation of this class, see docs/javascript_api.rst
 */

/** @jsx h */
import preact, { h } from 'preact'
import ReactWrapper from './ReactWrapper'
import BuilderSettingsMenu from './BuilderSettingsMenu'
import ButtonPanel from './ButtonPanel'
import BuilderMenuBar from './BuilderMenuBar'
import SearchBar from './SearchBar'
import * as utils from './utils'
import BuildInput from './BuildInput'
import ZoomContainer from './ZoomContainer'
import Map from './Map'
import CobraModel from './CobraModel'
import Brush from './Brush'
import CallbackManager from './CallbackManager'
import Settings from './Settings'
import TextEditInput from './TextEditInput'
import QuickJump from './QuickJump'
import dataStyles from './data_styles'
import TooltipContainer from './TooltipContainer'
import DefaultTooltip from './DefaultTooltip'
import _ from 'underscore'
import { select as d3Select, selection as d3Selection } from 'd3-selection'
import { json as d3Json } from 'd3-request'

// Include custom font set for icons
import '../icons/css/fontello.css'

// Include GUI CSS normally with webpack
import './Builder.css'

// Import CSS as a string to embed. This also works from lib because css/src get
// uploaded to NPM.
import builderEmbed from '!!raw-loader!./Builder-embed.css'

class Builder {
  constructor (map_data, model_data, embeddedCss, selection, options) {
    // Defaults
    if (!selection) {
      selection = d3Select('body').append('div')
    } else if (selection instanceof d3Selection) {
      // D3 V4 selection
    } else if ('node' in selection) {
      // If user passes in a selection from an different d3 version/instance,
      // then reselect.
      selection = d3Select(selection.node())
    } else {
      // HTML Element
      selection = d3Select(selection)
    }
    if (!options) {
      options = {}
    }
    if (!embeddedCss) {
      embeddedCss = builderEmbed
    }

    this.map_data = map_data
    this.model_data = model_data
    this.embeddedCss = embeddedCss
    this.selection = selection
    this.menu_div = null
    this.button_div = null
    this.settings_div = null
    this.settingsMenuRef = null
    this.search_bar_div = null
    this.searchBarRef = null
    this.semanticOptions = null

    // apply this object as data for the selection
    this.selection.datum(this)
    this.selection.__builder__ = this

    // Remember if the user provided a custom value for reaction_styles
    this.has_custom_reaction_styles = Boolean(options.reaction_styles)

    // set defaults
    const optionsWithDefaults = utils.set_options(options, {
      // view options
      menu: 'all',
      scroll_behavior: 'pan',
      use_3d_transform: !utils.check_browser('safari'),
      enable_editing: true,
      enable_keys: true,
      enable_search: true,
      fill_screen: false,
      zoom_to_element: null,
      full_screen_button: false,
      ignore_bootstrap: false,
      disabled_buttons: null,
      semantic_zoom: null,
      // map, model, and styles
      starting_reaction: null,
      never_ask_before_quit: false,
      unique_map_id: null,
      primary_metabolite_radius: 20,
      secondary_metabolite_radius: 10,
      marker_radius: 5,
      gene_font_size: 18,
      hide_secondary_metabolites: false,
      show_gene_reaction_rules: false,
      hide_all_labels: false,
      canvas_size_and_loc: null,
      // applied data
      // reaction
      reaction_data: null,
      reaction_styles: ['color', 'size', 'text'],
      reaction_compare_style: 'log2_fold',
      reaction_scale: [ { type: 'min', color: '#c8c8c8', size: 12 },
                        { type: 'median', color: '#9696ff', size: 20 },
                        { type: 'max', color: '#ff0000', size: 25 } ],
      reaction_no_data_color: '#dcdcdc',
      reaction_no_data_size: 8,
      // gene
      gene_data: null,
      and_method_in_gene_reaction_rule: 'mean',
      // metabolite
      metabolite_data: null,
      metabolite_styles: ['color', 'size', 'text'],
      metabolite_compare_style: 'log2_fold',
      metabolite_scale: [ { type: 'min', color: '#fffaf0', size: 20 },
                          { type: 'median', color: '#f1c470', size: 30 },
                          { type: 'max', color: '#800000', size: 40 } ],
      metabolite_no_data_color: '#ffffff',
      metabolite_no_data_size: 10,
      // View and build options
      identifiers_on_map: 'bigg_id',
      highlight_missing: false,
      allow_building_duplicate_reactions: false,
      cofactors: [
        'atp', 'adp', 'nad', 'nadh', 'nadp', 'nadph', 'gtp', 'gdp', 'h', 'coa',
        'ump', 'h2o', 'ppi'
      ],
      // Extensions
      tooltip_component: DefaultTooltip,
      enable_tooltips: ['label', 'object'],
      reaction_scale_preset: null,
      metabolite_scale_preset: null,
      // Callbacks
      first_load_callback: null
    }, {
      primary_metabolite_radius: true,
      secondary_metabolite_radius: true,
      marker_radius: true,
      gene_font_size: true,
      reaction_no_data_size: true,
      metabolite_no_data_size: true
    })

    // Check the location
    if (utils.check_for_parent_tag(this.selection, 'svg')) {
      throw new Error('Builder cannot be placed within an svg node ' +
                      'because UI elements are html-based.')
    }

    // The options that are erased when the settings menu is canceled
    var conditional = [
      'identifiers_on_map',
      'scroll_behavior',
      'hide_secondary_metabolites',
      'show_gene_reaction_rules',
      'hide_all_labels',
      'allow_building_duplicate_reactions',
      'highlight_missing',
      'enable_tooltips',
      'reaction_scale_preset',
      'reaction_no_data_color',
      'reaction_no_data_size',
      'reaction_scale',
      'reaction_styles',
      'reaction_compare_style',
      'and_method_in_gene_reaction_rule',
      'metabolite_scale_preset',
      'metabolite_scale',
      'metabolite_styles',
      'metabolite_compare_style',
      'metabolite_no_data_color',
      'metabolite_no_data_size'
    ]
    // this.options and this.settings used to have different functions, but now
    // they are aliases
    this.settings = new Settings(optionsWithDefaults, conditional)

    // Warn if scales are too short
    ;['reaction_scale', 'metabolite_scale'].map(scaleType => {
      if (this.settings.get(scaleType) && this.settings.get(scaleType).length < 2) {
        console.warn(`Bad value for option "${scaleType}". Scales must have at least 2 points.`)
      }
    })

    // Set up this callback manager
    this.callback_manager = CallbackManager()
    const firstLoadCallback = this.settings.get('first_load_callback')
    if (firstLoadCallback !== null) {
      this.callback_manager.set('first_load', () => {
        firstLoadCallback(this)
      })
    }

    // Set up the zoom container
    this.zoom_container = new ZoomContainer(this.selection,
                                            this.settings.get('scroll_behavior'),
                                            this.settings.get('use_3d_transform'),
                                            this.settings.get('fill_screen'))
    // Zoom container status changes
    this.zoom_container.callback_manager.set('svg_start', function () {
      if (this.map) this.map.set_status('Drawing ...')
    }.bind(this))
    this.zoom_container.callback_manager.set('svg_finish', function () {
      if (this.map) this.map.set_status('')
    }.bind(this))
    this.zoom_container.callback_manager.set('zoomChange', function () {
      if (this.settings.get('semantic_zoom')) {
        const scale = this.zoom_container.window_scale
        const optionObject = this.settings.get('semantic_zoom')
        .sort((a, b) => a.zoomLevel - b.zoomLevel)
        .find(a => a.zoomLevel > scale)
        if (optionObject) {
          Object.entries(optionObject.options).map(([option, value]) => {
            if (this.options[option] !== value) {
              this.settings.set(option, value)
              this._updateData(false, true)
            }
          })
        }
      }
    }.bind(this))

    // Set up the tooltip container
    this.tooltip_container = new TooltipContainer(this.selection,
                                                  this.settings.get('tooltip_component'),
                                                  this.zoom_container)

    // Status in both modes
    this._create_status(this.selection)

    // Load the model, map, and update data in both
    this.load_model(this.model_data, false)

    // Append the bars and menu divs to the document
    var s = this.selection
    .append('div').attr('class', 'search-menu-container')
    .append('div').attr('class', 'search-menu-container-inline')
    this.menu_div = s.append('div')
    this.search_bar_div = s.append('div')
    this.button_div = this.selection.append('div')
    this.settings_div = this.selection.append('div')

    // Need to defer map loading to let webpack CSS load properly
    _.defer(() => {
      this.load_map(this.map_data, false)
      const messageFn = this._reactionCheckAddAbs()
      if (messageFn !== null) {
        this._updateData(true, true)
      }

      _.mapObject(this.settings.streams, (stream, key) => {
        stream.onValue(value => {
          this.pass_settings_menu_props({
            map: this.map,
            settings: this.settings
          })
          this.pass_menu_bar_props({
            settings: this.settings
          })
          if (key === 'reaction_styles' || key === 'metabolite_styles') {
            this._updateData(false, true)
          }
        })
      })

      // Setting callbacks. TODO enable atomic updates. Right now, every time the
      // menu closes, everything is drawn.
      this.settings.statusBus.onValue(x => {
        if (x === 'accept') {
          this._updateData(true, true, [ 'reaction', 'metabolite' ], false)
          if (this.zoom_container !== null) {
            // TODO make this automatic
            const new_behavior = this.settings.get('scroll_behavior')
            this.zoom_container.set_scroll_behavior(new_behavior)
          }
          if (this.map !== null) {
            this.map.draw_all_nodes(false)
            this.map.draw_all_reactions(true, false)
            this.map.select_none()
          }
        }
      })

      // Set up quick jump
      this._setup_quick_jump(this.selection)

      if (messageFn !== null) setTimeout(messageFn, 500)

      // Finally run callback
      _.defer(() => this.callback_manager.run('first_load', this))
    })
  }

  // builder.options is deprecated
  get options () {
    throw new Error('builder.options is deprecated. Use builder.settings.get() ' +
                    'and builder.settings.set() instead.')
  }
  set options (_) {
    throw new Error('builder.options is deprecated. Use builder.settings.get() ' +
                    'and builder.settings.set() instead.')
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  load_model (model_data, should_updateData) { // eslint-disable-line camelcase
    if (_.isUndefined(should_updateData)) {
      should_updateData = true
    }

    // Check the cobra model
    if (_.isNull(model_data)) {
      this.cobra_model = null
    } else {
      this.cobra_model = CobraModel.from_cobra_json(model_data)
    }

    if (this.map) {
      this.map.cobra_model = this.cobra_model
      if (should_updateData) {
        this._updateData(true, false)
      }
      if (this.settings.get('highlight_missing')) {
        this.map.draw_all_reactions(false, false)
      }
    }

    this.callback_manager.run('load_model', null, model_data, should_updateData)
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst
   */
  load_map (map_data, should_updateData) { // eslint-disable-line camelcase
    if (_.isUndefined(should_updateData)) {
      should_updateData = true
    }

    // Store map options that might be changed by semantic_zoom function
    const tempSemanticOptions = {}
    if (this.settings.get('semantic_zoom')) {
      for (let level of this.settings.get('semantic_zoom')) {
        Object.keys(level.options).map(option => {
          if (tempSemanticOptions[option] === undefined) {
            tempSemanticOptions[option] = this.settings.get(option)
          }
        })
      }
      this.semanticOptions = Object.assign({}, tempSemanticOptions)
    }

    // Begin with some definitions
    var selectable_mousedown_enabled = true
    var shift_key_on = false

    // remove the old builder
    utils.remove_child_nodes(this.zoom_container.zoomed_sel)

    var zoomed_sel = this.zoom_container.zoomed_sel
    var svg = this.zoom_container.svg

    // remove the old map side effects
    if (this.map) {
      this.map.key_manager.toggle(false)
    }

    if (map_data !== null) {
      // import map
      this.map = Map.from_data(map_data,
                               svg,
                               this.embeddedCss,
                               zoomed_sel,
                               this.zoom_container,
                               this.settings,
                               this.cobra_model,
                               this.settings.get('enable_search'))
    } else {
      // new map
      this.map = new Map(svg,
                         this.embeddedCss,
                         zoomed_sel,
                         this.zoom_container,
                         this.settings,
                         this.cobra_model,
                         this.settings.get('canvas_size_and_loc'),
                         this.settings.get('enable_search'))
    }

    // Connect status bar
    this._setup_status(this.map)

    // Connect status bar
    this._setup_status(this.map)

    // Set the data for the map
    if (should_updateData) {
      this._updateData(false, true)
    }

    // Set up the reaction input with complete.ly
    this.build_input = new BuildInput(this.selection, this.map,
                                      this.zoom_container, this.settings)

    // Set up the text edit input
    this.text_edit_input = new TextEditInput(this.selection, this.map,
                                            this.zoom_container)

    // Connect the tooltip
    this.tooltip_container.setup_map_callbacks(this.map)

    // Set up the Brush
    this.brush = new Brush(zoomed_sel, false, this.map, '.canvas-group')
    this.map.canvas.callback_manager.set('resize', function () {
      this.brush.toggle(true)
    }.bind(this))

    // Set up the modes
    this._setup_modes(this.map, this.brush, this.zoom_container)

    // Set up settings menu
    this.setUpSettingsMenu()

    // Set up menu bar
    this.setUpMenuBar()

    if (this.settings.get('enable_search')) {
      this.renderSearchBar(true)
    }

    // Set up key manager
    var keys = this._get_keys(
      this.map,
      this.zoom_container,
      this.search_bar,
      this.settings_bar,
      this.settings.get('enable_editing'),
      this.settings.get('full_screen_button')
    )
    this.map.key_manager.assigned_keys = keys
    // Tell the key manager about the reaction input and search bar
    this.map.key_manager.input_list = [
      this.build_input,
      this.searchBarRef,
      () => this.settingsMenuRef,
      this.text_edit_input,
      this.tooltip_container
    ]
    // Make sure the key manager remembers all those changes
    this.map.key_manager.update()
    // Turn it on/off
    this.map.key_manager.toggle(this.settings.get('enable_keys'))

    // Disable clears
    const newDisabledButtons = this.settings.get('disabled_buttons') || []
    if (!this.settings.get('reaction_data')) {
      newDisabledButtons.push('Clear reaction data')
    }
    if (!this.settings.get('gene_data')) {
      newDisabledButtons.push('Clear gene data')
    }
    if (!this.settings.get('metabolite_data')) {
      newDisabledButtons.push('Clear metabolite data')
    }
    this.settings.set('disabled_buttons', newDisabledButtons)

    // Set up selection box
    if (this.settings.get('zoom_to_element')) {
      const type = this.settings.get('zoom_to_element').type
      const element_id = this.settings.get('zoom_to_element').id
      if (_.isUndefined(type) || [ 'reaction', 'node' ].indexOf(type) === -1) {
        throw new Error('zoom_to_element type must be "reaction" or "node"')
      }
      if (_.isUndefined(element_id)) {
        throw new Error('zoom_to_element must include id')
      }
      if (type === 'reaction') {
        this.map.zoom_to_reaction(element_id)
      } else if (type === 'node') {
        this.map.zoom_to_node(element_id)
      }
    } else if (map_data !== null) {
      this.map.zoom_extent_canvas()
    } else {
      if (this.settings.get('starting_reaction') !== null && this.cobra_model !== null) {
        // Draw default reaction if no map is provided
        var size = this.zoom_container.get_size()
        var start_coords = { x: size.width / 2, y: size.height / 4 }
        this.map.new_reaction_from_scratch(this.settings.get('starting_reaction'),
                                           start_coords, 90)
        this.map.zoom_extent_nodes()
      } else {
        this.map.zoom_extent_canvas()
      }
    }

    // Start in zoom mode for builder, view mode for viewer
    if (this.settings.get('enable_editing')) {
      this.zoom_mode()
    } else {
      this.view_mode()
    }

    // confirm before leaving the page
    if (this.settings.get('enable_editing')) {
      this._setup_confirm_before_exit()
    }

    // draw
    this.map.draw_everything()
  }

  setUpSettingsMenu () {
    const settingsDivNode = this.settings_div.node()
    preact.render(
      <ReactWrapper
        callbackManager={this.callback_manager}
        callbackName='setSettingsMenuState'
        component={BuilderSettingsMenu}
        ref={instance => { this.settingsMenuRef = instance }}
      />,
      settingsDivNode,
      // If there is already a div, re-render it. Otherwise make a new one
      settingsDivNode.children.length > 0 ? settingsDivNode.firstChild : undefined
    )
  }

  setUpMenuBar () {
    const menuDivNode = this.menu_div.node()
    preact.render(
      <ReactWrapper
        callbackManager={this.callback_manager}
        callbackName='setMenuBarState'
        component={BuilderMenuBar}
        ref={instance => { this.builderMenuBarRef = instance }}
        display={this.settings.get('menu') === 'all'}
        sel={this.selection}
        mode={this.mode}
        settings={this.settings}
        saveMap={() => {
          // Revert options changed by semanticZoom to their original values if option is active
          if (this.semanticOptions) {
            Object.entries(this.semanticOptions).map(([key, value]) => {
              this.settings.set(key, value)
            })
            this._updateData()
          }
          this.map.save()
        }}
        loadMap={(file) => this.load_map(file)}
        saveSvg={() => this.map.save_svg()}
        savePng={() => this.map.save_png()}
        clearMap={
        () => {
          this.map.clear_map()
          this.callback_manager.run('clear_map')
        }
        }
        loadModel={file => this.load_model(file, true)}
        clearModel={
        () => {
          this.load_model(null)
          this.callback_manager.run('clear_model')
        }
        }
        updateRules={() => this.map.convert_map()}
        setReactionData={d => this.set_reaction_data(d)}
        setGeneData={d => this.set_gene_data(d)}
        setMetaboliteData={d => this.set_metabolite_data(d)}
        setMode={(newMode) => this._set_mode(newMode)}
        deleteSelected={() => this.map.delete_selected()}
        undo={() => this.map.undo_stack.undo()}
        redo={() => this.map.undo_stack.redo()}
        togglePrimary={() => this.map.toggle_selected_node_primary()}
        cyclePrimary={() => this.map.cycle_primary_node()}
        selectAll={() => this.map.select_all()}
        selectNone={() => this.map.select_none()}
        invertSelection={() => this.map.invert_selection()}
        zoomIn={() => this.zoom_container.zoom_in()}
        zoomOut={() => this.zoom_container.zoom_out()}
        zoomExtentNodes={() => this.map.zoom_extent_nodes()}
        zoomExtentCanvas={() => this.map.zoom_extent_canvas()}
        search={() => this.renderSearchBar()}
        toggleBeziers={() => this.map.toggle_beziers()}
        renderSettingsMenu={() => this.pass_settings_menu_props({
          map: this.map,
          settings: this.settings,
          display: true
        })}
      />,
      menuDivNode,
      // If there is already a div, re-render it. Otherwise make a new one
      menuDivNode.children.length > 0 ? menuDivNode.firstChild : undefined
    )
  }

  renderSearchBar (hide, searchItem) {
    if (!this.settings.get('enable_search')) { return }
    const searchBarNode = this.search_bar_div.node()
    preact.render(
      <SearchBar
        visible={!hide}
        searchItem={searchItem}
        searchIndex={this.map.search_index}
        map={this.map}
        ref={instance => { this.searchBarRef = instance }}
      />,
      searchBarNode,
      searchBarNode.children.length > 0 // If there is already a div, re-render it. Otherwise make a new one
        ? searchBarNode.firstChild
        : undefined
    )
  }

  renderButtonPanel (mode) {
    const buttonPanelDivNode = this.button_div.node()
    preact.render(
      <ButtonPanel
        all={this.settings.get('menu') === 'all'}
        fullscreen={this.settings.get('full_screen_button')}
        enableEditing={this.settings.get('enable_editing')}
        setMode={(newMode) => this._set_mode(newMode)}
        zoomContainer={this.zoom_container}
        map={this.map}
        mode={mode}
        buildInput={this.build_input}
      />,
    buttonPanelDivNode,
    buttonPanelDivNode.children.length > 0 // If there is already a div, re-render it. Otherwise make a new one
      ? buttonPanelDivNode.firstChild
      : undefined
    )
  }

  _set_mode (mode) {
    this.renderButtonPanel(mode)
    // input
    this.build_input.toggle(mode === 'build')
    this.build_input.direction_arrow.toggle(mode === 'build')
    // brush
    this.brush.toggle(mode === 'brush')
    // zoom
    this.zoom_container.toggle_pan_drag(mode === 'zoom' || mode === 'view')
    // resize canvas
    this.map.canvas.toggle_resize(mode === 'zoom' || mode === 'brush')
    // Behavior. Be careful of the order becuase rotation and
    // toggle_selectable_drag both use Behavior.selectable_drag.
    if (mode === 'rotate') {
      this.map.behavior.toggle_selectable_drag(false) // before toggle_rotation_mode
      this.map.behavior.toggle_rotation_mode(true)
    } else {
      this.map.behavior.toggle_rotation_mode(mode === 'rotate') // before toggle_selectable_drag
      this.map.behavior.toggle_selectable_drag(mode === 'brush')
    }
    this.map.behavior.toggle_selectable_click(mode === 'build' || mode === 'brush')
    this.map.behavior.toggle_label_drag(mode === 'brush')
    this.map.behavior.toggle_label_mouseover(true)
    this.map.behavior.toggle_label_touch(true)
    this.map.behavior.toggle_text_label_edit(mode === 'text')
    this.map.behavior.toggle_bezier_drag(mode === 'brush')
    // edit selections
    if (mode === 'view' || mode === 'text') {
      this.map.select_none()
    }
    if (mode === 'rotate') {
      this.map.deselect_text_labels()
    }
    this.map.draw_everything()
  }

  view_mode () {
    /** For documentation of this function, see docs/javascript_api.rst.  */
    this.callback_manager.run('view_mode')
    this._set_mode('view')
  }

  build_mode () {
    /** For documentation of this function, see docs/javascript_api.rst.  */
    this.callback_manager.run('build_mode')
    this._set_mode('build')
  }

  brush_mode () {
    /** For documentation of this function, see docs/javascript_api.rst.  */
    this.callback_manager.run('brush_mode')
    this._set_mode('brush')
  }

  zoom_mode () {
    /** For documentation of this function, see docs/javascript_api.rst.  */
    this.callback_manager.run('zoom_mode')
    this._set_mode('zoom')
  }

  rotate_mode () {
    /** For documentation of this function, see docs/javascript_api.rst.  */
    this.callback_manager.run('rotate_mode')
    this._set_mode('rotate')
  }

  text_mode () {
    /** For documentation of this function, see docs/javascript_api.rst.  */
    this.callback_manager.run('text_mode')
    this._set_mode('text')
  }

  _reactionCheckAddAbs () {
    const curr_style = this.settings.get('reaction_styles')
    const did_abs = false
    if (this.settings.get('reaction_data') !== null &&
        !this.has_custom_reaction_styles &&
        !_.contains(curr_style, 'abs')) {
      this.settings.set('reaction_styles', curr_style.concat('abs'))
      return function () {
        this.map.set_status('Visualizing absolute value of reaction data. ' +
                            'Change this option in Settings.', 5000)
      }.bind(this)
    }
    return null
  }

  /**
   * Function to pass props for the tooltip component
   * @param {Object} props - Props that the tooltip will use
   */
  pass_tooltip_component_props (props) {
    this.tooltip_container.callback_manager.run('setState', null, props)
  }

  /**
   * Function to pass props for the settings menu
   * @param {Object} props - Props that the settings menu will use
   */
  pass_settings_menu_props (props) {
    this.callback_manager.run('setSettingsMenuState', null, props)
  }

  /**
   * Function to pass props for the settings menu
   * @param {Object} props - Props that the settings menu will use
   */
  passMenuBarProps (props) {
    this.callback_manager.run('setMenuBarState', null, props)
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_reaction_data (data) { // eslint-disable-line camelcase
    this.settings.set('reaction_data', data)

    var messageFn = this._reactionCheckAddAbs()

    this._updateData(true, true, 'reaction')

    if (messageFn) messageFn()
    else this.map.set_status('')

    const disabledButtons = this.settings.get('disabled_buttons') || []
    const buttonName = 'Clear reaction data'
    const index = disabledButtons.indexOf(buttonName)
    if (data !== null && index !== -1) {
      this.settings.set('disabled_buttons', [
        ...disabledButtons.slice(0, index),
        ...disabledButtons.slice(index + 1)
      ])
    } else if (data === null && index === -1) {
      this.settings.set('disabled_buttons', [...disabledButtons, buttonName])
    }
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_gene_data (data, clear_gene_reaction_rules) {
    if (clear_gene_reaction_rules) {
      // default undefined
      this.settings.set('show_gene_reaction_rules', false)
    }
    this.settings.set('gene_data', data)
    this._updateData(true, true, 'reaction')
    this.map.set_status('')

    const disabledButtonsArray = this.settings.get('disabled_buttons') || []
    const index = disabledButtonsArray.indexOf('Clear gene data')
    if (index > -1) {
      disabledButtonsArray.splice(index, 1)
      this.settings.set('disabled_buttons', disabledButtonsArray)
    } else if (index === -1 && data === null) {
      this.settings.set('disabled_buttons', [...disabledButtonsArray, 'Clear gene data'])
    }
  }

  set_metabolite_data (data) {
    /** For documentation of this function, see docs/javascript_api.rst.

     */
    this.settings.set('metabolite_data', data)
    this._updateData(true, true, 'metabolite')
    this.map.set_status('')

    const disabledButtonsArray = this.settings.get('disabled_buttons') || []
    const index = disabledButtonsArray.indexOf('Clear metabolite data')
    if (index > -1) {
      disabledButtonsArray.splice(index, 1)
      this.settings.set('disabled_buttons', disabledButtonsArray)
    } else if (index === -1 && data === null) {
      this.settings.set('disabled_buttons', [...disabledButtonsArray, 'Clear metabolite data'])
    }
  }

  /**
   * Set data and settings for the model.
   * update_model: (Boolean) Update data for the model.
   * update_map: (Boolean) Update data for the map.
   * kind: (Optional, Default: all) An array defining which data is being updated
   * that can include any of: ['reaction', 'metabolite'].
   * should_draw: (Optional, Default: true) Whether to redraw the update sections
   * of the map.
   */
  _updateData (
    update_model,
    update_map,
    kind = ['reaction', 'metabolite '],
    should_draw = true
  ) {
    const update_metabolite_data = (kind.indexOf('metabolite') !== -1)
    const update_reaction_data = (kind.indexOf('reaction') !== -1)
    let met_data_object
    let reaction_data_object
    let gene_data_object

    // -------------------
    // First map, and draw
    // -------------------

    // metabolite data
    if (update_metabolite_data && update_map && this.map !== null) {
      met_data_object = dataStyles.import_and_check(this.settings.get('metabolite_data'),
                                                     'metabolite_data')
      this.map.apply_metabolite_data_to_map(met_data_object)
      if (should_draw) {
        this.map.draw_all_nodes(false)
      }
    }

    // reaction data
    if (update_reaction_data) {
      if (this.settings.get('reaction_data') !== null && update_map && this.map !== null) {
        reaction_data_object = dataStyles.import_and_check(this.settings.get('reaction_data'),
                                                            'reaction_data')
        this.map.apply_reaction_data_to_map(reaction_data_object)
        if (should_draw) {
          this.map.draw_all_reactions(false, false)
        }
      } else if (this.settings.get('gene_data') !== null && update_map && this.map !== null) {
        gene_data_object = make_gene_data_object(this.settings.get('gene_data'),
                                                 this.cobra_model, this.map)
        this.map.apply_gene_data_to_map(gene_data_object)
        if (should_draw) {
          this.map.draw_all_reactions(false, false)
        }
      } else if (update_map && this.map !== null) {
        // clear the data
        this.map.apply_reaction_data_to_map(null)
        if (should_draw) {
          this.map.draw_all_reactions(false, false)
        }
      }
    }

    // ----------------------------------------------------------------
    // Then the model, after drawing. Delay by 5ms so the the map draws
    // first.
    // ----------------------------------------------------------------

    // If this function runs again, cancel the previous model update
    if (this.update_model_timer) {
      clearTimeout(this.update_model_timer)
    }

    var delay = 5
    this.update_model_timer = setTimeout(function () {

      // metabolite_data
      if (update_metabolite_data && update_model && this.cobra_model !== null) {
        // if we haven't already made this
        if (!met_data_object) {
          met_data_object = dataStyles.import_and_check(this.settings.get('metabolite_data'),
                                                         'metabolite_data')
        }
        this.cobra_model.apply_metabolite_data(met_data_object,
                                               this.settings.get('metabolite_styles'),
                                               this.settings.get('metabolite_compare_style'))
      }

      // reaction data
      if (update_reaction_data) {
        if (this.settings.get('reaction_data') !== null && update_model && this.cobra_model !== null) {
          // if we haven't already made this
          if (!reaction_data_object) {
            reaction_data_object = dataStyles.import_and_check(this.settings.get('reaction_data'),
                                                                'reaction_data')
          }
          this.cobra_model.apply_reaction_data(reaction_data_object,
                                               this.settings.get('reaction_styles'),
                                               this.settings.get('reaction_compare_style'))
        } else if (this.settings.get('gene_data') !== null && update_model && this.cobra_model !== null) {
          if (!gene_data_object) {
            gene_data_object = make_gene_data_object(this.settings.get('gene_data'),
                                                     this.cobra_model, this.map)
          }
          this.cobra_model.apply_gene_data(gene_data_object,
                                           this.settings.get('reaction_styles'),
                                           this.settings.get('identifiers_on_map'),
                                           this.settings.get('reaction_compare_style'),
                                           this.settings.get('and_method_in_gene_reaction_rule'))
        } else if (update_model && this.cobra_model !== null) {
          // clear the data
          this.cobra_model.apply_reaction_data(null,
                                               this.settings.get('reaction_styles'),
                                               this.settings.get('reaction_compare_style'))
        }
      }

      // callback
      this.callback_manager.run('update_data', null, update_model, update_map,
                                kind, should_draw)
    }.bind(this), delay)

    // definitions
    function make_gene_data_object (gene_data, cobra_model, map) {
      var all_reactions = {}
      if (cobra_model !== null) {
        utils.extend(all_reactions, cobra_model.reactions)
      }
      // extend, overwrite
      if (map !== null) {
        utils.extend(all_reactions, map.reactions, true)
      }

      // this object has reaction keys and values containing associated genes
      return dataStyles.import_and_check(gene_data, 'gene_data', all_reactions)
    }
  }

  _create_status (selection) {
    this.status_bar = selection.append('div').attr('id', 'status')
  }

  _setup_status (map) {
    map.callback_manager.set('set_status', status => this.status_bar.html(status))
  }

  _setup_quick_jump (selection) {
    // function to load a map
    var load_fn = function (new_map_name, quick_jump_path, callback) {
      if (this.settings.get('enable_editing') && !this.settings.get('never_ask_before_quit')) {
        if (!(confirm(('You will lose any unsaved changes.\n\n' +
                       'Are you sure you want to switch maps?')))) {
          if (callback) callback(false)
          return
        }
      }
      this.map.set_status('Loading map ' + new_map_name + ' ...')
      var url = utils.name_to_url(new_map_name, quick_jump_path)
      d3Json(url, function (error, data) {
        if (error) {
          console.warn('Could not load data: ' + error)
          this.map.set_status('Could not load map', 2000)
          if (callback) callback(false)
          return
        }
        // run callback before load_map so the new map has the correct
        // quick_jump menu
        if (callback) callback(true)
        // now reload
        this.load_map(data)
        this.map.set_status('')
      }.bind(this))
    }.bind(this)

    // make the quick jump object
    this.quick_jump = QuickJump(selection, load_fn)
  }

  _setup_modes (map, brush, zoom_container) {
    // set up zoom+pan and brush modes
    var was_enabled = {}
    map.callback_manager.set('start_rotation', function () {
      was_enabled.brush = brush.enabled
      brush.toggle(false)
      was_enabled.zoom = zoom_container.zoom_on
      zoom_container.toggle_pan_drag(false)
      was_enabled.selectable_mousedown = map.behavior.selectable_mousedown !== null
      map.behavior.toggle_selectable_click(false)
      was_enabled.label_mouseover = map.behavior.label_mouseover !== null
      was_enabled.label_touch = map.behavior.label_touch !== null
      map.behavior.toggle_label_mouseover(false)
      map.behavior.toggle_label_touch(false)
    })
    map.callback_manager.set('end_rotation', function () {
      brush.toggle(was_enabled.brush)
      zoom_container.toggle_pan_drag(was_enabled.zoom)
      map.behavior.toggle_selectable_click(was_enabled.selectable_mousedown)
      map.behavior.toggle_label_mouseover(was_enabled.label_mouseover)
      map.behavior.toggle_label_touch(was_enabled.label_touch)
      was_enabled = {}
    })
  }

  /**
   * Define keyboard shortcuts
   */
  _get_keys (map, zoom_container, search_bar, settings_bar,
                      enable_editing, full_screen_button) {
    var keys = {
      save: {
        key: 'ctrl+s',
        target: map,
        fn: map.save
      },
      save_svg: {
        key: 'ctrl+shift+s',
        target: map,
        fn: map.save_svg
      },
      save_png: {
        key: 'ctrl+shift+p',
        target: map,
        fn: map.save_png
      },
      load: {
        key: 'ctrl+o',
        fn: null // defined by button
      },
      convert_map: {
        target: map,
        fn: map.convert_map
      },
      clear_map: {
        target: map,
        fn: map.clear_map
      },
      load_model: {
        key: 'ctrl+m',
        fn: null // defined by button
      },
      clear_model: {
        fn: this.load_model.bind(this, null, true)
      },
      load_reaction_data: { fn: null }, // defined by button
      clear_reaction_data: {
        target: this,
        fn: function () { this.set_reaction_data(null) }
      },
      load_metabolite_data: { fn: null }, // defined by button
      clear_metabolite_data: {
        target: this,
        fn: function () { this.set_metabolite_data(null) }
      },
      load_gene_data: { fn: null }, // defined by button
      clear_gene_data: {
        target: this,
        fn: function () { this.set_gene_data(null, true) }
      },
      zoom_in_ctrl: {
        key: 'ctrl+=',
        target: zoom_container,
        fn: zoom_container.zoom_in
      },
      zoom_in: {
        key: '=',
        target: zoom_container,
        fn: zoom_container.zoom_in,
        ignore_with_input: true
      },
      zoom_out_ctrl: {
        key: 'ctrl+-',
        target: zoom_container,
        fn: zoom_container.zoom_out
      },
      zoom_out: {
        key: '-',
        target: zoom_container,
        fn: zoom_container.zoom_out,
        ignore_with_input: true
      },
      extent_nodes_ctrl: {
        key: 'ctrl+0',
        target: map,
        fn: map.zoom_extent_nodes
      },
      extent_nodes: {
        key: '0',
        target: map,
        fn: map.zoom_extent_nodes,
        ignore_with_input: true
      },
      extent_canvas_ctrl: {
        key: 'ctrl+1',
        target: map,
        fn: map.zoom_extent_canvas
      },
      extent_canvas: {
        key: '1',
        target: map,
        fn: map.zoom_extent_canvas,
        ignore_with_input: true
      },
      search_ctrl: {
        key: 'ctrl+f',
        fn: () => this.renderSearchBar()
      },
      search: {
        key: 'f',
        fn: () => this.renderSearchBar(),
        ignore_with_input: true
      },
      view_mode: {
        target: this,
        fn: this.view_mode,
        ignore_with_input: true
      },
      show_settings_ctrl: {
        key: 'ctrl+,',
        target: settings_bar,
        fn: () => this.pass_settings_menu_props({
          map: this.map,
          settings: this.settings,
          display: true
        })
      },
      show_settings: {
        key: ',',
        target: this,
        fn: () => this.pass_settings_menu_props({
          map: this.map,
          settings: this.settings,
          display: true
        }),
        ignore_with_input: true
      }
    }
    if (full_screen_button) {
      utils.extend(keys, {
        full_screen_ctrl: {
          key: 'ctrl+2',
          target: map,
          fn: map.full_screen
        },
        full_screen: {
          key: '2',
          target: map,
          fn: map.full_screen,
          ignore_with_input: true
        }
      })
    }
    if (enable_editing) {
      utils.extend(keys, {
        build_mode: {
          key: 'n',
          target: this,
          fn: this.build_mode,
          ignore_with_input: true
        },
        zoom_mode: {
          key: 'z',
          target: this,
          fn: this.zoom_mode,
          ignore_with_input: true
        },
        brush_mode: {
          key: 'v',
          target: this,
          fn: this.brush_mode,
          ignore_with_input: true
        },
        rotate_mode: {
          key: 'r',
          target: this,
          fn: this.rotate_mode,
          ignore_with_input: true
        },
        text_mode: {
          key: 't',
          target: this,
          fn: this.text_mode,
          ignore_with_input: true
        },
        toggle_beziers: {
          key: 'b',
          target: map,
          fn: map.toggle_beziers,
          ignore_with_input: true
        },
        delete_ctrl: {
          key: 'ctrl+backspace',
          target: map,
          fn: map.delete_selected,
          ignore_with_input: true
        },
        delete: {
          key: 'backspace',
          target: map,
          fn: map.delete_selected,
          ignore_with_input: true
        },
        delete_del: {
          key: 'del',
          target: map,
          fn: map.delete_selected,
          ignore_with_input: true
        },
        toggle_primary: {
          key: 'p',
          target: map,
          fn: map.toggle_selected_node_primary,
          ignore_with_input: true
        },
        cycle_primary: {
          key: 'c',
          target: map,
          fn: map.cycle_primary_node,
          ignore_with_input: true
        },
        direction_arrow_right: {
          key: 'right',
          target: this.build_input.direction_arrow,
          fn: this.build_input.direction_arrow.right,
          ignore_with_input: true
        },
        direction_arrow_down: {
          key: 'down',
          target: this.build_input.direction_arrow,
          fn: this.build_input.direction_arrow.down,
          ignore_with_input: true
        },
        direction_arrow_left: {
          key: 'left',
          target: this.build_input.direction_arrow,
          fn: this.build_input.direction_arrow.left,
          ignore_with_input: true
        },
        direction_arrow_up: {
          key: 'up',
          target: this.build_input.direction_arrow,
          fn: this.build_input.direction_arrow.up,
          ignore_with_input: true
        },
        undo: {
          key: 'ctrl+z',
          target: map.undo_stack,
          fn: map.undo_stack.undo
        },
        redo: {
          key: 'ctrl+shift+z',
          target: map.undo_stack,
          fn: map.undo_stack.redo
        },
        select_all: {
          key: 'ctrl+a',
          target: map,
          fn: map.select_all
        },
        select_none: {
          key: 'ctrl+shift+a',
          target: map,
          fn: map.select_none
        },
        invert_selection: {
          target: map,
          fn: map.invert_selection
        }
      })
    }
    return keys
  }

  /**
   * Ask if the user wants to exit the page (to avoid unplanned refresh).
   */
  _setup_confirm_before_exit () {
    window.onbeforeunload = function (e) {
      // If we haven't been passed the event get the window.event
      e = e || window.event
      return (this.settings.get('never_ask_before_quit')
        ? null
        : 'You will lose any unsaved changes.'
      )
    }.bind(this)
  }
}

export default utils.class_with_optional_new(Builder)
