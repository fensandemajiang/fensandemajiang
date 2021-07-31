import React, { FunctionComponent } from 'react';
import MainView from './components/MainView';
import './App.css';

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  return (
    <>
      <MainView />
    </>
  );
};

export default App;
