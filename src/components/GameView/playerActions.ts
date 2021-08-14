import { ActionType, GameState } from '../../types';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import type { PlayerAction, Tile, GameDataState } from '../../types';

export function processReceivedData(
  gameDataStore: GameDataState,
  receivedData: PlayerAction,
): GameDataState {
  const dataBody = receivedData.body;

  switch (receivedData.action) {
    /* this action is probably not needed anymore but keeping this around for now until i'm certain about it
    case ActionType.DrawTile:
      if (dataBody.tile) {
        // update store accordingly in zustand
        
      }
      return gameDataStore;
      break;
    */
    case ActionType.PlaceTile:
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
    case ActionType.Chi:
      return gameDataStore;
      break;
    case ActionType.Peng:
      return gameDataStore;
      break;
    case ActionType.Gang:
      return gameDataStore;
      break;
    /*
    case ActionType.ShowFlower:
      return gameDataStore;
      break;
      */
    case ActionType.ReplaceFlower:
      return gameDataStore;
      break;
    /*
    case ActionType.GiveDeck:
      if (dataBody.deck && dataBody.playerTo) {
        const newDeckOwner = dataBody.playerTo;
        const newDeck = dataBody.deck;

        return {
          ...gameDataStore,
          deck: newDeck,
          // playerWithDeck: newDeckOwner,
        };
      }
      break;
    case ActionType.GiveHand:
      if (dataBody.deck && dataBody.playerTo) {
        //const toPlayer = dataBody.playerTo; // do we even need playerTo here? i guess we could do another check to see we are the correct recipient...
        const hand = dataBody.deck;

        return {
          ...gameDataStore,
          yourHand: hand,
        };
      }
      break;
    case ActionType.UpdateIpfsCid:
      if (dataBody.ipfsCid) {
        return { ...gameDataStore, previousIpfsCid: dataBody.ipfsCid };
      }
      break;
      */
  }

  console.error('ActionType not processed properly');
  return gameDataStore;
}

export function sendToEveryone(
  peers: { [userId: string]: SimplePeer.Instance },
  data: string,
): void {
  for (const id in peers) {
    peers[id].send(data);
  }
}
export function sendToPlayer(
  peers: { [userId: string]: SimplePeer.Instance },
  data: string,
  peerId: string,
): void {
  peers[peerId].send(data);
}

/*
export function updateCurrentPlayerIndex(
  peers: { [userId: string]: SimplePeer.Instance },
  currPlayerInd: number,
): void {
  const updateCurrentPlayerIndexActionType: PlayerAction = {
    action: ActionType.UpdateCurrentPlayerIndex,
    body: {
      playerIndex: currPlayerInd,
    },
  };

  sendToEveryone(peers, JSON.stringify(updateCurrentPlayerIndexActionType));
}

export function updateGameState(
  peers: { [userId: string]: SimplePeer.Instance },
  gameState: GameState,
): void {
  const updateGameStateActionType: PlayerAction = {
    action: ActionType.UpdateGameState,
    body: {
      gameState: gameState,
    },
  };
  sendToEveryone(peers, JSON.stringify(updateGameStateActionType));
}

export function updateIpfsCid(
  peers: { [userId: string]: SimplePeer.Instance },
  ipfsCid: string,
): void {
  const updateIpfsCidActionType: PlayerAction = {
    action: ActionType.UpdateIpfsCid,
    body: {
      ipfsCid: ipfsCid,
    },
  };
  sendToEveryone(peers, JSON.stringify(updateIpfsCidActionType));
}


export function giveDeck(
  peers: { [userId: string]: SimplePeer.Instance },
  deck: Tile[],
  toPlayer: string,
): void {
  const giveDeckActionType: PlayerAction = {
    action: ActionType.GiveDeck,
    body: {
      deck: deck,
      playerTo: toPlayer,
    },
  };

  sendToEveryone(peers, JSON.stringify(giveDeckActionType));
}
*/

/* we don't need to let everyone else know about the card we drew
export function sendDrawTile(
  peers: { [userId: string]: SimplePeer.Instance },
  tile: Tile,
  wasFlower?: boolean,
): void {
  const drawActionType: PlayerAction = {
    action: wasFlower ? ActionType.ReplaceFlower : ActionType.DrawTile,
    body: {
      tile: tile,
    },
  };

  sendToEveryone(peers, JSON.stringify(drawActionType));
}
*/

export function sendPlaceTile(
  peers: { [userId: string]: SimplePeer.Instance },
  tile: Tile,
): void {
  const placeActionType: PlayerAction = {
    action: ActionType.PlaceTile,
    body: {
      tile: tile,
    },
  };

  sendToEveryone(peers, JSON.stringify(placeActionType));
}

export function sendConsumeTile(
  peers: { [userId: string]: SimplePeer.Instance },
  actionType: ActionType,
  fromPlayer: string,
  toPlayer: string,
  tile: Tile,
): void {
  const consumeActionType: PlayerAction = {
    action: actionType,
    body: {
      tile: tile,
      playerFrom: fromPlayer,
      playerTo: toPlayer,
    },
  };

  sendToEveryone(peers, JSON.stringify(consumeActionType));
}

/*
export function sendShowFlower(
  peers: { [userId: string]: SimplePeer.Instance },
  tile: Tile,
): void {
  const showFlowerActionType: PlayerAction = {
    action: ActionType.ShowFlower,
    body: {
      tile: tile,
    },
  };

  sendToEveryone(peers, JSON.stringify(showFlowerActionType));
}
export function sendHand(
  peers: { [userId: string]: SimplePeer.Instance },
  stateTransition: PlayerAction,
): void {
  const giveHandActionType: PlayerAction = {
    action: ActionType.InitGame,
    body: {
      deck: hand,
      playerTo: toPlayer, // do we even need playerTo here?
    },
  };

  peers[toPlayer].send(JSON.stringify(giveHandActionType));
}
*/
