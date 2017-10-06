import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

function render() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

render();
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./App', render);
}