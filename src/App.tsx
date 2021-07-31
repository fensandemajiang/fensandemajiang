import React, { FunctionComponent } from 'react';
import Routes from './components/Routes';
import './App.css';

type AppProps = {};

const App: FunctionComponent<AppProps> = () => {
  return (
    <div className="fensandemajiang">
      <Routes />
    </div>
  );
};

export default App;
