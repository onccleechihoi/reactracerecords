import ReactDOM from 'react-dom';
// eslint-disable-next-line no-unused-vars
import React from 'react';
// import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux';
import rootReducer from '@/redux/reducers';
import { createStore, applyMiddleware } from 'redux';
import { callAPIMiddleware, getDataFeedMiddleware } from '@/redux/actions';
import '@/assets/scss/all.scss';
import CreateRoutes from '@/routers';

// const loggerMiddleware = createLogger();

// callAPIMiddleware
function configureStore(preloadedState) {
  return createStore(
    rootReducer,
    preloadedState,
    /*
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
*/
    applyMiddleware(callAPIMiddleware, getDataFeedMiddleware),
  );
}

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <CreateRoutes />
  </Provider>,
  document.getElementById('app'),
);
