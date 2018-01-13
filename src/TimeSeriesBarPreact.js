/** TimeSeriesBar */

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
      playing: props.playing,
      value: props.value
    }

  }

  close () {
    this.setState({visible: false})
  }

  /**
   *  Updates the GUI
   *  if a data set is loaded
   *   set to specific data set
   *   set slider to max of data set length
   *   set counter to 0 of data
   *   set dropdown menu length
   *  else
   *   reset everything
   */

  update (builder) {

    var currentDataSet = this.get_current_data_set(builder)

    let duration
    if (currentDataSet !== null) {
      // update display
      var current = 0
      d3_select('#counter').text('Display Dataset: ' + (current + 1) + ' / ' + currentDataSet.length)

      // update slider
      d3_select('#sliderReference')
        .attr('max', (currentDataSet.length - 1))
        .attr('value', 0)

      d3_select('#sliderTarget')
        .attr('max', (currentDataSet.length - 1))
        .attr('value', 0)

      d3_select('#referenceText').text('Reference Data Set: ' + current)
      d3_select('#targetText').text('Target Data Set: ' + current)

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
      duration = 2000

      // update display
      this.current = 0
      d3_select('#counter').text('Display Dataset: 0 / 0')

      // update slider
      d3_select('#sliderReference')
        .attr('max', 0)
        .attr('value', 0)

      d3_select('#sliderTarget')
        .attr('max', 0)
        .attr('value', 0)

      d3_select('#referenceText').text('Reference Data Set: ')
      d3_select('#targetText').text('Target Data Set: ')

      d3_select('#checkBoxChart').property('checked', false)
      d3_select('#checkBoxInterpolation').property('checked', false)

      // reset dropdown menu
      document.getElementById('dropDownMenuReference').options.length = 0
      document.getElementById('dropDownMenuTarget').options.length = 0
    }
  }

  openTab (builder) {
    d3_select('#tab_container').style('display', 'block')

    d3_select('#reaction_tab_button').style('background-color', 'lightgrey')
    d3_select('#metabolite_tab_button').style('background-color', 'lightgrey')
    d3_select('#both_tab_button').style('background-color', 'lightgrey')

    var tabs = document.getElementsByClassName('tab')

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].style.display = 'none'
    }

    if (builder.type_of_data === 'reaction') {
      d3_select('#reaction_tab_button').style('background-color', 'white')
      this.update(builder)
    } else if (builder.type_of_data === 'gene') {
      d3_select('#reaction_tab_button').style('background-color', 'white')
      this.update(builder)
    } else if (builder.type_of_data === 'metabolite') {
      d3_select('#metabolite_tab_button').style('background-color', 'white')
      this.update(builder)
    }

  }



  play_time_series (builder, map, duration, both_data_play_back, sliding_window) {

    map = builder.map

    if (!this.playing) {
      this.playing = true

      var sliding_window_start = parseInt(builder.builder.reference)
      var sliding_window_end = parseInt(builder.builder.target)

      // array of time points for non-linear time scale
      var array_of_time_points = this.get_array_of_time_points(builder, map)

      var tick = array_of_time_points[sliding_window_start]
      var time_point = sliding_window_start

      // difference mode
      var start = parseInt(builder.builder.reference)
      var end = parseInt(this.get_current_data_set(builder).length - 1)

      if (builder.difference_mode && !sliding_window) {
        builder.builder.target = parseInt(builder.builder.reference)
      }

      // sliding window mode

      var sliding_window_size = 1

      var duration = duration / (end - start)

      map.transition_duration = duration

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

        } else if (builder.difference_mode) {

          if (tick === array_of_time_points[time_point]) {

            // reference is static, next goes from reference + 1 to end
            builder.builder.set_data_indices(builder.builder.type_of_data, builder.builder.reference, builder.builder.target)

            var next = builder.builder.target

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

            if (both_data_play_back) {
              builder.builder.set_data_indices('reaction', builder.builder.reference, sliding_window_end)
              builder.builder.set_data_indices('metabolite', builder.builder.reference, sliding_window_end)
            } else {
              builder.builder.set_data_indices(builder.builder.type_of_data, builder.builder.reference, sliding_window_end)
            }

            if (parseInt(builder.builder.reference) < end) {
              var next = builder.builder.reference
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
      var animation = setInterval(function () { play(builder, sliding_window) }, duration)

    } else { // clear animation and reset data

      clearInterval(animation)

      this.playing = false

      builder.builder.reference = sliding_window_start
      if (builder.builder.difference_mode) {
        builder.builder.target = parseInt(builder.builder.reference) + 1
      } else {
        builder.builder.target = sliding_window_end

      }
    }

    function animate_slider (set_to) {

      var slider_value = parseInt(d3_select('#sliderReference').property('value'))
      var slider_max = parseInt(d3_select('#sliderReference').property('max'))
      var slider_min = parseInt(d3_select('#sliderReference').property('min'))

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

    var array_of_time_points = []
    var time_scale_is_linear

    for (var i in this.get_current_data_set_names(builder)) {
      var name = this.get_current_data_set_names(builder)[i]

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
    builder.difference_mode = true
    this.showDifferenceData(builder)

    //groupButtons.style('display', 'block')
    d3_select('#dropDownMenuTarget').style('display', 'block')
    d3_select('#sliderTarget').style('display', 'block')

    d3_select('#checkBoxChart').style('opacity', 1)
    d3_select('#checkBoxChart').property('checked', false)

    d3_select('#checkBoxChartLabel').style('opacity', 1)
    d3_select('#checkBoxChartLabel').text('Sliding Window')

  }

  buttonTimeSeries (builder) {
    d3_select('#timeSeriesButton').style('background-color', 'white')
    d3_select('#differenceModeButton').style('background-color', 'lightgrey')
    builder.difference_mode = false

    //groupButtons.style('display', 'block')
    d3_select('#dropDownMenuTarget').style('display', 'none')
    d3_select('#sliderTarget').style('display', 'none')

    d3_select('#checkBoxChart').style('opacity', 0)
    d3_select('#checkBoxChartLabel').style('opacity', 0)

  }

  showDifferenceData (builder) {
    builder.builder.difference_mode = true
    builder.builder.set_data_indices(builder.builder.type_of_data, builder.reference, builder.target)
  }

  dropDownMenuReference (builder) {

    let value = parseInt(d3_select('#dropDownMenuReference').property('value'))
    builder.reference = value
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



  render (builder) {

    let duration = 2000
    let playing = false

    builder.difference_mode = false
    builder.reference = 0
    builder.target = 0

    let map = builder.map
    let current = 0

    let type_of_data = builder.type_of_data

    let both_data_play_back = false
    let sliding_window = false

    return (
      <div
        className='timeSeriesContainer'
        style={this.state.visible ? {display: 'inline-flex'} : {display: 'none'}}>

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
              onClick={() => this.play_time_series(builder, map, duration, both_data_play_back, sliding_window)}
            >Play
            </button>

            <input
              type='number'
              id='inputDuration'
              style='width: 60px'
              value={this.duration}
              onInput={this.duration = this.value}
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
