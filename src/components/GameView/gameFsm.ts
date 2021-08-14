import {
  GameDataState,
  ActionType,
  PlayerAction,
  Tile,
  Peers,
} from '../../types';
import { compStr } from '../../utils/utilFunc';
import {
  tileEqual,
  calculateScore,
  randomizeDeck,
  sendToEveryone,
} from './GameFunctions';

function drawTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  const deck: Tile[] = gameDataState.deck;
  const newDeck: Tile[] = deck.slice(0, deck.length - 1);
  if (stateTransition.body?.isSending) {
    const lastTile: Tile = deck[deck.length - 1];
    const newHand: Tile[] = [...gameDataState.yourHand, lastTile];

    // send to peers
    const toSendStateTransition: PlayerAction = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
      },
    };
    sendToEveryone(peers, JSON.stringify(toSendStateTransition));

    return {
      ...gameDataState,
      deck: newDeck,
      yourHand: newHand,
    };
  } else {
    return {
      ...gameDataState,
      deck: newDeck,
    };
  }
}

function placeTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  if (
    stateTransition.body.tile === undefined ||
    stateTransition.body.playerTo === undefined
  ) {
    throw Error('tile undefined or playerTo undefined');
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
    const toSendStateTransition: PlayerAction = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
      },
    };
    sendToEveryone(peers, JSON.stringify(toSendStateTransition));

    return {
      ...gameDataState,
      discards: newDiscards,
      yourHand: newHand,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
    };
  }
}

function chi(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  if (
    stateTransition.body.triple === undefined ||
    stateTransition.body.playerTo === undefined ||
    stateTransition.body.playerFrom === undefined
  ) {
    throw Error('triple, playerTo, or playerFrom is undefined');
  }

  const currentPlayerId: string = stateTransition.body.playerFrom;
  const currentPlayerDiscards: Tile[] = gameDataState.discards[currentPlayerId];
  const chiTile: Tile = currentPlayerDiscards[currentPlayerDiscards.length - 1];
  const newCurrentPlayerDiscards: Tile[] = currentPlayerDiscards.slice(
    0,
    currentPlayerDiscards.length - 1,
  );
  const newDiscards: { [userId: string]: Tile[] } = {
    ...gameDataState.discards,
  };
  newDiscards[currentPlayerId] = newCurrentPlayerDiscards;

  const newDisplay: Tile[] = [...stateTransition.body.triple];
  const yourNewDisplays: Tile[][] = [
    ...gameDataState.shownTiles[stateTransition.body.playerTo],
    newDisplay,
  ];
  const newShownTiles: { [userId: string]: Tile[][] } = {
    ...gameDataState.shownTiles,
  };
  newShownTiles[stateTransition.body.playerTo] = yourNewDisplays;

  if (stateTransition.body.isSending) {
    const newHand: Tile[] = [...gameDataState.yourHand];
    for (let i = 0; i < stateTransition.body?.triple?.length; i++) {
      const tripleTile = stateTransition.body?.triple[i];
      if (!tileEqual(tripleTile, chiTile)) {
        const tripleInd = newHand.findIndex((t) => tileEqual(t, tripleTile));
        newHand.splice(tripleInd, 1);
      }
    }

    // send to peers
    const toSendStateTransition: PlayerAction = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
      },
    };
    sendToEveryone(peers, JSON.stringify(toSendStateTransition));

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
      shownTiles: newShownTiles,
    };
  }
}

