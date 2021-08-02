import { Action } from '../../types';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import type { PlayerAction, Tile, GameDataState } from '../../types';

export function processRecievedData(
  gameDataStore: GameDataState,
  recievedData: PlayerAction,
): GameDataState {
  const dataBody = recievedData.body;

  switch (recievedData.action) {
    case Action.DrawTile:
      if (dataBody.tile) {
        // update store accordingly in zustand
      }
      return gameDataStore;
      break;
    case Action.PlaceTile:
      if (dataBody.tile) {
        const discards = gameDataStore.discards;
        const currPlayer = gameDataStore.currentTurn;
        const newDiscardsOfCurrentPlayer = [
          ...discards[currPlayer],
          dataBody.tile,
        ];
        const newDiscardsOfAllPlayers = { ...discards };
        newDiscardsOfAllPlayers[currPlayer] = newDiscardsOfCurrentPlayer;

        return {
          ...gameDataStore,
          discards: newDiscardsOfAllPlayers,
        };
      }
      break;
    case Action.Chi:
      return gameDataStore;
      break;
    case Action.Peng:
      return gameDataStore;
      break;
    case Action.Gang:
      return gameDataStore;
      break;
    case Action.ShowFlower:
      return gameDataStore;
      break;
    case Action.ReplaceFlower:
      return gameDataStore;
      break;
  }

  return gameDataStore;
}

function sendToEveryone(
  peers: { [userId: string]: SimplePeer.Instance },
  data: string,
): void {
  for (const id in peers) {
    peers[id].send(data);
  }
}

export function sendDrawTile(
  peers: { [userId: string]: SimplePeer.Instance },
  tile: Tile,
  wasFlower?: boolean,
): void {
  const drawAction: PlayerAction = {
    action: wasFlower ? Action.ReplaceFlower : Action.DrawTile,
    body: {
      tile: tile,
    },
  };

  sendToEveryone(peers, JSON.stringify(drawAction));
}

export function sendPlaceTile(
  peers: { [userId: string]: SimplePeer.Instance },
  tile: Tile,
): void {
  const placeAction: PlayerAction = {
    action: Action.PlaceTile,
    body: {
      tile: tile,
    },
  };

  sendToEveryone(peers, JSON.stringify(placeAction));
}

export function sendConsumeTile(
  peers: { [userId: string]: SimplePeer.Instance },
  actionType: Action,
  fromPlayer: string,
  toPlayer: string,
  tile: Tile,
): void {
  const consumeAction: PlayerAction = {
    action: actionType,
    body: {
      tile: tile,
      playerFrom: fromPlayer,
      playerTo: toPlayer,
    },
  };

  sendToEveryone(peers, JSON.stringify(consumeAction));
}

export function sendShowFlower(
  peers: { [userId: string]: SimplePeer.Instance },
  tile: Tile,
): void {
  const showFlowerAction: PlayerAction = {
    action: Action.ShowFlower,
    body: {
      tile: tile,
    },
  };

  sendToEveryone(peers, JSON.stringify(showFlowerAction));
}
