import Builder, * as escher from '../main'

import {describe, it} from 'mocha'
import {assert} from 'chai'

describe('main', () => {
  it('properties', () => {
    const properties = [
      'version',
      'Builder',
      'Map',
      'Behavior',
      'KeyManager',
      'UndoStack',
      'CobraModel',
      'utils',
      'SearchIndex',
      'Settings',
      'dataStyles',
      'ZoomContainer'
    ]
    properties.map(property => {
      assert.property(escher, property)
    })
  })

  it('libs', () => {
    const libs = [
      '_',
      'underscore',
      'preact',
      'baconjs',
      'mousetrap',
      'vkbeautify',
      'd3Selection',
      'd3Select',
      'd3Json'
    ]
    libs.map(lib => {
      assert.property(escher.libs, lib)
    })
  })

  it('Builder with or without new', () => {
    const builder1 = new Builder(null, null, null, null, {})
    const builder2 = Builder(null, null, null, null, {})
    const builder3 = new escher.Builder(null, null, null, null, {})
    assert(builder1 instanceof Builder)
    assert(builder2 instanceof Builder)
    assert(builder3 instanceof Builder)
  })

  it('old style collection', () => {
    assert.property(escher.utils, 'set_options')
  })
})
