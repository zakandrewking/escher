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
      playing: props.playing
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

    var playing = true // TODO
    map = builder.map

    if (!playing) {
      playing = true

      var sliding_window_start = parseInt(builder.reference)
      var sliding_window_end = parseInt(builder.target)

      // array of time points for non-linear time scale
      var array_of_time_points = get_array_of_time_points(builder, map)

      var tick = array_of_time_points[sliding_window_start]
      var time_point = sliding_window_start

      // difference mode
      var start = parseInt(builder.reference)
      var end = parseInt(get_current_data_set(builder).length - 1)

      if (builder.difference_mode && !sliding_window) {
        builder.target = parseInt(builder.reference)
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

            if (parseInt(builder.target) < parseInt(end)) {

              builder.reference = parseInt(builder.reference) + 1
              builder.target = parseInt(builder.reference) + sliding_window_size

              d3_select('#sliderReference').property('value', builder.reference)
              d3_select('#dropDownMenuReference').property('selectedIndex', builder.reference)
              d3_select('#sliderTarget').property('value', builder.target)
              d3_select('#dropDownMenuTarget').property('selectedIndex', builder.target)

              time_point++
              tick++

            } else { // play as loop
              builder.reference = sliding_window_start
              builder.target = sliding_window_start + sliding_window_size

              time_point = start
              tick = array_of_time_points[start]

              d3_select('#sliderReference').property('value', builder.reference)
              d3_select('#dropDownMenuReference').property('selectedIndex', builder.reference)
              d3_select('#sliderTarget').property('value', builder.target)
              d3_select('#dropDownMenuTarget').property('selectedIndex', builder.target)
            }

            builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

          } else {

            if (tick >= array_of_time_points[end]) {
              tick = array_of_time_points[start]

              d3_select('#sliderReference').property('value', start)
              d3_select('#dropDownMenuReference').property('selectedIndex', start)
              d3_select('#sliderTarget').property('value', start + sliding_window_size)
              d3_select('#dropDownMenuTarget').property('selectedIndex', start + sliding_window_size)

              builder.reference = sliding_window_start
              builder.target = sliding_window_start + sliding_window_size

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
            builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

            var next = builder.target

            d3_select('#sliderTarget').property('value', next)
            d3_select('#dropDownMenuTarget').property('selectedIndex', next)

            if (parseInt(builder.target) < end) {
              next++
              builder.target = next

              time_point++
              tick++

            } else { // play as loop
              builder.target = start

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
              d3_select('#sliderTarget').property('value', builder.target)
              d3_select('#dropDownMenuTarget').property('selectedIndex', builder.target)

            }
          }
        } else {
          // TODO: handle interpolated data with non-linear time scale: set duration to next tick
          if (tick === array_of_time_points[time_point]) {

            if (both_data_play_back) {
              builder.set_data_indices('reaction', builder.reference, sliding_window_end)
              builder.set_data_indices('metabolite', builder.reference, sliding_window_end)
            } else {
              builder.set_data_indices(builder.type_of_data, builder.reference, sliding_window_end)
            }

            if (parseInt(builder.reference) < end) {
              var next = builder.reference
              next++
              builder.reference = next

              time_point++
              tick++

            } else { // play as loop
              builder.reference = sliding_window_start

              time_point = sliding_window_start
              tick = array_of_time_points[sliding_window_start]
            }
            animate_slider()

            builder.set_data_indices(builder.type_of_data, builder.reference, builder.target)

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

      playing = false

      builder.reference = sliding_window_start
      if (builder.difference_mode) {
        builder.target = parseInt(builder.reference) + 1
      } else {
        builder.target = sliding_window_end

      }
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

  render (builder) {
    return (
      <div
        className='timeSeriesContainer'
        style={this.state.visible ? {display: 'inline-flex'} : {display: 'none'}}>

        <div>

          <div>
            <button
              className='timeSeriesButton'
              onClick={this.openTab('reaction', this.state.builder)}
            >Reaction / Gene Data
            </button>
            <button
              className='timeSeriesButton'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Metabolite Data
            </button>

          </div>


          <div>
            <button
              className='timeSeriesButton'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Time Series
            </button>

            <button
              className='timeSeriesButton'
              onClick={this.openTab('metabolite', this.state.builder)}
            >Difference Mode
            </button>
          </div>

          <div>
            <div>
              <select
              id='dropDownMenuReference'
              >Reference</select>
              <input
                type='range'
              > </input>
            </div>

            <div>
              <select
              id='dropDownMenuTarget'
              >Target</select>
              <input
                type='range'
              > </input>
            </div>
          </div>

          <div>
            <button
              className='timeSeriesButton play'
              onClick={this.play_time_series(builder, builder.map, builder.duration)}
            >Play
            </button>

            <input
              type='checkbox'
            > Interpolation</input>

            <input
              type='checkbox'
            >Sliding Window</input>

            <button
              className='timeSeriesButton escape'
              onClick={() => this.close()}
            >
              <i className='icon-cancel' style={{marginTop: '-2px', verticalAlign: 'middle'}}/>
            </button>

          </div>
        </div>
      </div>

    )

  }



}



export default TimeSeriesBar
