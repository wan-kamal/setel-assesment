import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';

import App from './app/app';

import 'bulma';

import { Provider } from 'react-redux';
import { store } from './app/store';

ReactDOM.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
  </StrictMode>,
  document.getElementById('root')
);
