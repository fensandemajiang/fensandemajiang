import React, { useState, useEffect, FunctionComponent } from 'react';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import GameView from './GameView';
import { updateGameDataStateAndLog, stateTransitionAllowed } from './gameFsm';
import { Update, ThreadID, Filter } from '@textile/hub';
import { waitForCondition } from '../../utils/utilFunc';
import { Mutex } from 'async-mutex';
import type { ConnectionState, DbConnectDetail } from '../../types';

const GameViewInit: FunctionComponent = () => {
  const [displayGameView, setDisplayGameView] = useState(false);

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
      client.listen(
        threadId,
        listenFilters,
        (update?: Update<DbConnectDetail>) => {
          if (!update || !update.collectionName) return;

          client.find(threadId, update.collectionName, {})
          .then((value) => {
            const allInst: DbConnectDetail[] = value as DbConnectDetail[];
            const returnedConnectionIds: string[] = useConnectionStore.getState().connectionState.returnedConnectionIds;
            const dataToSendToPeers: DbConnectDetail[] = allInst.filter(cd => cd.to === userID && !returnedConnectionIds.includes(cd.from));
          
            for (let i = 0; i < dataToSendToPeers.length; i++) {
              const inst: DbConnectDetail = dataToSendToPeers[i];
              peers[inst.from].signal(JSON.parse(inst.data));
            }

            const sendingToIds: string[] = dataToSendToPeers.map(d => d.from);
            const newReturned: string[] = [ ...returnedConnectionIds, ...sendingToIds ];
            useConnectionStore.setState({
              ...useConnectionStore.getState(),
              connectionState: {
                ...useConnectionStore.getState().connectionState,
                returnedConnectionIds: newReturned
              }
            });
          });
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
          (async function req() {
            console.log('sending req to', id);
            // add the entry to the db
            const connectDetail: DbConnectDetail = {
              from: userID,
              to: id,
              data: JSON.stringify(data),
              _id: '',
            };
            await client.create(threadId, 'connectDetail', [connectDetail]);
          })();
        });

        peers[id].on('data', (data) => {
          // determine what kind of data was sent over
          // modify state in zustand accordingly
          const condition = () =>
            stateTransitionAllowed(
              useGameDataStore.getState().gameDataState.currentState,
              JSON.parse(data),
            );
          waitForCondition(condition).then(() =>
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
              }),
          );
        });

        const connectMutex = new Mutex();
        peers[id].on('connect', () => {
          connectMutex.runExclusive(() => {
            console.log('connected with', id);

            useConnectionStore.setState({
              ...useConnectionStore.getState(),
              connectionState: {
                ...useConnectionStore.getState().connectionState,
                userConnectedCount:
                  useConnectionStore.getState().connectionState
                    .userConnectedCount + 1,
              },
            });

            if (useConnectionStore.getState().connectionState.userConnectedCount === 3) { 
              setDisplayGameView(true);
            }
          });
        });

        peers[id].on('error', (err) => {
          console.error(err);
        });
      }

      useConnectionStore.setState({
        ...useConnectionStore.getState(),
        connectionState: {
          ...useConnectionStore.getState().connectionState,
          peers: peers,
        },
      });
      
      client.find(threadId, 'connectDetail', {})
      .then((value) => {
        const allInst: DbConnectDetail[] = value as DbConnectDetail[];
        const returnedConnectionIds: string[] = useConnectionStore.getState().connectionState.returnedConnectionIds;
        const dataToSendToPeers: DbConnectDetail[] = allInst.filter(cd => cd.to === userID && !returnedConnectionIds.includes(cd.from));
      
        for (let i = 0; i < dataToSendToPeers.length; i++) {
          const inst: DbConnectDetail = dataToSendToPeers[i];
          peers[inst.from].signal(JSON.parse(inst.data));
        }

        const sendingToIds: string[] = dataToSendToPeers.map(d => d.from);
        const newReturned: string[] = [ ...returnedConnectionIds, ...sendingToIds ];
        useConnectionStore.setState({
          ...useConnectionStore.getState(),
          connectionState: {
            ...useConnectionStore.getState().connectionState,
            returnedConnectionIds: newReturned
          }
        });
      });     
    }
    init();
  }, []);

  return (displayGameView? (<div>Loading...</div>) : (<GameView />));
};

export default GameViewInit;
