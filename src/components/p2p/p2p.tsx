import React, { createContext, FC } from 'react';
import Peer from 'simple-peer';

interface Props {}

const PeerContext = createContext({});

export { PeerContext };

export default function createPeerContextProvider(isInit: boolean): FC<Props> {
  return ({ children, ...props }) => {
    const peer = new Peer({
      initiator: isInit,
      trickle: false
    })

    return (
      <PeerContext.Provider value={peer}>
        {children}
      </PeerContext.Provider>
    );
  }
}
