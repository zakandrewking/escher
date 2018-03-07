/* eslint-disable camelcase */

/** TimeSeriesBar
 * @author Christoph Blessing */

/** @jsx h */
import { h, Component } from 'preact'
import './TimeSeriesBar.css'
import { select as d3_select } from 'd3-selection'

class TimeSeriesBar extends Component {

  constructor (props) {
    super(props)

    this.state = {
      visible: props.visible,
      builder: props.builder,
      map: props.map,
      playing: false,
      sliding_window: false,
      duration: 2000
    }

  }

  close () { // TODO: get this right with props / state
    this.setState({visible: false})
    this.state.visible = false;
    this.props.visible = false;
  }

  is_visible () {
    return this.state.visible
  }

  /**
   *  Updates the GUI
   *  if a data set is loaded
   *   set to specific data set
   *   set slider to max of data set length
   *   set dropdown menu length
   *  else
   *   reset everything
   */

  update (builder) {

    let currentDataSet = this.get_current_data_set(builder)

    if (currentDataSet !== null) {
      // update display
      let current = 0

      // update slider
      d3_select('#sliderReference')
        .attr('max', (currentDataSet.length - 1))
        .attr('value', 0)

      d3_select('#sliderTarget')
        .attr('max', (currentDataSet.length - 1))
        .attr('value', 0)

      document.getElementById('dropDownMenuReference').options.length = 0
      document.getElementById('dropDownMenuTarget').options.length = 0

      for (var x in currentDataSet) {

        var name_of_current_data_set = x

        if (builder.type_of_data === 'reaction') {
          name_of_current_data_set = builder.reaction_data_names[x]

        } else if (builder.type_of_data === 'metabolite') {
          name_of_current_data_set = builder.metabolite_data_names[x]

        } else if (builder.type_of_data === 'gene') {
          name_of_current_data_set = builder.gene_data_names[x]
        }

        d3_select('#dropDownMenuReference').append('option')
          .attr('value', x).text('Reference Data Set: ' + name_of_current_data_set)
        d3_select('#dropDownMenuTarget').append('option')
          .attr('value', x).text('Target Data Set: ' + name_of_current_data_set)

      }

    } else { // reset everything

      // reset stats
      builder.map.interpolation = false
      this.state.duration = 2000

      // update display
      this.current = 0

      // update slider
      d3_select('#sliderReference')
        .attr('max', 0)
        .attr('value', 0)

      d3_select('#sliderTarget')
        .attr('max', 0)
        .attr('value', 0)

      d3_select('#checkBoxChart').property('checked', false)
      d3_select('#checkBoxInterpolation').property('checked', false)

      // reset dropdown menu
      document.getElementById('dropDownMenuReference').options.length = 0
      document.getElementById('dropDownMenuTarget').options.length = 0
    }
  }

  openTab (builder) {

    var tabs = document.getElementsByClassName('tab')

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = 'none'
    }

