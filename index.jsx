import './react-devtool';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Root from './Root';
//import Postmate from 'postmate';

var root = document.getElementById('react-root');

if (!root) {
  root = document.createElement('div');
  root.id = 'react-root';
  document.body.appendChild(root);
}

// const handshake = new Postmate.Model({});

// handshake.then(parent => {
//   console.log('parent handshake complete1');
//   let _listeners = [];
//   let _closeListeners = [];
//   parent.model['message'] = data => {
//     _listeners.forEach(fn => fn(data));
//   };
//   let wall = {
//     listen: fn => {
//       _listeners.push(fn);
//     },
//     send: data => {
//       parent.emit('message', data);
//     },
//     onClose(fn) {
//       _closeListeners.push(fn);
//     }
//   };
//   connectToDevTools(wall);

//   // parent.model['message']({
//   //   type: 'event',
//   //   evt: 'requestCapabilities',
//   //   data: null
//   // });
//   parent.emit('childReady', {});
// });

function renderApp(app) {
  render(<AppContainer>{app}</AppContainer>, root);
}

renderApp(<Root />);

if (module.hot) {
  module.hot.accept();
}
