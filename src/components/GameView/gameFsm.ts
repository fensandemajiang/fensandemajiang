import { GameDataState, ActionType, PlayerAction, Tile } from '../../types';
import { compStr } from '../../utils/utilFunc';
import { tileEqual, calculateScore, randomizeDeck } from './GameFunctions';

function drawTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  const deck: Tile[] = gameDataState.deck;
  const newDeck: Tile[] = deck.slice(0, deck.length - 1);
  if (stateTransition.body?.isSending) {
    const lastTile: Tile = deck[deck.length - 1];
    const newHand: Tile[] = [ ...gameDataState.yourHand, lastTile ];

    // send to peers

    return {
      ...gameDataState,
      deck: newDeck,
      yourHand: newHand
    };
  } else {
    return {
      ...gameDataState,
      deck: newDeck
    };
  }
}

function placeTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  if (stateTransition.body.tile === undefined || stateTransition.body.playerTo === undefined)  {
    throw Error("tile undefined or playerTo undefined");
  }

  const discardedTile: Tile = stateTransition.body.tile;
  const discards: { [userId: string]: Tile[] } = gameDataState.discards;
  const myDiscards: Tile[] = [
    ...discards[stateTransition.body.playerTo],
    discardedTile,
  ];
  const newDiscards: { [userId: string]: Tile[] } = { ...discards };
  newDiscards[stateTransition.body.playerTo] = myDiscards;

  if (stateTransition.body?.isSending) {
    const newHand: Tile[] = [...gameDataState.yourHand];
    const tileInd: number = newHand.findIndex((t) =>
      tileEqual(t, discardedTile),
    );
    newHand.splice(tileInd, 1);

    // send to peers

    return {
      ...gameDataState,
      discards: newDiscards,
      yourHand: newHand,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards
    }
  }
}

function chi(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  if (stateTransition.body.triple === undefined || stateTransition.body.playerTo === undefined || stateTransition.body.playerFrom === undefined) {
    throw Error("triple, playerTo, or playerFrom is undefined");
  }

  const currentPlayerId: string = stateTransition.body.playerFrom;
  const currentPlayerDiscards: Tile[] = gameDataState.discards[currentPlayerId];
  const chiTile: Tile = currentPlayerDiscards[currentPlayerDiscards.length - 1];
  const newCurrentPlayerDiscards: Tile[] = currentPlayerDiscards.slice(0, currentPlayerDiscards.length - 1);
  let newDiscards: { [userId: string]: Tile[] } = { ...gameDataState.discards };
  newDiscards[currentPlayerId] = newCurrentPlayerDiscards;

  const newDisplay: Tile[] = [ ...stateTransition.body.triple ];
  const yourNewDisplays: Tile[][] = [ ...gameDataState.shownTiles[stateTransition.body.playerTo], newDisplay ]
  const newShownTiles: { [userId: string]: Tile[][] } = { ...gameDataState.shownTiles };
  newShownTiles[stateTransition.body.playerTo] = yourNewDisplays;

  if (stateTransition.body.isSending) {
    let newHand: Tile[] = [ ...gameDataState.yourHand ];
    for (let i = 0; i < stateTransition.body?.triple?.length; i++) {
      const tripleTile = stateTransition.body?.triple[i];
      if (!tileEqual(tripleTile, chiTile)) {
        const tripleInd = newHand.findIndex(t => tileEqual(t, tripleTile));
        newHand.splice(tripleInd, 1);
      }
    }

    // send to peers

    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      yourHand: newHand,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles
    }
  }
}

function peng(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  if (stateTransition.body.triple === undefined || stateTransition.body.playerTo === undefined || stateTransition.body.playerFrom === undefined) {
    throw Error("triple, playerTo, or playerFrom is undefined");
  }

  const currentPlayerId: string = stateTransition.body.playerFrom;
  const currentPlayerDiscards: Tile[] = gameDataState.discards[currentPlayerId];
  const pengTile: Tile = currentPlayerDiscards[currentPlayerDiscards.length - 1];
  const newCurrentPlayerDiscards: Tile[] = currentPlayerDiscards.slice(0, currentPlayerDiscards.length - 1);
  let newDiscards: { [userId: string]: Tile[] } = { ...gameDataState.discards };
  newDiscards[currentPlayerId] = newCurrentPlayerDiscards;

  const newDisplay: Tile[] = [ ...stateTransition.body.triple ];
  const yourNewDisplays: Tile[][] = [ ...gameDataState.shownTiles[stateTransition.body.playerTo], newDisplay ]
  const newShownTiles: { [userId: string]: Tile[][] } = { ...gameDataState.shownTiles };
  newShownTiles[stateTransition.body.playerTo] = yourNewDisplays;

  if (stateTransition.body.isSending) {
    let newHand: Tile[] = [ ...gameDataState.yourHand ];
    for (let i = 0; i < stateTransition.body?.triple?.length; i++) {
      const tripleTile = stateTransition.body?.triple[i];
      if (!tileEqual(tripleTile, pengTile)) {
        const tripleInd = newHand.findIndex(t => tileEqual(t, tripleTile));
        newHand.splice(tripleInd, 1);
      }
    }

    // send to peers

    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      yourHand: newHand,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles
    }
  }
}