function peng(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  if (
    stateTransition.body.triple === undefined ||
    stateTransition.body.playerTo === undefined ||
    stateTransition.body.playerFrom === undefined
  ) {
    throw Error('triple, playerTo, or playerFrom is undefined');
  }

  const currentPlayerId: string = stateTransition.body.playerFrom;
  const currentPlayerDiscards: Tile[] = gameDataState.discards[currentPlayerId];
  const pengTile: Tile =
    currentPlayerDiscards[currentPlayerDiscards.length - 1];
  const newCurrentPlayerDiscards: Tile[] = currentPlayerDiscards.slice(
    0,
    currentPlayerDiscards.length - 1,
  );
  const newDiscards: { [userId: string]: Tile[] } = {
    ...gameDataState.discards,
  };
  newDiscards[currentPlayerId] = newCurrentPlayerDiscards;

  const newDisplay: Tile[] = [...stateTransition.body.triple];
  const yourNewDisplays: Tile[][] = [
    ...gameDataState.shownTiles[stateTransition.body.playerTo],
    newDisplay,
  ];
  const newShownTiles: { [userId: string]: Tile[][] } = {
    ...gameDataState.shownTiles,
  };
  newShownTiles[stateTransition.body.playerTo] = yourNewDisplays;

  if (stateTransition.body.isSending) {
    const newHand: Tile[] = [...gameDataState.yourHand];
    for (let i = 0; i < stateTransition.body?.triple?.length; i++) {
      const tripleTile = stateTransition.body?.triple[i];
      if (!tileEqual(tripleTile, pengTile)) {
        const tripleInd = newHand.findIndex((t) => tileEqual(t, tripleTile));
        newHand.splice(tripleInd, 1);
      }
    }

    // send to peers
    const toSendStateTransition: PlayerAction = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
      },
    };
    sendToEveryone(peers, JSON.stringify(toSendStateTransition));

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
      shownTiles: newShownTiles,
    };
  }
}

function gang(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  if (
    stateTransition.body.quad === undefined ||
    stateTransition.body.playerTo === undefined ||
    stateTransition.body.playerFrom === undefined
  ) {
    throw Error('triple, playerTo, or playerFrom is undefined');
  }

  const currentPlayerId: string = stateTransition.body.playerFrom;
  const currentPlayerDiscards: Tile[] = gameDataState.discards[currentPlayerId];
  const pengTile: Tile =
    currentPlayerDiscards[currentPlayerDiscards.length - 1];
  const newCurrentPlayerDiscards: Tile[] = currentPlayerDiscards.slice(
    0,
    currentPlayerDiscards.length - 1,
  );
  const newDiscards: { [userId: string]: Tile[] } = {
    ...gameDataState.discards,
  };
  newDiscards[currentPlayerId] = newCurrentPlayerDiscards;

  const newDisplay: Tile[] = [...stateTransition.body.quad];
  const yourNewDisplays: Tile[][] = [
    ...gameDataState.shownTiles[stateTransition.body.playerTo],
    newDisplay,
  ];
  const newShownTiles: { [userId: string]: Tile[][] } = {
    ...gameDataState.shownTiles,
  };
  newShownTiles[stateTransition.body.playerTo] = yourNewDisplays;

  // draw card from deck for gang
  const deck: Tile[] = gameDataState.deck;
  const newDeck: Tile[] = deck.slice(0, deck.length - 1);

  if (stateTransition.body.isSending) {
    const newHand: Tile[] = [...gameDataState.yourHand];
    for (let i = 0; i < stateTransition.body.quad.length; i++) {
      const quadTile = stateTransition.body.quad[i];
      if (!tileEqual(quadTile, pengTile)) {
        const quadInd = newHand.findIndex((t) => tileEqual(t, quadTile));
        newHand.splice(quadInd, 1);
      }
    }

    // draw card is needed for gang, since we remove 4
    const lastTile: Tile = deck[deck.length - 1];
    newHand.push(lastTile);

    // send to peers
    const toSendStateTransition: PlayerAction = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
      },
    };
    sendToEveryone(peers, JSON.stringify(toSendStateTransition));

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
    };
  }
}

function replaceFlower(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  if (isSending === true) {
    const { tile } = stateTransition.body;
    if (tile === undefined) {
      throw Error('tile is undefined.');
    }
    const { yourHand, deck, discards, yourPlayerId } = gameDataState;
    const handIdx = yourHand.findIndex((t) => tileEqual(t, tile));
    const newHand = [
      ...yourHand.slice(0, handIdx),
      ...yourHand.slice(handIdx + 1),
      deck[0],
    ];

    const deckIdx = deck.findIndex((t) => tileEqual(t, tile));
    const newDeck = [...deck.slice(1, deckIdx), ...deck.slice(deckIdx + 1)];

    const newDiscards = {
      ...discards,
      [yourPlayerId]: [...discards[yourPlayerId], tile],
    };

    const newStateTransition = {
      ...stateTransition,
      body: { isSending: false, deck: newDeck, discards: newDiscards },
    };
    sendToEveryone(peers, JSON.stringify(newStateTransition));
    return {
      ...gameDataState,
      discards: newDiscards,
      deck: newDeck,
      yourHand: newHand,
    };
  } else {
    const { deck, discards } = stateTransition.body;
    if (deck === undefined || discards === undefined) {
      throw Error('deck or discards is undefined.');
    }
    return { ...gameDataState, discards: discards, deck: deck };
  }
}

