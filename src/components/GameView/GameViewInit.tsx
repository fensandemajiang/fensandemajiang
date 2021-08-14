import React, { useEffect, FunctionComponent } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import GameView from './GameView';
import { updateGameDataStateAndLog } from './gameFsm';
import { Update, ThreadID, Filter } from '@textile/hub';
import type { ConnectionState, DbConnectDetail } from '../../types';

const GameViewInit: FunctionComponent = () => {
  useEffect(() => {
    if (useConnectionStore.getState().connectionState.threadId.length === 0) {
      console.log('empty thread id found, defaulting to dev');
      return;
    }

    const connState: ConnectionState =
      useConnectionStore.getState().connectionState;
    const signalIDs: string[] = connState.signalIDs;
    const userID: string = connState.userID;
    const client = connState.client;
    const identity = connState.identity;
    const threadIdString =
      useConnectionStore.getState().connectionState.threadId;
    const threadId = ThreadID.fromString(threadIdString);
    async function init() {
      console.log('initializing peers');

      try {
        await client.getToken(identity);
      } catch (err) {
        console.log('could not get token');
      }

      const peers: { [userId: string]: SimplePeer.Instance } = {};
      const listenFilters: Filter[] = [
        { collectionName: 'connectDetail' },
        { actionTypes: ['CREATE'] },
      ];
      await client.listen(
        threadId,
        listenFilters,
        (update?: Update<DbConnectDetail>) => {
          if (!update || !update.instance) return;

          const inst: DbConnectDetail = update.instance;
          if (inst.to === userID) {
            peers[inst.from].signal(JSON.parse(inst.data));
          }
        },
      );

      for (let idInd = 0; idInd < signalIDs.length; idInd++) {
        const id = signalIDs[idInd];
        if (userID < id) {
          // we init
          console.log('init: sending to', id);
          peers[id] = new SimplePeer({
            initiator: true,
            trickle: false,
            config: {
              iceServers: [
                {
                  urls: 'stun:numb.viagenie.ca',
                  username: 'sultan1640@gmail.com',
                  credential: '98376683',
                },
                {
                  urls: 'turn:numb.viagenie.ca',
                  username: 'sultan1640@gmail.com',
                  credential: '98376683',
                },
              ],
            },
          });
        } else if (userID > id) {
          // partner inits
          console.log('init: receiving from', id);
          peers[id] = new SimplePeer({
            initiator: false,
            trickle: false,
            config: {
              iceServers: [
                {
                  urls: 'stun:numb.viagenie.ca',
                  username: 'sultan1640@gmail.com',
                  credential: '98376683',
                },
                {
                  urls: 'turn:numb.viagenie.ca',
                  username: 'sultan1640@gmail.com',
                  credential: '98376683',
                },
              ],
            },
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
          }
          asyncWrapper();
        });

        peers[id].on('data', (data) => {
          // determine what kind of data was sent over
          // modify state in zustand accordingly
          updateGameDataStateAndLog(
            useGameDataStore.getState().gameDataState,
            JSON.parse(data),
            peers,
            threadIdString,
          )
            .then((newDataStore) => {
              useGameDataStore.setState({
                ...useGameDataStore.getState(),
                gameDataState: newDataStore,
              });
            })
            .catch((err) => {
              console.error(err);
            });
        });

        peers[id].on('connect', () => {
          console.log('connected with', id);
          useConnectionStore.setState({
            ...useConnectionStore.getState(),
            connectionState: {
              ...useConnectionStore.getState().connectionState,
              userConnectedCount: useConnectionStore.getState().connectionState.userConnectedCount + 1
            }
          });
        });

        peers[id].on('error', (err) => {
          console.log('err', err.name);
          console.log('err', err.message);
        });
      }

      useConnectionStore.setState({
        ...useConnectionStore.getState(),
        connectionState: {
          ...useConnectionStore.getState().connectionState,
          peers: peers,
        },
      });
    }
    init();
  }, []);

  return <GameView />;
};

export default GameViewInit;
