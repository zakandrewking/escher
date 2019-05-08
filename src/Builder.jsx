/**
 * For documentation of this class, see docs/javascript_api.rst
 */

/** @jsx h */
import * as utils from './utils'
import BuildInput from './BuildInput'
import ZoomContainer from './ZoomContainer'
import Map from './Map'
import CobraModel from './CobraModel'
import Brush from './Brush'
import CallbackManager from './CallbackManager'
import Settings from './Settings'
import TextEditInput from './TextEditInput'
import * as dataStyles from './dataStyles'
import renderWrapper from './renderWrapper'
import SettingsMenu from './SettingsMenu'
import MenuBar from './MenuBar'
import SearchBar from './SearchBar'
import ButtonPanel from './ButtonPanel'
import TooltipContainer from './TooltipContainer'
import DefaultTooltip from './DefaultTooltip'
import _ from 'underscore'
import {
  select as d3Select,
  selectAll as d3SelectAll,
  selection as d3Selection
} from 'd3-selection'

// Include custom font set for icons
import '../icons/css/fontello.css'

// Include GUI CSS normally with webpack
import './Builder.css'

// Import CSS as a string to embed. This also works from lib because css/src get
// uploaded to NPM.
// eslint-disable-next-line import/no-webpack-loader-syntax
import builderEmbed from '!!raw-loader!./Builder-embed.css'

