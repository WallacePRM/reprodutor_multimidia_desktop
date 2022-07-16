import React from 'react';
import ReactDOM from 'react-dom/client';

import './assets/styles/themes.css';
import './assets/styles/variables.css';
import './assets/styles/helpers.css';
import './assets/styles/utils.css';
import './index.css';

import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
