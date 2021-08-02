import React, { createContext, FC, ReactChild } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore } from '../../utils/store';
import { processRecievedData } from './playerActions';

import type { ConnectionState, PlayerAction } from '../../types';

type Props = {
  children?: ReactChild | ReactChild[]
}

const PeerContext = createContext({});

export { PeerContext };

export default function PeerContextProvider ({ children }: Props) {
  const connectionState: ConnectionState = useConnectionStore(state => state.connectionState);
  const signalIDs: string[] = connectionState.signalIDs;
  const userID: string = connectionState.userID;
  
  const peers: { [userId: string]: SimplePeer.Instance } = {};
  // create signals first before receiving to reduce waiting time
  // create and send relevant signals
  for (const id in signalIDs) {
    if (userID < id) { // we init
       peers[id] = new SimplePeer({
        initiator: true,
        trickle: false
      });
    } else if (userID > id)  { // partner inits
      peers[id] = new SimplePeer({
        initiator: false,
        trickle: false
      });
    }

    peers[id].on("signal", (data) => {
      // send data to db for user with current id
      // might be able batch inserts into the db to increase efficiency
    });

    peers[id].on("data", (data) => {
      // determine what kind of data was sent over
      // modify state in zustand accordingly
      processRecievedData(JSON.parse(data));
    });
  }

  // respond to signals
  for (const id in signalIDs) {
    if (userID > id) {
      // wait until corresponding entry appears in db
      
      const partnerSignalData = "";
      peers[id].signal(JSON.parse(partnerSignalData));
    }
  }

  return (<PeerContext.Provider value={peers}>{children}</PeerContext.Provider>);
}
