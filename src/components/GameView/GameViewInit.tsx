import React, { FunctionComponent, useContext } from 'react';
import PeerContextProvider from './PeerContextProvidor';
import { PeerContext } from './PeerContextProvidor';
import { useConnectionStore } from '../../utils/store';
import GameView from './GameView';

const GameViewInit: FunctionComponent = () => {
  const peers = useContext(PeerContext);

  function click() {
    const s = useConnectionStore.getState().connectionState.signalIDs;
    for (let i = 0; i < s.length; i++) {
      
    }
  }

  return (
    <PeerContextProvider>
      {/*<GameView />*/}
      hello world
      <button className="bg-blue-500" onClick={click}> send </button>
    </PeerContextProvider>
  );
};

export default GameViewInit;