function gang(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  if (stateTransition.body.quad === undefined || stateTransition.body.playerTo === undefined || stateTransition.body.playerFrom === undefined) {
    throw Error("triple, playerTo, or playerFrom is undefined");
  }

  const currentPlayerId: string = stateTransition.body.playerFrom;
  const currentPlayerDiscards: Tile[] = gameDataState.discards[currentPlayerId];
  const pengTile: Tile = currentPlayerDiscards[currentPlayerDiscards.length - 1];
  const newCurrentPlayerDiscards: Tile[] = currentPlayerDiscards.slice(0, currentPlayerDiscards.length - 1);
  let newDiscards: { [userId: string]: Tile[] } = { ...gameDataState.discards };
  newDiscards[currentPlayerId] = newCurrentPlayerDiscards;

  const newDisplay: Tile[] = [ ...stateTransition.body.quad ];
  const yourNewDisplays: Tile[][] = [ ...gameDataState.shownTiles[stateTransition.body.playerTo], newDisplay ]
  const newShownTiles: { [userId: string]: Tile[][] } = { ...gameDataState.shownTiles };
  newShownTiles[stateTransition.body.playerTo] = yourNewDisplays;

  // draw card from deck for gang
  const deck: Tile[] = gameDataState.deck;
  const newDeck: Tile[] = deck.slice(0, deck.length - 1);

  if (stateTransition.body.isSending) {
    let newHand: Tile[] = [ ...gameDataState.yourHand ];
    for (let i = 0; i < stateTransition.body.quad.length; i++) {
      const quadTile = stateTransition.body.quad[i];
      if (!tileEqual(quadTile, pengTile)) {
        const quadInd = newHand.findIndex(t => tileEqual(t, quadTile));
        newHand.splice(quadInd, 1);
      }
    }

    // draw card is needed for gang, since we remove 4
    const lastTile: Tile = deck[deck.length - 1];
    newHand.push(lastTile);

    // send to peers

    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      yourHand: newHand,
      deck: newDeck,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      deck: newDeck,
    }
  }
}

function replaceFlower(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

function initGame(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

function SetPlayerId(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  const { signalIds, userId, peers } = stateTransition.body;
  if (signalIds === undefined || userId === undefined || peers === undefined) {
    throw Error('Signal IDs are undefined');
  }
  const playerIds = signalIds;
  const sortedPlayerIds: string[] = playerIds.sort(compStr); // sort by id, the order of the array gives the turn order
  let currentPlayerId: string = sortedPlayerIds[0];
  let currentPlayerIndex = 0;
  let newDeck: Tile[] = gameDataState.deck;
  if (currentPlayerId === userId) {
    // we're sending the deck to the next player
    currentPlayerId = sortedPlayerIds[1];
    currentPlayerIndex = 1;

    newDeck = randomizeDeck(gameDataState.deck);
  }
  return {
    ...gameDataState,
    allPlayerIds: sortedPlayerIds,
    yourPlayerId: userId,
    currentTurn: currentPlayerId,
    currentPlayerIndex: currentPlayerIndex,
    deck: newDeck,
  };
}

function hu(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  const { yourPlayerId, yourHand, score } = gameDataState;
  if (!(yourPlayerId in score)) {
    const newScore = { ...score, [yourPlayerId]: calculateScore(yourHand) };
    return {
      ...gameDataState,
      score: newScore,
    };
  }
  return gameDataState;
}

export function updateGameDataState(
  currentGameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  switch (stateTransition.action) {
    case ActionType.DrawTile:
      return drawTile(currentGameDataState, stateTransition);
    case ActionType.PlaceTile:
      return placeTile(currentGameDataState, stateTransition);
    case ActionType.Chi:
      return chi(currentGameDataState, stateTransition);
    case ActionType.Peng:
      return peng(currentGameDataState, stateTransition);
    case ActionType.Gang:
      return gang(currentGameDataState, stateTransition);
    case ActionType.ReplaceFlower:
      return replaceFlower(currentGameDataState, stateTransition);
    case ActionType.InitGame:
      return initGame(currentGameDataState, stateTransition);
    case ActionType.Hu:
      return hu(currentGameDataState, stateTransition);
    case ActionType.SetPlayerId:
      return SetPlayerId(currentGameDataState, stateTransition);
    default:
      return currentGameDataState;
  }
}
