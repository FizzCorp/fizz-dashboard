import reducer from '../reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import { promiseMiddleware, submitPromiseMiddleware } from './lib/promise-middleware';

export default createStore(
  reducer,
  compose(
    applyMiddleware(promiseMiddleware, submitPromiseMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
);