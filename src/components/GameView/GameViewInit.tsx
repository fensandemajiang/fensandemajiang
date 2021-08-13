import React, { FunctionComponent, useContext } from 'react';
import PeerContextProvider from './PeerContextProvidor';
import { PeerContext } from './PeerContextProvidor';
import GameView from './GameView';

const GameViewInit: FunctionComponent = () => {
  const peers = useContext(PeerContext);
  console.log(Object.keys(peers));

  return (
    <PeerContextProvider>
      {/*<GameView />*/}
      hello world
    </PeerContextProvider>
  );
};

export default GameViewInit;
