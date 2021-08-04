// eslint-disable-next-line no-unused-vars
import React, { lazy, Suspense } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';

const App = lazy(() => import('@/views/Index'));

const RouterViews = () => (
  <div>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Suspense>
    </Router>
  </div>
);
export default RouterViews;