    if (builder.type_of_data === 'reaction' || builder.type_of_data === 'gene') {
      d3_select('#reaction_tab_button').property('className', 'timeSeriesButton activated')
      d3_select('#metabolite_tab_button').property('className', 'timeSeriesButton deactivated')
      this.update(builder)
    } else if (builder.type_of_data === 'metabolite') {
      d3_select('#reaction_tab_button').property('className', 'timeSeriesButton deactivated')
      d3_select('#metabolite_tab_button').property('className', 'timeSeriesButton activated')
      this.update(builder)
    }

  }

  deactivateUserInterface(disabled){

    if (disabled === true) {

      d3_select('#reaction_tab_button').attr('disabled', 'true')
      d3_select('#metabolite_tab_button').attr('disabled', 'true')
      d3_select('#timeSeriesButton').attr('disabled', 'true')
      d3_select('#differenceModeButton').attr('disabled', 'true')
      d3_select('#sliderReference').attr('disabled', 'true')
      d3_select('#dropDownMenuReference').attr('disabled', 'true')
      d3_select('#sliderTarget').attr('disabled', 'true')
      d3_select('#dropDownMenuTarget').attr('disabled', 'true')

    } else {

      d3_select('#reaction_tab_button').attr('disabled', null)
      d3_select('#metabolite_tab_button').attr('disabled', null)
      d3_select('#timeSeriesButton').attr('disabled', null)
      d3_select('#differenceModeButton').attr('disabled', null)
      d3_select('#sliderReference').attr('disabled', null)
      d3_select('#dropDownMenuReference').attr('disabled', null)
      d3_select('#sliderTarget').attr('disabled', null)
      d3_select('#dropDownMenuTarget').attr('disabled', null)

    }

  }

  play_time_series (builder, map, duration, sliding_window) {

    map = builder.map


    if (!this.state.playing) {
      this.deactivateUserInterface(true)
      this.state.playing = true

      let sliding_window_start = parseInt(builder.builder.reference)
      let sliding_window_end = parseInt(builder.builder.target)

      // array of time points for non-linear time scale
      let array_of_time_points = this.get_array_of_time_points(builder, map)

      let tick = array_of_time_points[sliding_window_start]
      let time_point = sliding_window_start

      // difference mode
      let start = parseInt(builder.builder.reference)
      let end = parseInt(this.get_current_data_set(builder.builder).length - 1)

      if (builder.difference_mode && !sliding_window) {
        builder.builder.target = parseInt(builder.builder.reference)
      }

      // sliding window mode
      let sliding_window_size = 1

      let duration = duration / (end - start)

      map.transition_duration = this.state.duration

      /*

       */
      function play (builder, sliding_window) {

        if (sliding_window) {

          if (tick === array_of_time_points[time_point]) {

            if (parseInt(builder.builder.target) < parseInt(end)) {

              builder.builder.reference = parseInt(builder.builder.reference) + 1
              builder.builder.target = parseInt(builder.builder.reference) + sliding_window_size

              d3_select('#sliderReference').property('value', builder.builder.reference)
              d3_select('#dropDownMenuReference').property('selectedIndex', builder.builder.reference)
              d3_select('#sliderTarget').property('value', builder.builder.target)
              d3_select('#dropDownMenuTarget').property('selectedIndex', builder.builder.target)

              time_point++
              tick++

            } else { // play as loop
              builder.builder.reference = sliding_window_start
              builder.builder.target = sliding_window_start + sliding_window_size

              time_point = start
              tick = array_of_time_points[start]

              d3_select('#sliderReference').property('value', builder.builder.reference)
              d3_select('#dropDownMenuReference').property('selectedIndex', builder.builder.reference)
              d3_select('#sliderTarget').property('value', builder.builder.target)
              d3_select('#dropDownMenuTarget').property('selectedIndex', builder.builder.target)
            }

            builder.builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

          } else {

            if (tick >= array_of_time_points[end]) {
              tick = array_of_time_points[start]

              d3_select('#sliderReference').property('value', start)
              d3_select('#dropDownMenuReference').property('selectedIndex', start)
              d3_select('#sliderTarget').property('value', start + sliding_window_size)
              d3_select('#dropDownMenuTarget').property('selectedIndex', start + sliding_window_size)

              builder.builder.reference = sliding_window_start
              builder.builder.target = sliding_window_start + sliding_window_size

            } else {
              tick++

              d3_select('#sliderReference').property('value', start)
              d3_select('#dropDownMenuReference').property('selectedIndex', start)
              d3_select('#sliderTarget').property('value', start + sliding_window_size)
              d3_select('#dropDownMenuTarget').property('selectedIndex', start + sliding_window_size)

            }
          }

        } else if (builder.builder.difference_mode) {

          if (tick === array_of_time_points[time_point]) {

            // reference is static, next goes from reference + 1 to end
            builder.builder.set_data_indices(builder.builder.type_of_data, builder.builder.reference, builder.builder.target)

            let next = builder.builder.target

            d3_select('#sliderTarget').property('value', next)
            d3_select('#dropDownMenuTarget').property('selectedIndex', next)

            if (parseInt(builder.builder.target) < end) {
              next++
              builder.builder.target = next

              time_point++
              tick++

            } else { // play as loop
              builder.builder.target = start

              time_point = start
              tick = array_of_time_points[start]
            }

          } else {

            if (tick >= array_of_time_points[end]) {
              tick = array_of_time_points[start]
              d3_select('#sliderTarget').property('value', start)
              d3_select('#dropDownMenuTarget').property('selectedIndex', start)

            } else {
              tick++
              d3_select('#sliderTarget').property('value', builder.builder.target)
              d3_select('#dropDownMenuTarget').property('selectedIndex', builder.builder.target)

            }
          }
        } else {
          // TODO: handle interpolated data with non-linear time scale: set duration to next tick
          if (tick === array_of_time_points[time_point]) {

            builder.builder.set_data_indices(builder.builder.type_of_data, builder.builder.reference, sliding_window_end)

            if (parseInt(builder.builder.reference) < end) {
              let next = builder.builder.reference
              next++
              builder.builder.reference = next

              time_point++
              tick++

            } else { // play as loop
              builder.builder.reference = sliding_window_start

              time_point = sliding_window_start
              tick = array_of_time_points[sliding_window_start]
            }
            animate_slider()

            builder.builder.set_data_indices(builder.builder.type_of_data, builder.builder.reference, builder.builder.target)

          } else {

            if (tick >= array_of_time_points[end]) {
              tick = array_of_time_points[sliding_window_start]
              animate_slider(0)

            } else {
              tick++

            }
          }

        }
      }

      // animation
      this.animation = setInterval(function () { play(builder, sliding_window) }, this.state.duration)

    } else { // clear animation and reset data

      clearInterval(this.animation)

      this.state.playing = false
      this.deactivateUserInterface(false)

      builder.builder.reference = parseInt(d3_select('#sliderReference').property('value'))
      if (builder.builder.difference_mode) {
        builder.builder.target = parseInt(builder.builder.reference) + 1
      } else {
        builder.builder.target = parseInt(d3_select('#sliderTarget').property('value'))

      }
    }

    function animate_slider (set_to) {

      let slider_value = parseInt(d3_select('#sliderReference').property('value'))
      let slider_max = parseInt(d3_select('#sliderReference').property('max'))
      let slider_min = parseInt(d3_select('#sliderReference').property('min'))

      if (set_to !== undefined) {
        slider_value = set_to
      } else if (slider_value < slider_max) {
        slider_value++
      } else {
        slider_value = slider_min
      }

      d3_select('#sliderReference').property('value', slider_value)
      d3_select('#dropDownMenuReference').property('selectedIndex', slider_value)

    }
  }

  get_current_data_set (builder) {
    if (builder.type_of_data === 'reaction') {
      return builder.options.reaction_data
    } else if (builder.type_of_data === 'gene') {
      return builder.options.gene_data
    } else if (builder.type_of_data === 'metabolite') {
      return builder.options.metabolite_data
    } else {
      return []
    }
  }

  get_current_data_set_names (builder) {
    if (builder.type_of_data === 'reaction') {
      return builder.reaction_data_names
    } else if (builder.type_of_data === 'gene') {
      return builder.gene_data_names
    } else if (builder.type_of_data === 'metabolite') {
      return builder.metabolite_data_names
    } else {
      return []
    }

  }

  get_array_of_time_points (builder, map) {

    let array_of_time_points = []
    let time_scale_is_linear

    for (let i in this.get_current_data_set_names(builder.builder)) {
      let name = this.get_current_data_set_names(builder.builder)[i]

      if (name.startsWith('t') && typeof parseInt(name.slice(1)) === 'number') { // check if rest of string is a number
        array_of_time_points.push(parseInt(name.slice(1)))
        time_scale_is_linear = false
      } else {
        array_of_time_points.push(parseInt(i))
        time_scale_is_linear = true
      }
    }

    if (time_scale_is_linear) {
      map.set_status('Displaying Linear Time Scale')
    } else {
      map.set_status('Displaying Non Linear Time Scale')
    }

    return array_of_time_points
  }

  buttonDifferenceMode (builder) {
    d3_select('#timeSeriesButton').style('background-color', 'lightgrey')
    d3_select('#differenceModeButton').style('background-color', 'white')
    builder.builder.difference_mode = true
    this.showDifferenceData(builder)

    d3_select('#dropDownMenuTarget').style('display', 'block')
    d3_select('#sliderTarget').style('display', 'block')

    d3_select('#checkBoxSlidingWindow').style('opacity', 1)
    d3_select('#checkBoxSlidingWindow').property('checked', false)

    d3_select('#checkBoxSlidingWindowLabel').style('opacity', 1)
    d3_select('#checkBoxSlidingWindowLabel').text('Sliding Window')

  }

  buttonTimeSeries (builder) {
    d3_select('#timeSeriesButton').style('background-color', 'white')
    d3_select('#differenceModeButton').style('background-color', 'lightgrey')
    builder.builder.difference_mode = false
    builder.builder.set_data_indices(builder.builder.type_of_data, builder.builder.reference, null)


    d3_select('#dropDownMenuTarget').style('display', 'none')
    d3_select('#sliderTarget').style('display', 'none')

    d3_select('#checkBoxSlidingWindow').style('opacity', 0)
    d3_select('#checkBoxSlidingWindowLabel').style('opacity', 0)

  }

  showDifferenceData (builder) {
    builder.builder.difference_mode = true
    builder.builder.set_data_indices(builder.builder.type_of_data, builder.reference, builder.target)
  }

  dropDownMenuReference (builder) {

    let value = parseInt(d3_select('#dropDownMenuReference').property('value'))
    builder.builder.reference = value
    d3_select('#sliderReference').property('value', value)
    this.current = value

    if (builder.difference_mode) {
      this.showDifferenceData(builder)
    } else {
      builder.builder.set_data_indices(builder.builder.type_of_data, builder.reference, builder.target)
    }
  }

  sliderReference (builder) {
    let value = parseInt(d3_select('#sliderReference').property('value'))
    builder.reference = value
    d3_select('#dropDownMenuReference').property('selectedIndex', value)
    this.current = value

    if (builder.difference_mode) {
      this.showDifferenceData(builder)
    } else {
      builder.builder.set_data_indices(builder.builder.type_of_data, builder.reference, builder.target)
    }
  }

  dropDownMenuTarget (builder) {
    let value = parseInt(d3_select('#dropDownMenuTarget').property('value'))
    builder.target = value
    d3_select('#sliderTarget').property('selectedIndex', value)
    this.current = value

    if (builder.difference_mode) {
      this.showDifferenceData(builder)
    } else {
      builder.builder.set_data_indices(builder.builder.type_of_data, builder.reference, builder.target)
    }
  }

  sliderTarget (builder) {
    let value = parseInt(d3_select('#sliderTarget').property('value'))
    builder.target = value
    d3_select('#dropDownMenuTarget').property('selectedIndex', value)
    this.current = value

    if (builder.difference_mode) {
      this.showDifferenceData(builder)
    } else {
      builder.builder.set_data_indices(builder.builder.type_of_data, builder.reference, builder.target)
    }
  }

  checkBoxInterpolation (builder) {
    if (d3_select('#checkBoxInterpolation').property('checked')) {
      builder.map.interpolation = true
    } else {
      builder.map.interpolation = false

    }
  }

  setDuration (value) {
    this.state.duration = value
  }

  render (builder) {

    //let duration = 2000
    this.state.playing = false

    builder.difference_mode = false
    builder.reference = 0
    builder.target = 0

    // set to time series mode on default
    this.buttonTimeSeries(builder)

    let map = builder.map
    let current = 0

    let type_of_data = builder.type_of_data
    let sliding_window = false



    return (
      <div
        className='timeSeriesContainer'
        style={this.props.visible ? {display: 'inline-flex'} : {display: 'none'}}>

        <div>

          <div>
            <button
              className='timeSeriesButton'
              id='reaction_tab_button'
              onClick={() => this.openTab('reaction', builder)}
            >Reaction / Gene Data
            </button>
            <button
              className='timeSeriesButton'
              id='metabolite_tab_button'
              onClick={() => this.openTab('metabolite', builder)}
            >Metabolite Data
            </button>

            <button
              className='timeSeriesButton escape'
              onClick={() => this.close()}
            >x
            </button>

          </div>


          <div>
            <button
              className='timeSeriesButton'
              id='timeSeriesButton'
              onClick={() => this.buttonTimeSeries(builder)}
            >Time Series
            </button>

            <button
              className='timeSeriesButton'
              id='differenceModeButton'
              onClick={() => this.buttonDifferenceMode(builder)}
            >Difference Mode
            </button>
          </div>

          <div>
            <div>
              <div>
                <select
                  className='dropDownMenu'
                  id='dropDownMenuReference'
                  onChange={() => this.dropDownMenuReference(builder)}
                >Reference</select>
              </div>
              <input
                className='slider'
                id='sliderReference'
                type='range'
                min={0}
                max={0}
                step={1}
                value={0}
                onChange={() => this.sliderReference(builder)}
              > </input>
            </div>

            <div>
              <div>
                <select
                  className='dropDownMenu'
                  id='dropDownMenuTarget'
                  onChange={() => this.dropDownMenuTarget(builder)}
                >Target</select>
              </div>
              <input
                className='slider'
                id='sliderTarget'
                type='range'
                min={0}
                max={0}
                step={1}
                value={0}
                onChange={() => this.sliderTarget(builder)}
              > </input>
            </div>
          </div>

          <div>
            <button
              className='timeSeriesButton play'
              onClick={() => this.play_time_series(builder, map, this.state.duration, sliding_window)}
            >Play
            </button>

            <input
              type='number'
              id='inputDuration'
              style='width: 60px'
              value={this.duration}
              onChange={() => this.setDuration(d3_select('#inputDuration').property('value'))}
            >
            </input>

            <label
              for='inputDuration'>
              in ms
            </label>

            <input
              type='checkbox'
              id='checkBoxInterpolation'
              onChange={() => this.checkBoxInterpolation(builder)}
            >

            </input>

            <label
              for='checkBoxInterpolation'>
              Interpolation
            </label>

            <input
              type='checkbox'
              id='checkBoxSlidingWindow'
            >

            </input>
            <label
              id='checkBoxSlidingWindowLabel'
              for='checkBoxSlidingWindow'>
              Sliding Window
            </label>
          </div>
        </div>
      </div>
    )
  }


}

export default TimeSeriesBar
