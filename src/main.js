/**
* @license
*
* Escher
* Author: Zachary King
*
* The MIT License (MIT)
*
* This software is Copyright © 2015 The Regents of the University of
* California. All Rights Reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

// ESCHER_VERSION provided by webpack plugin or main-node
/* global ESCHER_VERSION */

import underscore from 'underscore'
import preact from 'preact'
import baconjs from 'baconjs'
import mousetrap from 'mousetrap'
import vkbeautify from 'vkbeautify'
import { select as d3_select, selection as d3_selection } from 'd3-selection'
import { json as d3_json } from 'd3-request'

export const version = ESCHER_VERSION

export { default as Builder, default } from './Builder'
export { default as Map } from './Map'
export { default as Behavior } from './Behavior'
export { default as KeyManager } from './KeyManager'
export { default as DataMenu } from './DataMenu'
export { default as UndoStack } from './UndoStack'
export { default as CobraModel } from './CobraModel'
export { default as utils } from './utils'
export { default as SearchIndex } from './SearchIndex'
export { default as Settings } from './Settings'
export { default as data_styles } from './data_styles'
export { default as ZoomContainer } from './ZoomContainer'

// Jupyter extension
export { default as initializeJupyterWidget } from './widget'

export const libs = {
  _: underscore,
  underscore,
  preact,
  baconjs,
  mousetrap,
  vkbeautify,
  d3_selection,
  d3_select,
  d3_json
}
