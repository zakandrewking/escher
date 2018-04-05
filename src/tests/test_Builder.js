const Builder = require('../Builder').default

const d3Body = require('./helpers/d3Body')

// Should test for the broken function that use utils.draw_array/object

const get_map = require('./helpers/get_map')
const get_model = require('./helpers/get_model')

const describe = require('mocha').describe
const it = require('mocha').it
const mocha = require('mocha')
const assert = require('assert')

function make_parent_sel (s) {
  var element = s.append('div');
  const width = 100;
  const height = 100;
  // Workaround to be able to use getBoundingClientRect
  // which always returns {height: 0, width: 0, ...} in jsdom.
  // https://github.com/jsdom/jsdom/issues/653#issuecomment-266749765
  element.node().getBoundingClientRect = () => ({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
  });
  return element;
}

describe('Builder', () => {
  it('Small map, no model. Async tests.', (done) => {
    const sel = make_parent_sel(d3Body)
    const b = Builder(get_map(), null, '', sel, {
      never_ask_before_quit: true,
      first_load_callback: () => {
        assert.strictEqual(sel.select('svg').node(), b.map.svg.node())
        assert.strictEqual(sel.selectAll('#nodes').size(), 1)
        assert.strictEqual(sel.selectAll('.node').size(), 79)
        assert.strictEqual(sel.selectAll('#reactions').size(), 1)
        assert.strictEqual(sel.selectAll('.reaction').size(), 18)
        assert.strictEqual(sel.selectAll('#text-labels').size(), 1)
        sel.remove()
        done()
      }
    })
  })

  it('Small map, no model. Multiple instances.', () => {
    const sels = []
    for (let i = 0, l = 3; i < l; i++) {
      const sel = make_parent_sel(d3Body)
      // TODO actually test that these maps were added to the DOM
      Builder(get_map(), null, '', sel, { never_ask_before_quit: true })
      sels.push(sel)
    }
    sels.map(sel => sel.remove())
  })

  it('check for model+highlight_missing bug', () => {
    Builder(get_map(), get_model(), '', make_parent_sel(d3Body),
            { never_ask_before_quit: true, highlight_missing: true })
  })

  it('SVG selection error', () => {
    const sel = make_parent_sel(d3Body).append('svg').append('g')
    assert.throws(() => {
      Builder(null, null, '', sel, { never_ask_before_quit: true })
    }, /Builder cannot be placed within an svg node/)
  })

  /** If the scale is provided without max and min points, then automatically
   * add them.
   */
  it('fix scales', () => {
    const sel = make_parent_sel(d3Body)
    const b = Builder(
      null, null, '', sel,
      { reaction_scale: [{ type: 'median', color: '#9696ff', size: 8 }],
        never_ask_before_quit: true }
    )
    assert.deepEqual(
      b.options.reaction_scale,
      [
        { type: 'median', color: '#9696ff', size: 8 },
        { type: 'min', color: '#ffffff', size: 10 },
        { type: 'max', color: '#ffffff', size: 10 }
      ]
    )
  })

  /** Also fix the scale if the setting is manipulated after creation of the
   * Builder.
   */
  it('fix scales after callback', () => {
    const sel = make_parent_sel(d3Body)
    const b2 = Builder(
      null,
      null,
      '',
      sel,
      {
        metabolite_scale: [
          { type: 'median', color: 'red', size: 0 },
          { type: 'min', color: 'red', size: 0 },
          { type: 'max', color: 'red', size: 0 }
        ],
        never_ask_before_quit: true
      }
    )
    b2.settings.set_conditional('metabolite_scale', [{ type: 'median', color: '#9696ff', size: 8 }])
    assert.deepEqual(
      b2.options.metabolite_scale,
      [
        { type: 'median', color: '#9696ff', size: 8 },
        { type: 'min', color: '#ffffff', size: 10 },
        { type: 'max', color: '#ffffff', size: 10 }
      ]
    )
  })

  it('open search bar', done => {
    const sel = make_parent_sel(d3Body)
    const b = Builder(null, null, '', sel, {
      first_load_callback: () => {
        b.renderSearchBar()
        done()
      }
    })
  })

  it('set_reaction_data', done => {
    const sel = make_parent_sel(d3Body)
    Builder(get_map(), null, '', sel, {
      first_load_callback: function () {
        // These just need to run right now
        this.set_reaction_data({ GAPD: 2.0 })
        this.set_reaction_data(null)
        done()
      }
    })
  })

  it('set_metabolite_data', done => {
    const sel = make_parent_sel(d3Body)
    Builder(get_map(), null, '', sel, {
      first_load_callback: function () {
        // These just need to run right now
        this.set_metabolite_data({ g3p: 2.0 })
        this.set_metabolite_data(null)
        done()
      }
    })
  })

  it('set_gene_data', done => {
    const sel = make_parent_sel(d3Body)
    Builder(get_map(), null, '', sel, {
      first_load_callback: function () {
        // These just need to run right now
        this.set_gene_data({ b1779: 2.0 })
        this.set_gene_data(null)
        done()
      }
    })
  })
})
