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
    // scale changes
    settings.streams['reaction_scale'].onValue(scale => {
      this.setReactionScale(scale, getDataStatistics)
    })
    settings.streams['metabolite_scale'].onValue(scale => {
      this.setMetaboliteScale(scale, getDataStatistics)
    })

    // stats changes
    map.callback_manager.set('calc_data_stats__reaction', changed => {
      if (changed) {
        this.setReactionScale(settings.get_option('reaction_scale'),
                              getDataStatistics)
      }
    })
    map.callback_manager.set('calc_data_stats__metabolite', changed => {
      if (changed) {
        this.setMetaboliteScale(settings.get_option('metabolite_scale'),
                                getDataStatistics)
      }
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
