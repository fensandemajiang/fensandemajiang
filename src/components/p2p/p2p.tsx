import React, { createContext, FC } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';

interface Props {}

const PeerContext = createContext({});

export { PeerContext };

export default function createPeerContextProvider(isInit: boolean): FC<Props> {
  return ({ children, ...props }) => {
    const peer = new SimplePeer({
      initiator: isInit,
      trickle: false,
    });

    return <PeerContext.Provider value={peer}>{children}</PeerContext.Provider>;
  };
}
