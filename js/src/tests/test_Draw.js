'use strict'

const require_helper = require('./helpers/require_helper')
const Draw = require_helper('Draw')

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('chai').assert
const beforeEach = require('mocha').beforeEach;
const d3 = require('d3')
const d3_body = require('./helpers/d3_body')

const draw = new Draw()

function get_all_attrs (d3_selection, attr) {
  const out = []
  d3_selection.each(function () {
    out.push(d3.select(this).attr(attr))
  })
  return out
}

describe('Draw', function () {
  it('create_reaction', function () {
    const parent_sel = d3_body.append('div')

    // set up
    const els = parent_sel
            .selectAll('.reaction')
            .data([{ reaction_id: '1234' }, { reaction_id: '5678' }])
    // run create_reaction
    els.enter().call(draw.create_reaction.bind(draw))

    // check length
    assert.strictEqual(els.size(), 2)
    // check ids
    assert.sameMembers(get_all_attrs(els, 'id'), [ 'r1234', 'r5678' ])
    // check classes
    assert.isTrue(get_all_attrs(els, 'class').every(c => c === 'reaction'))
    // check label
    assert.strictEqual(els.selectAll('.reaction-label').size(), 2)

    parent_sel.remove()
  })
})
