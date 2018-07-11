/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

var Agent = require('./agent/Agent');
var Bridge = require('./agent/Bridge');
var installGlobalHook = require('./backend/installGlobalHook');
var inject = require('./agent/inject');
var invariant = require('assert');

installGlobalHook(window);

if (window.document) {
  // This shell is universal, and might be used inside a web app.
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.on('react-devtools', agent => {
    var setupHighlighter = require('./frontend/Highlighter/setup');
    setupHighlighter(agent);
  });
}

function setupBackend(wall, resolveRNStyle) {
  var bridge = new Bridge(wall);
  var agent = new Agent(window);
  agent.addBridge(bridge);

  wall.onClose(() => {
    if (agent) {
      agent.emit('shutdown');
    }
    // This appears necessary for plugin (e.g. Relay) cleanup.
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.emit('shutdown');
    bridge = null;
    agent = null;
    console.log('closing devtools');
  });

  var _connectTimeout = setTimeout(() => {
    console.warn('react-devtools agent got no connection');
  }, 20000);

  agent.once('connected', () => {
    if (!agent) {
      return;
    }
    inject(window.__REACT_DEVTOOLS_GLOBAL_HOOK__, agent);
    clearTimeout(_connectTimeout);
  });
}

function connectToDevTools(wall) {
  setupBackend(wall, false);
}

window.connectToDevTools = connectToDevTools;

module.exports = { connectToDevTools };
