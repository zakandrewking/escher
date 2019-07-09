import scalePresets from './scalePresets'
import { scaleLinear } from 'd3-scale'

export default class Scale {
  constructor () {
    this.x = scaleLinear()
    this.y = scaleLinear()
    this.x_size = scaleLinear()
    this.y_size = scaleLinear()
    this.size = scaleLinear()
    this.reaction_color = scaleLinear().clamp(true)
    this.reaction_size = scaleLinear().clamp(true)
    this.metabolite_color = scaleLinear().clamp(true)
    this.metabolite_size = scaleLinear().clamp(true)
  }

  connectToSettings (settings, map, getDataStatistics) {
    // Wire up default scales. First warn if preset and scale are set. Use
    // presets to set scales, avoiding loops.
    const types = [ 'reaction', 'metabolite' ]
    types.forEach(type => {
      const scale = `${type}_scale`
      const preset = `${type}_scale_preset`

      // initial
      const presetVal = settings.get(preset)
      const scaleVal = settings.get(scale)
      if (presetVal && scaleVal) {
        console.warn(`Both ${scale} and ${preset} are defined. Ignoring ${preset}. Set ${preset} to "false" to hide this warning.`)
        settings.set(preset, null)
      } else if (presetVal) {
        settings.set(scale, scalePresets[presetVal])
      } else if (!scaleVal) {
        console.error(`Must provide a ${scale} or ${preset}`)
      }

      // Warn if scales are too short
      if (settings.get(scale) && settings.get(scale).length < 2) {
        console.error(`Bad value for option ${scale}. Scales must have at least 2 points.`)
      } else {
        this.setScale(type, scale, getDataStatistics)
      }

      // reactive
      settings.streams[scale].onValue(val => {
        // if the scale did not come from the preset, then reset the preset setting
        if (val && val !== scalePresets[settings.get(preset)]) {
          settings.set(preset, null)
        }
        this.setScale(type, val, getDataStatistics)
      })
      settings.streams[preset].onValue(val => {
        // if there is a new preset, then set the scale
        if (val) {
          settings.set(scale, scalePresets[val])
        }
      })

      // stats changes
      map.callback_manager.set(`calc_data_stats__${type}`, changed => {
        if (changed) {
          this.setScale(type, settings.get('reaction_scale'), getDataStatistics)
        }
      })
    })
  }

  sortScale (scale, stats) {
    var sorted = scale.map(x => {
      let v
      if (x.type in stats) {
        v = stats[x.type]
      } else if (x.type === 'value') {
        v = x.value
      } else {
        throw new Error('Bad domain type ' + x.type)
      }
      return { v, color: x.color, size: x.size }
    }).sort((a, b) => {
      return a.v - b.v
    })
    return {
      domain: sorted.map(x => { return x.v }),
      color_range: sorted.map(x => { return x.color }),
      size_range: sorted.map(x => { return x.size })
    }
  }

  setScale (type, scale, getDataStatistics) {
    if (type === 'reaction') {
      this.setReactionScale(scale, getDataStatistics)
    } else {
      this.setMetaboliteScale(scale, getDataStatistics)
    }
  }

  setReactionScale (scale, getDataStatistics) {
    const stats = getDataStatistics().reaction
    // If stats are null, then no data, so don't worry about it.
    if (stats !== null) {
      const out = this.sortScale(scale, stats)
      this.reaction_color.domain(out.domain)
      this.reaction_size.domain(out.domain)
      this.reaction_color.range(out.color_range)
      this.reaction_size.range(out.size_range)
    }
  }

  setMetaboliteScale (scale, getDataStatistics) {
    const stats = getDataStatistics().metabolite
    // If stats are null, then no data, so don't worry about it.
    if (stats !== null) {
      const out = this.sortScale(scale, stats)
      this.metabolite_color.domain(out.domain)
      this.metabolite_size.domain(out.domain)
      this.metabolite_color.range(out.color_range)
      this.metabolite_size.range(out.size_range)
    }
  }
}
