import React, {
  useState,
  useEffect,
  createContext,
  ReactChild,
  ReactElement,
} from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import { processReceivedData } from './playerActions';
import { Identity, ThreadID, Query, Where } from '@textile/hub';
import type { ConnectionState, DbConnectDetail } from '../../types';

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
  const client = connState.client;
  const identity = connState.identity;
  const [hasInit, setHasInit] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await client.getToken(identity);
      } catch (err) {
        console.log("could not gen token");
      }
    }
    init();
  }, []);

  // TODO FIX THIS GARBAGE
  // There's a pretty big flaw with this, that will occur when react strict mode is enabled.
  // Every time PeerContext gets rendered, it will create a new set of peers
  // However, the old set of peers will not get destructed (since the timers below are still running, and thus still pointing to it)
  // this causes a memory leak, and an issue where there will be duplicate peers
  const peers: { [userId: string]: SimplePeer.Instance } = {};
  if (!hasInit) {
    console.log('render meeeeeeeeee');
    // create signals first before receiving to reduce waiting time
    // create and send relevant signals
    for (let idInd = 0; idInd < signalIDs.length; idInd++) {
      const id = signalIDs[idInd];
      if (userID < id) {
        // we init
        console.log('init: sending to', id);
        peers[id] = new SimplePeer({
          initiator: true,
          trickle: false,
        });
      } else if (userID > id) {
        // partner inits
        console.log('init: receiving from', id);
        peers[id] = new SimplePeer({
          initiator: false,
          trickle: false,
        });
      } else {
        continue;
      }

      peers[id].on('signal', (data) => {
        // send data to db for user with current id
        // might be able batch inserts into the db to increase efficiency
        async function asyncWrapper() {
          const threadId = ThreadID.fromString(useConnectionStore.getState().connectionState.threadId);
          // add the entry to the db
          const connectDetail: DbConnectDetail = {
            from: userID,
            to: id,
            data: JSON.stringify(data),
          };
          await client.create(threadId, 'connectDetail', [connectDetail]);
          //}
        }

        console.log('adding to db', userID, id);
        asyncWrapper();
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
      //}
    }

    // respond to signals
    const checkArr: number[] = []; // store intervals
    for (let idInd = 0; idInd < signalIDs.length; idInd++) {
      const id = signalIDs[idInd];
      // wait until corresponding entry appears in db
      // check every second
      if (signalIDs[idInd] !== userID) { // wait for response, if it's not yourself
        checkArr.push(
          window.setInterval(() => {
            async function asyncWrapper() {
              console.log('ping for response', id);
              const thread = useConnectionStore.getState().connectionState.threadId;
              const threadId = ThreadID.fromString(thread);

              const query: Query = new Where('from')
                .eq(id)
                .and('to')
                .eq(userID);
              const foundData: DbConnectDetail[] = await client.find(
                threadId,
                'connectDetail',
                query,
              );

              console.log("found", foundData);

              if (foundData.length > 0) {
                const partnerSignalDataObj: DbConnectDetail = foundData[0];
                const partnerSignalData: string = partnerSignalDataObj.data;
                peers[signalIDs[idInd]].signal(JSON.parse(partnerSignalData)); // send response acknowledging connection to opp
                clearInterval(checkArr[idInd]);
              }
            }
            asyncWrapper();
          }, 1000),
        );
      }
    }
    setHasInit(true);
  }

  return <PeerContext.Provider value={peers}>{children}</PeerContext.Provider>;
}
