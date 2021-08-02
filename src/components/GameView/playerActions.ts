import { useContext } from 'react';
import { PeerContext } from './p2p';
import { Action } from '../../types';
import { useGameDataStore } from '../../utils/store';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import type { PlayerAction, Tile } from '../../types';

export function processRecievedData(recievedData: PlayerAction) {
  const gameDataStore = useGameDataStore(state => state.gameDataState);
  const updateDataStore = useGameDataStore(state => state.updateGameDataState);
  const dataBody = recievedData.body;
  
  switch (recievedData.action) {
    case Action.DrawTile:
      if (dataBody.tile) {
        // update store accordingly in zustand
        
      }
      break;
    case Action.PlaceTile:
      if (dataBody.tile) {
        const discards = gameDataStore.discards;
        const currPlayer = gameDataStore.currentTurn;
        const newDiscardsOfCurrentPlayer = [ ...discards[currPlayer], dataBody.tile];
        const newDiscardsOfAllPlayers = { ...discards };
        newDiscardsOfAllPlayers[currPlayer] = newDiscardsOfCurrentPlayer;

        updateDataStore({
          ...gameDataStore,
          discards: newDiscardsOfAllPlayers
        });
      }
      break;
    case Action.Chi:
      break;
    case Action.Peng:
      break;
    case Action.Gang:
      break;
    case Action.ShowFlower:
      break;
    case Action.ReplaceFlower:
      break;
  }
}

function sendToEveryone(data: string) {
  const peers: { [userId: string]: SimplePeer.Instance } = useContext(PeerContext);

  for (const id in peers) {
    peers[id].send(data);
  }
}

export function sendDrawTile(tile: Tile, wasFlower?: boolean) {
  const drawAction: PlayerAction = {
    action: wasFlower? Action.ReplaceFlower : Action.DrawTile,
    body: {
      tile: tile
    }
  };

  sendToEveryone(JSON.stringify(drawAction));
}

export function sendPlaceTile(tile: Tile) {
  const placeAction: PlayerAction = {
    action: Action.PlaceTile,
    body: {
      tile: tile
    }
  };

  sendToEveryone(JSON.stringify(placeAction));
}

export function sendConsumeTile(actionType: Action, fromPlayer: string, toPlayer: string, tile: Tile) {
  const consumeAction: PlayerAction = {
    action: actionType,
    body: {
      tile: tile,
      playerFrom: fromPlayer,
      playerTo: toPlayer
    }
  };

  sendToEveryone(JSON.stringify(consumeAction));
}

export function sendShowFlower(tile: Tile){
  const showFlowerAction: PlayerAction = {
    action: Action.ShowFlower,
    body: {
      tile: tile
    }
  };

  sendToEveryone(JSON.stringify(showFlowerAction));
}
