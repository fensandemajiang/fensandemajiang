import React, { FunctionComponent, Suspense, lazy } from 'react';
import history from '../history-helper';
import { Router, Switch, Route } from 'react-router-dom';

const MainView = lazy(() => import('@components/MainView'));
const LobbyView = lazy(() => import('@components/LobbyView'));
const GameView = lazy(() => import('@components/GameView'));

type RoutesProps = {};
const Routes: FunctionComponent<RoutesProps> = () => {
  return (
    <Router history={history}>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route component={LobbyView} path="/lobby" />
          <Route component={GameView} path="/play" />
          <Route component={MainView} path="/" />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default Routes;
