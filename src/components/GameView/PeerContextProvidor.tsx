import React, { createContext, ReactChild, ReactElement } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import { processReceivedData } from './playerActions';
import { UserConnectionState } from '../../types';
import type { ConnectionState } from '../../types';

type Props = {
  children?: ReactChild | ReactChild[];
};

const PeerContext = createContext({});

export { PeerContext };

export default function PeerContextProvider({ children }: Props): ReactElement {
  const connState: ConnectionState =
    useConnectionStore.getState().connectionState;
  const signalIDs: string[] = connState.signalIDs;
  const userID: string = connState.userID;

  const setConnectionState = (
    state: UserConnectionState,
    ind: number,
  ): void => {
    const newUserConnectionState = [
      ...useConnectionStore.getState().connectionState.userConnectionState,
    ];
    newUserConnectionState[ind] = state;

    useConnectionStore.setState({
      ...useConnectionStore.getState(),
      connectionState: {
        ...useConnectionStore.getState().connectionState,
        userConnectionState: newUserConnectionState,
      },
    });
  };

  const peers: { [userId: string]: SimplePeer.Instance } = {};
  // create signals first before receiving to reduce waiting time
  // create and send relevant signals
  for (let idInd = 0; idInd < signalIDs.length; idInd++) {
    const id = signalIDs[idInd];
    const currUserConnectionState =
      useConnectionStore.getState().connectionState.userConnectionState[idInd];
    if (currUserConnectionState === UserConnectionState.NotConnected) {
      if (userID < id) {
        // we init
        console.log('init: sending to', id);
        peers[id] = new SimplePeer({
          initiator: true,
          trickle: false,
        });
        setConnectionState(UserConnectionState.AwaitingResponse, idInd);
      } else if (userID > id) {
        // partner inits
        console.log('init: receiving from', id);
        peers[id] = new SimplePeer({
          initiator: false,
          trickle: false,
        });
        setConnectionState(UserConnectionState.AwaitingOffer, idInd);
      }

      peers[id].on('signal', (data) => {
        // send data to db for user with current id
        // might be able batch inserts into the db to increase efficiency
        console.log(data);
      });

      peers[id].on('data', (data) => {
        // determine what kind of data was sent over
        // modify state in zustand accordingly
        const newDataStore = processReceivedData(
          useGameDataStore.getState().gameDataState,
          JSON.parse(data),
        );
        useGameDataStore.setState({
          ...useGameDataStore.getState(),
          gameDataState: newDataStore,
        });
      });
    }
  }

  // respond to signals
  const checkArr: number[] = []; // store intervals
  for (let idInd = 0; idInd < signalIDs.length; idInd++) {
    const id = signalIDs[idInd];
    const currUserConnectionState =
      useConnectionStore.getState().connectionState.userConnectionState[idInd];
    if (
      userID > id &&
      currUserConnectionState !== UserConnectionState.Connected
    ) {
      // wait until corresponding entry appears in db

      // check every second
      checkArr.push(
        setInterval(() => {
          setConnectionState(UserConnectionState.Connected, idInd);
          console.log('ping for response', id);
          if (false) {
            // entry in db
            const partnerSignalData = ''; // get value from db
            peers[signalIDs[idInd]].signal(JSON.parse(partnerSignalData)); // send response acknowledging connection to opp
            clearInterval(checkArr[idInd]);
          }
        }, 1000),
      );
    }
  }

  return <PeerContext.Provider value={peers}>{children}</PeerContext.Provider>;
}
