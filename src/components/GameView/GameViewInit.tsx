import React, { useEffect, useState, FunctionComponent } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import GameView from './GameView';
import { processReceivedData } from './playerActions';
import { Identity, Update, ThreadID, Filter, Query, Where } from '@textile/hub';
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
    const threadIdString = useConnectionStore.getState().connectionState.threadId;
    const threadId = ThreadID.fromString(threadIdString);
    async function init() {
      console.log("render meeee");
      console.log("did", userID);

      try {
        await client.getToken(identity);
      } catch (err) {
        console.log('could not get token');
      }

      const listenFilters: Filter[] = [
        { collectionName: 'connectDetail' },
        { actionTypes: ['CREATE'] }
      ];
      await client.listen(threadId, listenFilters, (update?: Update<DbConnectDetail>) => {
        async function asyncWrapper() {
          if (!update || !update.instance) return;
          /*
          console.log("------------------");
          console.log(update.instance._id);
          console.log(update.instance.data);
          console.log(update.instance.from);
          console.log(update.instance.to);
          console.log("--------------");
          */

          const inst: DbConnectDetail = update.instance;
          if (inst.to === userID) {
            console.log("processing req from", inst.from);
            peers[inst.from].signal(JSON.parse(inst.data));
          }
        }
        asyncWrapper();
      });

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
            console.log('sending req to', id);
            // add the entry to the db
            const connectDetail: DbConnectDetail = {
              from: userID,
              to: id,
              data: JSON.stringify(data),
              _id: '',
            };
            await client.create(threadId, 'connectDetail', [connectDetail]);
            console.log(data);
          }
          asyncWrapper();
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
