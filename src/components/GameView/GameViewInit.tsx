import React, { FunctionComponent } from 'react';
import PeerContextProvider from './PeerContextProvidor';
import GameView from './GameView';

const GameViewInit: FunctionComponent = () => {
  return (
    <PeerContextProvider>
      <GameView />
    </PeerContextProvider>
  );
};

export default GameViewInit;
