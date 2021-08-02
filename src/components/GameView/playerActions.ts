import { useContext } from 'react';
import { PeerContext } from './p2p';
import { Action } from '../../types';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import type { PlayerAction, Tile } from '../../types';

export function processRecievedData(recievedData: PlayerAction) {
  switch (recievedData.action) {
    case Action.DrawTile:
      if (recievedData.body?.tile) {
        // update store accordingly in zustand

      }
      break;
    case Action.PlaceTile:
      if (recievedData.body?.tile) {

      }
      break;
    case Action.Chi:
      break;
    case Action.Kong:
      break;
    case Action.Pang:
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

export function sendConsumeTile(actionType: Action, fromPlayer: number, toPlayer: number, tile: Tile) {
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
