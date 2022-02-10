// imports
import './index.css';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import store from './store';
import Application from './components/Application.jsx';

// configuration
if (module.hot) {
  module.hot.accept();
}

// render
render((
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path='/' component={Application} />
      </Switch>
    </BrowserRouter>
  </Provider>
), document.getElementById('root'));