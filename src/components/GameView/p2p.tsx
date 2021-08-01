import React, { createContext, FC, ReactChild } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore } from '../../utils/store';

import type { ConnectionState } from '../../types';

type Props = {
  children?: ReactChild | ReactChild[]
}

const PeerContext = createContext({});

export { PeerContext };

export default function PeerContextProvider ({ children }: Props) {
  const connectionState: ConnectionState = useConnectionStore(state => state.connectionState);
  const signalIDs: { [key: number]: string } = connectionState.signalIDs;
  const userID: number = connectionState.userID;
  
  const peers: { [userId: number]: SimplePeer.Instance } = {};
  // create signals first before receiving to reduce waiting time
  // create and send relevant signals
  for (const id in signalIDs) {
    if (userID < parseInt(id)) { // we init
       peers[id] = new SimplePeer({
        initiator: true,
        trickle: false
      });
    } else if (userID > parseInt(id))  { // partner inits
      peers[id] = new SimplePeer({
        initiator: false,
        trickle: false
      });
    }

    peers[id].on("signal", (data) => {
      // send data to db for user with current id
      // might be able batch inserts into the db to increase efficiency
    });
  }

  // respond to signals
  for (const id in signalIDs) {
    if (userID > parseInt(id)) {
      // wait until corresponding entry appears in db
      
      const partnerSignalData = "";
      peers[id].signal(JSON.parse(partnerSignalData));
    }
  }

  return (<PeerContext.Provider value={peers}>{children}</PeerContext.Provider>);
}
