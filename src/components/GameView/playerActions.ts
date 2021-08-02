import { useContext } from 'react';
import { PeerContext } from './p2p';
import { Action } from '../../types';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import type { PlayerAction, Tile } from '../../types';

export function processRecievedData(recievedData: PlayerAction) {
  switch (recievedData.action) {
    case Action.DrawTile:
      const tile: Tile | undefined = recievedData.body?.tile;

      if (tile) {
        // update store accordingly in zustand
      }
      break;
    case Action.PlaceTile:
      break;
    case Action.Chi:
      break;
    case Action.Kong:
      break;
    case Action.Pang:
      break;
    case Action.Gang:
      break;
  }
}

function sendToEveryone(data: string) {
  const peers: { [userId: string]: SimplePeer.Instance } = useContext(PeerContext);

  for (const id in peers) {
    peers[id].send(data);
  }
}

export function sendDrawTile(tile: Tile) {
  const drawAction: PlayerAction = {
    "action": Action.DrawTile,
    "body": {
      "tile": tile
    }
  };

  sendToEveryone(JSON.stringify(drawAction));
}
