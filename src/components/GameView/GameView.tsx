import React, { useState, useEffect, FunctionComponent } from 'react';
import PeerContextProvider, { PeerContext } from './p2p';
import './GameView.css';

const GameView: FunctionComponent = () => {

  return (
    <div className="mainview">
      <PeerContextProvider>
      </PeerContextProvider>
    </div>
  );
};

export default GameView;
