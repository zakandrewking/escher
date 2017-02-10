'use strict'

const require_helper = require('./helpers/require_helper')
const Draw = require_helper('Draw')

const describe = require('mocha').describe
const it = require('mocha').it
const assert = require('chai').assert
const beforeEach = require('mocha').beforeEach;
const d3_body = require('./helpers/d3_body')
const d3_select = require('d3-selection').select

const draw = new Draw()

function get_all_attrs (selection, attr) {
  return selection.nodes().map(n => {
    console.log(n.constructor.name)//, d3_select(n).attr('class'))
    return d3_select(n).attr(attr)
  })
  // const out = []
  // selection.each(function () {
  //   console.log(d3_select(this).node())
  //   out.push(d3_select(this).attr(attr))
  // })
  // return out
}

describe('Draw', function () {
  it('create_reaction', function () {
    const parent_sel = d3_body.append('div')

    // set up
    const d_sel = parent_sel
          .selectAll('.reaction')
          .data([{ reaction_id: '1234' }, { reaction_id: '5678' }])

    // run create_reaction
    const e_sel = draw.create_reaction.bind(draw)(d_sel.enter())

    // check length
    assert.strictEqual(e_sel.size(), 2)
    // check ids
    assert.sameMembers(get_all_attrs(e_sel, 'id'), [ 'r1234', 'r5678' ])
    // check classes
    assert.isTrue(get_all_attrs(e_sel, 'class').every(c => c === 'reaction'))
    // check label
    assert.strictEqual(e_sel.selectAll('.reaction-label').size(), 2)

    parent_sel.remove()
  })
})