class Builder {
  constructor (mapData, modelData, embeddedCss, selection, options) {
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

    this.map_data = mapData
    this.model_data = modelData
    this.embeddedCss = embeddedCss
    this.selection = selection
    this.menu_div = null
    this.button_div = null
    this.search_bar_div = null
    this.searchBarRef = null
    this.semanticOptions = null
    this.mode = 'zoom'

    // apply this object as data for the selection
    this.selection.datum(this)
    this.selection.__builder__ = this

    // Remember if the user provided a custom value for reaction_styles
    this.has_custom_reaction_styles = Boolean(options.reaction_styles)

    // set defaults
    const optionsWithDefaults = utils.set_options(options, {

      simplified: false, // testing option for simplified map

      // view options
      menu: 'all',
      scroll_behavior: 'pan',
      use_3d_transform: false,
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
      unique_map_id: null, // deprecated
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
      enable_tooltips: ['label'],
      enable_keys_with_tooltip: true,
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

    // simplified rules
    if (this.settings.get('simplified')) {
      this.settings.set('hide_secondary_metabolites', true)
      this.settings.set('primary_metabolite_radius', 60)
      this.settings.set('hide_all_labels', true)
    }

    // make data settings reactive
    this.settings.streams.reaction_data.onValue(val => {
      this.set_reaction_data(val, false)
    })
    this.settings.streams.metabolite_data.onValue(val => {
      this.set_metabolite_data(val, false)
    })
    this.settings.streams.gene_data.onValue(val => {
      this.set_gene_data(val, false, false)
    })

    // Warn if scales are too short
    ;['reaction_scale', 'metabolite_scale'].map(scaleType => {
      if (this.settings.get(scaleType) && this.settings.get(scaleType).length < 2) {
        console.warn(`Bad value for option "${scaleType}". Scales must have at least 2 points.`)
      }
    })

    // Warn if full/fill screen options conflict
    if (this.settings.get('fill_screen') && this.settings.get('full_screen_button')) {
      this.settings.set('full_screen_button', false)
      console.warn('The option full_screen_button has no effect when fill_screen is true')
    }

    // force full screen for fill_screen option
    this.isFullScreen = false
    if (this.settings.get('fill_screen')) {
      d3Select('html').classed('fill-screen', true)
      d3Select('body').classed('fill-screen', true)
      this.selection.classed('fill-screen-div', true)
      this.isFullScreen = true
    }
    this.savedFullScreenSettings = null
    this.savedFullScreenParent = null
    this.clearFullScreenEscape = null

    // Set up this callback manager
    this.callback_manager = new CallbackManager()
    const firstLoadCallback = this.settings.get('first_load_callback')
    if (firstLoadCallback !== null) {
      this.callback_manager.set('first_load', () => {
        firstLoadCallback(this)
      })
    }

    // Set up the zoom container
    this.zoomContainer = new ZoomContainer(this.selection,
                                            this.settings.get('scroll_behavior'),
                                            this.settings.get('use_3d_transform'))
    // Zoom container status changes
    // this.zoomContainer.callbackManager.set('svg_start', () => {
    //   if (this.map) this.map.set_status('Drawing ...')
    // })
    // this.zoomContainer.callbackManager.set('svg_finish', () => {
    //   if (this.map) this.map.set_status('')
    // })
    this.zoomContainer.callbackManager.set('zoom_change', () => {
      if (this.settings.get('semantic_zoom')) {
        const scale = this.zoomContainer.windowScale
        const optionObject = this.settings.get('semantic_zoom')
                                 .sort((a, b) => a.zoomLevel - b.zoomLevel)
                                 .find(a => a.zoomLevel > scale)
        if (optionObject) {
          let didChange = false
          _.mapObject(optionObject.options, (value, key) => {
            if (this.settings.get(key) !== value) {
              this.settings.set(key, value)
              didChange = true
            }
          })
          if (didChange) this._updateData(false, true)
        }
      }
    })
    this.settings.streams.use_3d_transform.onValue(val => {
      this.zoomContainer.setUse3dTransform(val)
    })
    this.settings.streams.scroll_behavior.onValue(val => {
      this.zoomContainer.setScrollBehavior(val)
    })

    // Make a container for other map-related tools that will be reset on map load
    // TODO only create these once in the Builder constructor
    this.mapToolsContainer = this.selection.append('div')
                                 .attr('class', 'map-tools-container')

    // Status in both modes
    this._createStatus(this.selection)

    // Load the model, map, and update data in both
    this.load_model(this.model_data, false)

    // Append the bars and menu divs to the document
    var s = this.selection
                .append('div').attr('class', 'search-menu-container')
                .append('div').attr('class', 'search-menu-container-inline')
    this.menu_div = s.append('div')
    this.search_bar_div = s.append('div')
    this.button_div = this.selection.append('div')

    // Need to defer map loading to let webpack CSS load properly
    _.defer(() => {
      this.load_map(this.map_data, false)
      const messageFn = this._reactionCheckAddAbs()
      this._updateData(true, true)

      // Setting callbacks. TODO enable atomic updates. Right now, every time the
      // menu closes, everything is drawn.
      this.settings.statusBus.onValue(x => {
        if (x === 'accept') {
          this._updateData(true, true, ['reaction', 'metabolite'], false)
          if (this.zoomContainer !== null) {
            // TODO make this automatic
            const newBehavior = this.settings.get('scroll_behavior')
            this.zoomContainer.setScrollBehavior(newBehavior)
          }
          if (this.map !== null) {
            this.map.draw_all_nodes(false)
            this.map.draw_all_reactions(true, false)
            this.map.select_none()
          }
        }
      })

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
  load_model (modelData, shouldUpdateData = true) { // eslint-disable-line camelcase
    // Check the cobra model
    if (_.isNull(modelData)) {
      this.cobra_model = null
    } else {
      this.cobra_model = CobraModel.from_cobra_json(modelData)
    }

    if (this.map) {
      this.map.cobra_model = this.cobra_model
      if (shouldUpdateData) {
        this._updateData(true, false)
      }
      if (this.settings.get('highlight_missing')) {
        this.map.draw_all_reactions(false, false)
      }
    }

    this.callback_manager.run('load_model', null, modelData, shouldUpdateData)
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst
   */
  load_map (mapData, shouldUpdateData = true) { // eslint-disable-line camelcase
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

    // remove the old map and related divs
    utils.remove_child_nodes(this.zoomContainer.zoomedSel)
    utils.remove_child_nodes(this.mapToolsContainer)

    const zoomedSel = this.zoomContainer.zoomedSel
    const svg = this.zoomContainer.svg

    // remove the old map side effects
    if (this.map) {
      this.map.key_manager.toggle(false)
    }

    if (mapData !== null) {
      // import map
      this.map = Map.from_data(mapData,
                               svg,
                               this.embeddedCss,
                               zoomedSel,
                               this.zoomContainer,
                               this.settings,
                               this.cobra_model,
                               this.settings.get('enable_search'))
    } else {
      // new map
      this.map = new Map(svg,
                         this.embeddedCss,
                         zoomedSel,
                         this.zoomContainer,
                         this.settings,
                         this.cobra_model,
                         this.settings.get('canvas_size_and_loc'),
                         this.settings.get('enable_search'))
    }

    // Connect status bar
    this._setupStatus(this.map)
    this.map.set_status('Loading map ...')
    _.defer(() => {
      // Set the data for the map
      if (shouldUpdateData) {
        this._updateData(false, true)
      }

      // Set up the reaction input with complete.ly
      this.build_input = new BuildInput(this.mapToolsContainer, this.map,
                                        this.zoomContainer, this.settings)

      // Set up the text edit input
      this.text_edit_input = new TextEditInput(this.mapToolsContainer, this.map,
                                               this.zoomContainer)

      // Set up the Brush
      this.brush = new Brush(zoomedSel, false, this.map, '.canvas-group')
      // reset brush when canvas resizes in brush mode
      this.map.canvas.callbackManager.set('resize', () => {
        if (this.mode === 'brush') this.brush.toggle(true)
      })

      // Set up menus
      this.setUpSettingsMenu(this.mapToolsContainer)
      this.setUpButtonPanel(this.mapToolsContainer)

      // share a parent container for menu bar and search bar
      const sel = this.mapToolsContainer
                      .append('div').attr('class', 'search-menu-container')
                      .append('div').attr('class', 'search-menu-container-inline')
      this.setUpMenuBar(sel)
      this.setUpSearchBar(sel)

      // Set up the tooltip container
      this.tooltip_container = new TooltipContainer(
        this.mapToolsContainer,
        this.settings.get('tooltip_component'),
        this.zoomContainer,
        this.map,
        this.settings
      )

      // Set up key manager
      this.map.key_manager.assignedKeys = this.getKeys()
      // Tell the key manager about the reaction input and search bar
      this.map.key_manager.inputList = [
        this.build_input,
        this.searchBarRef,
        () => this.settingsMenuRef,
        this.text_edit_input
      ]
      if (!this.settings.get('enable_keys_with_tooltip')) {
        this.map.key_manager.inputList.push(this.tooltip_container)
      }
      // Make sure the key manager remembers all those changes
      this.map.key_manager.update()
      // Turn it on/off
      this.map.key_manager.toggle(this.settings.get('enable_keys'))
      this.settings.streams.enable_keys.onValue(val => {
        // get keys given latest settings
        this.map.key_manager.toggle(val)
      })

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
      if (!this.settings.get('enable_search')) {
        newDisabledButtons.push('Find')
      }
      if (!this.settings.get('enable_editing')) {
        newDisabledButtons.push('Show control points')
      }
      this.settings.set('disabled_buttons', newDisabledButtons)

      // Set up selection box
      if (this.settings.get('zoom_to_element')) {
        const type = this.settings.get('zoom_to_element').type
        const elementId = this.settings.get('zoom_to_element').id
        if (_.isUndefined(type) || [ 'reaction', 'node' ].indexOf(type) === -1) {
          throw new Error('zoom_to_element type must be "reaction" or "node"')
        }
        if (_.isUndefined(elementId)) {
          throw new Error('zoom_to_element must include id')
        }
        if (type === 'reaction') {
          this.map.zoom_to_reaction(elementId)
        } else if (type === 'node') {
          this.map.zoom_to_node(elementId)
        }
      } else if (mapData !== null) {
        this.map.zoom_extent_canvas()
      } else {
        if (this.settings.get('starting_reaction') && this.cobra_model !== null) {
          // Draw default reaction if no map is provided
          const size = this.zoomContainer.getSize()
          const startCoords = { x: size.width / 2, y: size.height / 4 }
          this.map.new_reaction_from_scratch(this.settings.get('starting_reaction'),
                                             startCoords, 90)
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
      // when enabled_editing changes, go to view mode
      this.settings.streams.enable_editing.onValue(val => {
        if (val) this.zoom_mode()
        else this.view_mode()
      })

      // confirm before leaving the page
      if (this.settings.get('enable_editing')) {
        this._setupConfirmBeforeExit()
      }

      // draw
      this.map.draw_everything()

      this.map.set_status('')

      this.callback_manager.run('load_map', null, mapData, shouldUpdateData)
    })
  }

  /**
   * Function to pass props for the settings menu. Run without an argument to
   * rerender the component
   * @param {Object} props - Props that the settings menu will use
   */
  passPropsSettingsMenu (props = {}) {
    this.map.callback_manager.run('pass_props_settings_menu', null, props)
  }

  /**
   * Initialize the settings menu
   */
  setUpSettingsMenu (sel) {
    this.settingsMenuRef = null
    renderWrapper(
      SettingsMenu,
      instance => { this.settingsMenuRef = instance },
      passProps => this.map.callback_manager.set('pass_props_settings_menu', passProps),
      sel.append('div').node()
    )
    this.passPropsSettingsMenu({
      display: false,
      settings: this.settings,
      map: this.map
    })

    // redraw menu when settings change
    _.mapObject(this.settings.streams, (stream, key) => {
      stream.onValue(value => {
        this.passPropsSettingsMenu()
      })
    })

    // recalculate data when switching to/from absolute value
    this.settings.streams.reaction_styles
        .map(x => _.contains(x, 'abs'))
        .skipDuplicates()
        .onValue(() => this._updateData(false, true))
    this.settings.streams.metabolite_styles
        .map(x => _.contains(x, 'abs'))
        .skipDuplicates()
        .onValue(() => this._updateData(false, true))
  }

  /**
   * Function to pass props for the menu bar
   * @param {Object} props - Props that the menu bar will use
   */
  passPropsMenuBar (props = {}) {
    this.map.callback_manager.run('pass_props_menu_bar', null, props)
  }

  /**
   * Initialize the menu bar
   * @param {D3 Selection} sel - The d3 selection to render in.
   */
  setUpMenuBar (sel) {
    this.menuBarRef = null
    renderWrapper(
      MenuBar,
      instance => { this.menuBarRef = instance },
      passProps => this.map.callback_manager.set('pass_props_menu_bar', passProps),
      sel.append('div').node()
    )
    this.passPropsMenuBar({
      display: this.settings.get('menu') === 'all',
      settings: this.settings,
      sel: this.selection,
      mode: this.mode,
      map: this.map,
      saveMap: () => {
        // Revert options changed by semanticZoom to their original values if option is active
        if (this.semanticOptions) {
          Object.entries(this.semanticOptions).map(([key, value]) => {
            this.settings.set(key, value)
          })
          this._updateData()
        }
        this.map.save()
      },
      loadMap: (file) => this.load_map(file),
      saveSvg: () => this.map.saveSvg(),
      savePng: () => this.map.savePng(),
      clearMap: () => { this.clearMap() },
      loadModel: file => this.load_model(file, true),
      clearModel: () => {
        this.load_model(null)
        this.callback_manager.run('clear_model')
      },
      updateRules: () => this.map.convert_map(),
      setReactionData: d => this.set_reaction_data(d),
      setGeneData: d => this.set_gene_data(d),
      setMetaboliteData: d => this.set_metabolite_data(d),
      setMode: mode => this._setMode(mode),
      deleteSelected: () => this.map.delete_selected(),
      undo: () => this.map.undo_stack.undo(),
      redo: () => this.map.undo_stack.redo(),
      alignVertical: () => this.map.alignVertical(),
      alignHorizontal: () => this.map.alignHorizontal(),
      togglePrimary: () => this.map.toggle_selected_node_primary(),
      cyclePrimary: () => this.map.cycle_primary_node(),
      selectAll: () => this.map.select_all(),
      selectNone: () => this.map.select_none(),
      invertSelection: () => this.map.invert_selection(),
      zoomIn: () => this.zoomContainer.zoomIn(),
      zoomOut: () => this.zoomContainer.zoomOut(),
      zoomExtentNodes: () => this.map.zoom_extent_nodes(),
      zoomExtentCanvas: () => this.map.zoom_extent_canvas(),
      fullScreen: () => this.fullScreen(),
      search: () => this.passPropsSearchBar({ display: true }),
      toggleBeziers: () => this.map.toggle_beziers(),
      renderSettingsMenu: () => this.passPropsSettingsMenu({ display: true })
    })

    // redraw when beziers change
    this.map.callback_manager.set('toggle_beziers', () => {
      this.passPropsMenuBar()
    })

    // redraw when disabledButtons change
    this.settings.streams.disabled_buttons.onValue(value => {
      this.passPropsMenuBar()
    })

    // redraw when mode changes
    this.callback_manager.set('set_mode', mode => {
      this.passPropsMenuBar({ mode })
    })

    // redraw when menu option changes
    this.settings.streams.menu.onValue(menu => {
      this.passPropsMenuBar({ display: menu === 'all' })
    })

    // redraw when full screen button changes
    this.settings.streams.full_screen_button.onValue(value => {
      this.passPropsMenuBar()
    })
  }

  /**
   * Function to pass props for the search bar
   * @param {Object} props - Props that the search bar will use
   */
  passPropsSearchBar (props = {}) {
    this.map.callback_manager.run('pass_props_search_bar', null, props)
  }

  /**
   * Initialize the search bar
   * @param {D3 Selection} sel - The d3 selection to render in.
   */
  setUpSearchBar (sel) {
    this.searchBarRef = null
    renderWrapper(
      SearchBar,
      instance => { this.searchBarRef = instance },
      passProps => this.map.callback_manager.set('pass_props_search_bar', passProps),
      sel.append('div').node()
    )
    this.passPropsSearchBar({
      display: false,
      searchIndex: this.map.search_index,
      map: this.map
    })
  }

  /**
   * Function to pass props for the button panel
   * @param {Object} props - Props that the tooltip will use
   */
  passPropsButtonPanel (props = {}) {
    this.map.callback_manager.run('pass_props_button_panel', null, props)
  }

  /**
   * Initialize the button panel
   */
  setUpButtonPanel (sel) {
    renderWrapper(
      ButtonPanel,
      null,
      passProps => this.map.callback_manager.set('pass_props_button_panel', passProps),
      sel.append('div').node()
    )
    this.passPropsButtonPanel({
      display: _.contains(['all', 'zoom'], this.settings.get('menu')),
      mode: this.mode,
      settings: this.settings,
      setMode: mode => this._setMode(mode),
      zoomContainer: this.zoomContainer,
      map: this.map,
      buildInput: this.build_input,
      fullScreen: () => this.fullScreen()
    })

    // redraw when mode changes
    this.callback_manager.set('set_mode', mode => {
      this.passPropsButtonPanel({ mode })
    })

    // redraw when full screen button changes
    this.settings.streams.full_screen_button.onValue(value => {
      this.passPropsButtonPanel()
    })

    // redraw when menu option changes
    this.settings.streams.menu.onValue(menu => {
      this.passPropsButtonPanel({
        display: ['all', 'zoom'].includes(this.settings.get('menu'))
      })
    })
  }

  /**
   * Set the mode
   */
  _setMode (mode) {
    this.mode = mode

    // input
    this.build_input.toggle(mode === 'build')
    this.build_input.direction_arrow.toggle(mode === 'build')
    // brush
    this.brush.toggle(mode === 'brush')
    // zoom
    this.zoomContainer.togglePanDrag(mode === 'zoom' || mode === 'view')
    // resize canvas
    this.map.canvas.toggleResize(mode !== 'view')

    // Behavior. Be careful of the order becuase rotation and
    // toggle_selectable_drag both use Behavior.selectableDrag.
    if (mode === 'rotate') {
      this.map.behavior.toggleSelectableDrag(false) // before toggle_rotation_mode
      this.map.behavior.toggleRotationMode(true) // XX
    } else {
      this.map.behavior.toggleRotationMode(mode === 'rotate') // before toggleSelectableDrag
      this.map.behavior.toggleSelectableDrag(mode === 'brush') // XX
    }
    this.map.behavior.toggleSelectableClick(mode === 'build' || mode === 'brush') // XX
    this.map.behavior.toggleLabelDrag(mode === 'brush') // XX
    // this.map.behavior.toggleLabelMouseover(true)
    // this.map.behavior.toggleLabelTouch(true)
    this.map.behavior.toggleTextLabelEdit(mode === 'text') // XX
    this.map.behavior.toggleBezierDrag(mode === 'brush') // XX

    // edit selections
    if (mode === 'view' || mode === 'text') {
      this.map.select_none()
    }
    if (mode === 'rotate') {
      this.map.deselect_text_labels()
    }

    this.map.draw_everything()
    // what's not allowing me to delete this? XX above

    // callback
    this.callback_manager.run('set_mode', null, mode)
  }

  /** For documentation of this function, see docs/javascript_api.rst. */
  view_mode () { // eslint-disable-line camelcase
    this.callback_manager.run('view_mode')
    this._setMode('view')
  }

  /** For documentation of this function, see docs/javascript_api.rst. */
  build_mode () { // eslint-disable-line camelcase
    this.callback_manager.run('build_mode')
    this._setMode('build')
  }

  /** For documentation of this function, see docs/javascript_api.rst. */
  brush_mode () { // eslint-disable-line camelcase
    this.callback_manager.run('brush_mode')
    this._setMode('brush')
  }

  /** For documentation of this function, see docs/javascript_api.rst. */
  zoom_mode () { // eslint-disable-line camelcase
    this.callback_manager.run('zoom_mode')
    this._setMode('zoom')
  }

  /** For documentation of this function, see docs/javascript_api.rst. */
  rotate_mode () { // eslint-disable-line camelcase
    this.callback_manager.run('rotate_mode')
    this._setMode('rotate')
  }

  /** For documentation of this function, see docs/javascript_api.rst. */
  text_mode () { // eslint-disable-line camelcase
    this.callback_manager.run('text_mode')
    this._setMode('text')
  }

  none_mode () { // eslint-disable-line camelcase
    this._setMode('none')
  }

  _reactionCheckAddAbs () {
    const currStyle = this.settings.get('reaction_styles')
    if (
      this.settings.get('reaction_data') &&
      !this.has_custom_reaction_styles &&
      !_.contains(currStyle, 'abs')
    ) {
      this.settings.set('reaction_styles', currStyle.concat('abs'))
      return () => {
        this.map.set_status('Visualizing absolute value of reaction data. ' +
                            'Change this option in Settings.', 5000)
      }
    }
    return null
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_reaction_data (data, setInSettings = true) { // eslint-disable-line camelcase
    // If the change came from the setting stream already, then don't update the
    // stream again
    if (setInSettings) {
      this.settings.set('reaction_data', data)
    }

    // clear gene data
    if (data) {
      this.settings._options.gene_data = null
    }

    var messageFn = this._reactionCheckAddAbs()

    this._updateData(true, true, ['reaction'])

    if (messageFn) messageFn()
    else this.map.set_status('')

    const disabledButtons = this.settings.get('disabled_buttons') || []
    const buttonName = 'Clear reaction data'
    const geneButtonName = 'Clear gene data'
    const index = disabledButtons.indexOf(buttonName)
    if (data && index !== -1) {
      disabledButtons.splice(index, 1)
      const gInd = disabledButtons.indexOf(geneButtonName)
      if (gInd === -1) disabledButtons.push(geneButtonName)
      this.settings.set('disabled_buttons', disabledButtons)
    } else if (!data && index === -1) {
      disabledButtons.push(buttonName)
      this.settings.set('disabled_buttons', disabledButtons)
    }
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_gene_data (data, clearGeneReactionRules, setInSettings = true) { // eslint-disable-line camelcase
    if (clearGeneReactionRules) {
      // default undefined
      this.settings.set('show_gene_reaction_rules', false)
    }

    // If the change came from the setting stream already, then don't update the
    // stream again
    if (setInSettings) {
      this.settings.set('gene_data', data)
    }

    // clear reaction data
    if (data) {
      this.settings._options.reaction_data = null
    }

    this._updateData(true, true, ['reaction'])
    this.map.set_status('')

    const disabledButtons = this.settings.get('disabled_buttons') || []
    const index = disabledButtons.indexOf('Clear gene data')
    const buttonName = 'Clear gene data'
    const reactionButtonName = 'Clear reaction data'
    if (index > -1 && data) {
      disabledButtons.splice(index, 1)
      const rInd = disabledButtons.indexOf('Clear reaction data')
      if (rInd === -1) disabledButtons.push(reactionButtonName)
      this.settings.set('disabled_buttons', disabledButtons)
    } else if (index === -1 && !data) {
      disabledButtons.push(buttonName)
      this.settings.set('disabled_buttons', disabledButtons)
    }
  }

  /**
   * For documentation of this function, see docs/javascript_api.rst.
   */
  set_metabolite_data (data, setInSettings = true) { // eslint-disable-line camelcase
    // If the change came from the setting stream already, then don't update the
    // stream again
    if (setInSettings) {
      this.settings.set('metabolite_data', data)
    }

    this._updateData(true, true, ['metabolite'])
    this.map.set_status('')

    const disabledButtons = this.settings.get('disabled_buttons') || []
    const buttonName = 'Clear metabolite data'
    const index = disabledButtons.indexOf(buttonName)
    if (index > -1 && data) {
      disabledButtons.splice(index, 1)
      this.settings.set('disabled_buttons', disabledButtons)
    } else if (index === -1 && !data) {
      disabledButtons.push(buttonName)
      this.settings.set('disabled_buttons', disabledButtons)
    }
  }

  _makeGeneDataObject (geneData, cobraModel, map) {
    const allReactions = {}
    if (cobraModel !== null) {
      utils.extend(allReactions, cobraModel.reactions)
    }
    // extend, overwrite
    if (map !== null) {
      utils.extend(allReactions, map.reactions, true)
    }

    // this object has reaction keys and values containing associated genes
    return dataStyles.importAndCheck(geneData, 'gene_data', allReactions)
  }

  /**
   * Clear the map
   */
  clearMap () {
    this.callback_manager.run('clear_map')
    this.map.clearMapData()
    this._updateData(true, true, ['reaction', 'metabolite'], false)
    this.map.draw_everything()
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
    updateModel = false,
    updateMap = false,
    kind = ['reaction', 'metabolite'],
    shouldDraw = true
  ) {
    const updateReactionData = _.contains(kind, 'reaction')
    const updateMetaboliteData = _.contains(kind, 'metabolite')
    let metaboliteDataObject
    let reactionDataObject
    let geneDataObject

    // -------------------
    // First map, and draw
    // -------------------

    // metabolite data
    if (updateMetaboliteData && updateMap && this.map !== null) {
      metaboliteDataObject = dataStyles.importAndCheck(this.settings.get('metabolite_data'),
                                                       'metabolite_data')
      this.map.apply_metabolite_data_to_map(metaboliteDataObject)
      if (shouldDraw) {
        this.map.draw_all_nodes(false)
      }
    }

    // reaction data
    if (updateReactionData) {
      if (this.settings.get('reaction_data') && updateMap && this.map !== null) {
        reactionDataObject = dataStyles.importAndCheck(this.settings.get('reaction_data'),
                                                       'reaction_data')
        this.map.apply_reaction_data_to_map(reactionDataObject)
        if (shouldDraw) {
          this.map.draw_all_reactions(false, false)
        }
      } else if (this.settings.get('gene_data') && updateMap && this.map !== null) {
        geneDataObject = this._makeGeneDataObject(this.settings.get('gene_data'),
                                                  this.cobra_model, this.map)
        this.map.apply_gene_data_to_map(geneDataObject)
        if (shouldDraw) {
          this.map.draw_all_reactions(false, false)
        }
      } else if (updateMap && this.map !== null) {
        // clear the data
        this.map.apply_reaction_data_to_map(null)
        if (shouldDraw) {
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
    this.update_model_timer = setTimeout(() => {
      // metabolite_data
      if (updateMetaboliteData && updateModel && this.cobra_model !== null) {
        // if we haven't already made this
        if (!metaboliteDataObject) {
          metaboliteDataObject = dataStyles.importAndCheck(this.settings.get('metabolite_data'),
                                                           'metabolite_data')
        }
        this.cobra_model.apply_metabolite_data(metaboliteDataObject,
                                               this.settings.get('metabolite_styles'),
                                               this.settings.get('metabolite_compare_style'))
      }

      // reaction data
      if (updateReactionData) {
        if (this.settings.get('reaction_data') && updateModel && this.cobra_model !== null) {
          // if we haven't already made this
          if (!reactionDataObject) {
            reactionDataObject = dataStyles.importAndCheck(this.settings.get('reaction_data'),
                                                           'reaction_data')
          }
          this.cobra_model.apply_reaction_data(reactionDataObject,
                                               this.settings.get('reaction_styles'),
                                               this.settings.get('reaction_compare_style'))
        } else if (this.settings.get('gene_data') && updateModel && this.cobra_model !== null) {
          if (!geneDataObject) {
            geneDataObject = this._makeGeneDataObject(this.settings.get('gene_data'),
                                                      this.cobra_model, this.map)
          }
          this.cobra_model.apply_gene_data(geneDataObject,
                                           this.settings.get('reaction_styles'),
                                           this.settings.get('identifiers_on_map'),
                                           this.settings.get('reaction_compare_style'),
                                           this.settings.get('and_method_in_gene_reaction_rule'))
        } else if (updateModel && this.cobra_model !== null) {
          // clear the data
          this.cobra_model.apply_reaction_data(null,
                                               this.settings.get('reaction_styles'),
                                               this.settings.get('reaction_compare_style'))
        }
      }

      // callback
      this.callback_manager.run('update_data', null, updateModel, updateMap,
                                kind, shouldDraw)
    }, delay)
  }

  _createStatus (selection) {
    this.status_bar = selection.append('div').attr('id', 'status')
  }

  _setupStatus (map) {
    map.callback_manager.set('set_status', status => this.status_bar.html(status))
  }

  /**
   * Define keyboard shortcuts
   */
  getKeys () {
    const map = this.map
    const zoomContainer = this.zoomContainer
    return {
      save: {
        key: 'ctrl+s',
        target: map,
        fn: map.save
      },
      saveSvg: {
        key: 'ctrl+shift+s',
        target: map,
        fn: map.saveSvg
      },
      savePng: {
        key: 'ctrl+shift+p',
        target: map,
        fn: map.savePng
      },
      load: {
        key: 'ctrl+o',
        fn: null // defined by button
      },
      convert_map: {
        target: map,
        fn: map.convert_map
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
        fn: () => this.set_reaction_data(null)
      },
      load_metabolite_data: { fn: null }, // defined by button
      clear_metabolite_data: {
        fn: () => this.set_metabolite_data(null)
      },
      load_gene_data: { fn: null }, // defined by button
      clear_gene_data: {
        fn: () => this.set_gene_data(null, true)
      },
      zoom_in_ctrl: {
        key: 'ctrl+=',
        target: zoomContainer,
        fn: zoomContainer.zoomIn
      },
      zoom_in: {
        key: '=',
        target: zoomContainer,
        fn: zoomContainer.zoomIn,
        ignoreWithInput: true
      },
      zoom_out_ctrl: {
        key: 'ctrl+-',
        target: zoomContainer,
        fn: zoomContainer.zoomOut
      },
      zoom_out: {
        key: '-',
        target: zoomContainer,
        fn: zoomContainer.zoomOut,
        ignoreWithInput: true
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
        ignoreWithInput: true
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
        ignoreWithInput: true
      },
      view_mode: {
        target: this,
        fn: this.view_mode,
        ignoreWithInput: true
      },
      show_settings_ctrl: {
        key: 'ctrl+,',
        fn: () => this.passPropsSettingsMenu({ display: true })
      },
      show_settings: {
        key: ',',
        fn: () => this.passPropsSettingsMenu({ display: true }),
        ignoreWithInput: true
      },
      build_mode: {
        key: 'n',
        target: this,
        fn: this.build_mode,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      zoom_mode: {
        key: 'z',
        target: this,
        fn: this.zoom_mode,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      brush_mode: {
        key: 'v',
        target: this,
        fn: this.brush_mode,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      rotate_mode: {
        key: 'r',
        target: this,
        fn: this.rotate_mode,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      text_mode: {
        key: 't',
        target: this,
        fn: this.text_mode,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      toggle_beziers: {
        key: 'b',
        target: map,
        fn: map.toggle_beziers,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      delete_ctrl: {
        key: 'ctrl+backspace',
        target: map,
        fn: map.delete_selected,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      delete: {
        key: 'backspace',
        target: map,
        fn: map.delete_selected,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      delete_del: {
        key: 'del',
        target: map,
        fn: map.delete_selected,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      alignVertical: {
        key: 'alt+l',
        target: map,
        fn: map.alignVertical
      },
      alignHorizontal: {
        key: 'shift+alt+l',
        target: map,
        fn: map.alignHorizontal
      },
      toggle_primary: {
        key: 'p',
        target: map,
        fn: map.toggle_selected_node_primary,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      cycle_primary: {
        key: 'c',
        target: map,
        fn: map.cycle_primary_node,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      direction_arrow_right: {
        key: 'right',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.right,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      direction_arrow_down: {
        key: 'down',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.down,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      direction_arrow_left: {
        key: 'left',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.left,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      direction_arrow_up: {
        key: 'up',
        target: this.build_input.direction_arrow,
        fn: this.build_input.direction_arrow.up,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      undo: {
        key: 'ctrl+z',
        target: map.undo_stack,
        fn: map.undo_stack.undo,
        requires: 'enable_editing'
      },
      redo: {
        key: 'ctrl+shift+z',
        target: map.undo_stack,
        fn: map.undo_stack.redo,
        requires: 'enable_editing'
      },
      select_all: {
        key: 'ctrl+a',
        target: map,
        fn: map.select_all,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      select_none: {
        key: 'ctrl+shift+a',
        target: map,
        fn: map.select_none,
        ignoreWithInput: true,
        requires: 'enable_editing'
      },
      invert_selection: {
        target: map,
        fn: map.invert_selection,
        requires: 'enable_editing'
      },
      search_ctrl: {
        key: 'ctrl+f',
        fn: () => this.passPropsSearchBar({ display: true }),
        requires: 'enable_search'
      },
      search: {
        key: 'f',
        fn: () => this.passPropsSearchBar({ display: true }),
        ignoreWithInput: true,
        requires: 'enable_search'
      }
    }
  }

  /**
   * Ask if the user wants to exit the page (to avoid unplanned refresh).
   */
  _setupConfirmBeforeExit () {
    window.onbeforeunload = _ => this.settings.get('never_ask_before_quit')
                               ? null
                               : 'You will lose any unsaved changes.'
  }

  /**
   * Toggle full screen mode.
   */
  fullScreen () {
    // these settings can update in full screen if provided
    const fullScreenSettings = [
      'menu',
      'scroll_behavior',
      'enable_editing',
      'enable_keys',
      'enable_tooltips',
      'simplified'
    ]

    if (this.isFullScreen) {
      d3Select('html').classed('fill-screen', false)
      d3Select('body').classed('fill-screen', false)
      this.selection.classed('fill-screen-div', false)
      this.isFullScreen = false

      // clear escape listener
      if (this.clearFullScreenEscape) {
        this.clearFullScreenEscape()
        this.clearFullScreenEscape = null
      }

      // hack for full screen in jupyterlab / notebook
      if (this.savedFullScreenParent) {
        const parentNode = this.savedFullScreenParent.node()
        parentNode.insertBefore(this.selection.remove().node(), parentNode.firstChild)
        this.savedFullScreenParent = null
      }

      // apply the saved settings
      if (this.savedFullScreenSettings !== null) {
        _.mapObject(this.savedFullScreenSettings, (v, k) => {
          this.settings.set(k, v)
        })
      }
      this.savedFullScreenSettings = null
    } else {
      // save current settings
      const fullScreenButton = this.settings.get('full_screen_button')
      if (_.isObject(fullScreenButton)) {
        this.savedFullScreenSettings = (
          _.chain(fullScreenButton)
           .pairs()
           .map(([k, v]) => {
             if (_.contains(fullScreenSettings, k)) {
               const currentSetting = this.settings.get(k)
               this.settings.set(k, v)
               return [k, currentSetting]
             } else {
               console.warn(`${k} not recognized as an option for full_screen_button`)
               return [null, null]
             }
           })
           .filter(([k, v]) => k)
           .object()
           .value()
        )
      }

      d3Select('html').classed('fill-screen', true)
      d3Select('body').classed('fill-screen', true)
      this.selection.classed('fill-screen-div', true)
      this.isFullScreen = true

      // hack for full screen in jupyterlab
      this.savedFullScreenParent = d3Select(this.selection.node().parentNode)
      const bodyNode = d3Select('body').node()
      bodyNode.insertBefore(this.selection.remove().node(), bodyNode.firstChild)

      // set escape listener
      this.clearFullScreenEscape = this.map.key_manager.addEscapeListener(
        () => this.fullScreen()
      )
    }
    this.map.zoom_extent_canvas()
    this.passPropsButtonPanel({ isFullScreen: this.isFullScreen })
    this.passPropsMenuBar({ isFullScreen: this.isFullScreen })
    this.callback_manager.run('full_screen', null, this.isFullScreen)
  }
}

export default utils.class_with_optional_new(Builder)