function initGame(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  if (isSending === true) {
    const { allPlayerIds, deck, yourPlayerId } = gameDataState;
    let newDeck = deck;
    newDeck = randomizeDeck([...deck]);

    const hands: { [playerId: string]: Tile[] } = {};
    for (const playerId in allPlayerIds) {
      const hand = newDeck.slice(newDeck.length - 13); // get the top 13 cards in deck
      newDeck = newDeck.slice(0, newDeck.length - 13);
      hands[playerId] = hand;
    }
    const newStateTransition = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
        hands: hands,
        deck: newDeck,
      },
    };
    sendToEveryone(peers, JSON.stringify(newStateTransition));
    return {
      ...gameDataState,
      deck: newDeck,
      yourHand: hands[yourPlayerId],
    };
  } else {
    const { hands, deck } = stateTransition.body;
    if (hands === undefined || deck === undefined) {
      throw Error('hands or deck is undefined.');
    }
    const { yourPlayerId } = gameDataState;
    return {
      ...gameDataState,
      deck: deck,
      yourHand: hands[yourPlayerId],
    };
  }
}

function setPlayerId(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  const { signalIds, userId } = stateTransition.body;
  if (signalIds === undefined || userId === undefined || peers === undefined) {
    throw Error('SignalIds, userId or peers is undefined');
  }
  const playerIds = signalIds;
  const sortedPlayerIds: string[] = playerIds.sort(compStr); // sort by id, the order of the array gives the turn order
  let currentPlayerId: string = sortedPlayerIds[0];
  let currentPlayerIndex = 0;
  if (currentPlayerId === userId) {
    // we're sending the deck to the next player
    currentPlayerId = sortedPlayerIds[1];
    currentPlayerIndex = 1;
  }
  return {
    ...gameDataState,
    allPlayerIds: sortedPlayerIds,
    yourPlayerId: userId,
    currentTurn: currentPlayerId,
    currentPlayerIndex: currentPlayerIndex,
  };
}

function hu(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  const { yourPlayerId, yourHand, score } = gameDataState;
  let newScore = score;
  if (!(yourPlayerId in score)) {
    const newScore = { ...score, [yourPlayerId]: calculateScore(yourHand) };
    const newStateTransition = {
      ...stateTransition,
      body: {
        score: newScore,
      },
    };
    sendToEveryone(peers, JSON.stringify(newStateTransition));
  }
  if (isSending === true) {
    return {
      ...gameDataState,
      score: newScore,
    };
  } else {
    const { score } = stateTransition.body;
    if (score === undefined) {
      throw Error('score is undefined.');
    }
    newScore = { ...newScore, ...score };
    return {
      ...gameDataState,
      score: newScore,
    };
  }
}

export function updateGameDataState(
  currentGameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
): GameDataState {
  switch (stateTransition.action) {
    case ActionType.DrawTile:
      return drawTile(currentGameDataState, stateTransition, peers);
    case ActionType.PlaceTile:
      return placeTile(currentGameDataState, stateTransition, peers);
    case ActionType.Chi:
      return chi(currentGameDataState, stateTransition, peers);
    case ActionType.Peng:
      return peng(currentGameDataState, stateTransition, peers);
    case ActionType.Gang:
      return gang(currentGameDataState, stateTransition, peers);
    case ActionType.ReplaceFlower:
      return replaceFlower(currentGameDataState, stateTransition, peers);
    case ActionType.InitGame:
      return initGame(currentGameDataState, stateTransition, peers);
    case ActionType.Hu:
      return hu(currentGameDataState, stateTransition, peers);
    case ActionType.SetPlayerId:
      return setPlayerId(currentGameDataState, stateTransition, peers);
    default:
      return currentGameDataState;
  }
}
