import React, { useEffect, useState, FunctionComponent } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import GameView from './GameView';
import { processReceivedData } from './playerActions';
import { Identity, ThreadID, Query, Where } from '@textile/hub';
import type { ConnectionState, DbConnectDetail } from '../../types';

const GameViewInit: FunctionComponent = () => {
  const [hasInit, setHasInit] = useState(false);

  useEffect(() => {
    const connState: ConnectionState =
      useConnectionStore.getState().connectionState;
    const signalIDs: string[] = connState.signalIDs;
    const userID: string = connState.userID;
    const client = connState.client;
    const identity = connState.identity;
    async function init() {
      console.log("render meeee");

      try {
        await client.getToken(identity);
      } catch (err) {
        console.log('could not get token');
      }

      const peers: { [userId: string]: SimplePeer.Instance } = {};
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
            const threadId = ThreadID.fromString(
              useConnectionStore.getState().connectionState.threadId,
            );
            // add the entry to the db
            const connectDetail: DbConnectDetail = {
              from: userID,
              to: id,
              data: JSON.stringify(data),
            };
            await client.create(threadId, 'connectDetail', [connectDetail]);
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
      }

      // respond to signals
      const checkArr: number[] = []; // store intervals
      for (let idInd = 0; idInd < signalIDs.length; idInd++) {
        const id = signalIDs[idInd];
        // wait until corresponding entry appears in db
        // check every second
        if (signalIDs[idInd] !== userID) {
          // wait for response, if it's not yourself
          checkArr.push(
            window.setInterval(() => {
              async function asyncWrapper() {
                console.log('ping for response', id);
                const thread =
                  useConnectionStore.getState().connectionState.threadId;
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

                console.log('found', foundData);

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

      useConnectionStore.setState({
        ...useConnectionStore.getState(),
        connectionState: {
          ...useConnectionStore.getState().connectionState,
          peers: peers
        }
      });
    }
    init();
  }, []);

  function click() {
    const s = useConnectionStore.getState().connectionState.signalIDs;
    for (let i = 0; i < s.length; i++) {
      const u = s[i];
      if (u !== useConnectionStore.getState().connectionState.userID) {
  //      peers[u].write("hi");
      }
    }
  }

  return (
    <div>
      {/*<GameView />*/}
      hello world
      <br/>
      <button className="bg-blue-500" onClick={click}> send </button>
    </div>
  );
};

export default GameViewInit;
