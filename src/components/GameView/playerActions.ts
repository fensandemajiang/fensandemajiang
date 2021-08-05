import { Action, GameState } from '../../types';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import type { PlayerAction, Tile, GameDataState } from '../../types';

export function processReceivedData(
  gameDataStore: GameDataState,
  receivedData: PlayerAction,
): GameDataState {
  const dataBody = receivedData.body;

  switch (receivedData.action) {
    /* this action is probably not needed anymore but keeping this around for now until i'm certain about it
    case Action.DrawTile:
      if (dataBody.tile) {
        // update store accordingly in zustand
        
      }
      return gameDataStore;
      break;
    */
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
    case Action.GiveDeck:
      if (dataBody.deck && dataBody.playerTo) {
        const newDeckOwner = dataBody.playerTo;
        const newDeck = dataBody.deck;

        return {
          ...gameDataStore,
          deck: newDeck,
          playerWithDeck: newDeckOwner,
        };
      }
      break;
    case Action.GiveHand:
      if (dataBody.deck && dataBody.playerTo) {
        //const toPlayer = dataBody.playerTo; // do we even need playerTo here? i guess we could do another check to see we are the correct recipient...
        const hand = dataBody.deck;

        return {
          ...gameDataStore,
          yourHand: hand,
        };
      }
      break;
  }

  console.error('Action not processed properly');
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

export function updateCurrentPlayerIndex(
  peers: { [userId: string]: SimplePeer.Instance },
  currPlayerInd: number,
): void {
  const updateCurrentPlayerIndexAction: PlayerAction = {
    action: Action.UpdateCurrentPlayerIndex,
    body: {
      playerIndex: currPlayerInd,
    },
  };

  sendToEveryone(peers, JSON.stringify(updateCurrentPlayerIndexAction));
}

export function updateGameState(
  peers: { [userId: string]: SimplePeer.Instance },
  gameState: GameState,
): void {
  const updateGameStateAction: PlayerAction = {
    action: Action.UpdateGameState,
    body: {
      gameState: gameState,
    },
  };

  sendToEveryone(peers, JSON.stringify(updateGameStateAction));
}

export function sendHand(
  peers: { [userId: string]: SimplePeer.Instance },
  hand: Tile[],
  toPlayer: string,
): void {
  const giveHandAction: PlayerAction = {
    action: Action.GiveHand,
    body: {
      deck: hand,
      playerTo: toPlayer, // do we even need playerTo here?
    },
  };

  peers[toPlayer].send(JSON.stringify(giveHandAction));
}

export function giveDeck(
  peers: { [userId: string]: SimplePeer.Instance },
  deck: Tile[],
  toPlayer: string,
): void {
  const giveDeckAction: PlayerAction = {
    action: Action.GiveDeck,
    body: {
      deck: deck,
      playerTo: toPlayer,
    },
  };

  sendToEveryone(peers, JSON.stringify(giveDeckAction));
}

/* we don't need to let everyone else know about the card we drew
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
*/

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
