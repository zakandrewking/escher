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

module.exports = {
  version: ESCHER_VERSION,
  Builder: require('./Builder'),
  Map: require('./Map'),
  Behavior: require('./Behavior'),
  KeyManager: require('./KeyManager'),
  DataMenu: require('./DataMenu'),
  UndoStack: require('./UndoStack'),
  CobraModel: require('./CobraModel'),
  utils: require('./utils'),
  SearchIndex: require('./SearchIndex'),
  Settings: require('./Settings'),
  data_styles: require('./data_styles'),
  static: require('./static'),
  ZoomContainer: require('./ZoomContainer'),
  libs: {
    '_': require('underscore'),
    'underscore': require('underscore'),
    'preact': require('preact'),
    'baconjs': require('baconjs'),
    'mousetrap': require('mousetrap'),
    'vkbeautify': require('vkbeautify'),
    'd3_selection': require('d3-selection'),
    'd3_select': require('d3-selection').select,
    'd3_json': require('d3-request').json
  }
}
