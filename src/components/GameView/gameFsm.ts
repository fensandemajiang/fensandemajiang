import {
  GameDataState,
  ActionType,
  PlayerAction,
  Tile,
  Peers,
  GameState,
} from '../../types';
import { compStr } from '../../utils/utilFunc';
import {
  tileEqual,
  calculateScore,
  randomizeDeck,
  sendToEveryone,
} from './GameFunctions';
import { logStateInIpfs } from './ipfs';
import { Mutex } from 'async-mutex';

const mutex = new Mutex();

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
      currentState: GameState.PlayCard,
    };
  } else {
    return {
      ...gameDataState,
      deck: newDeck,
      currentState: GameState.PlayCard,
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
      currentState: GameState.PengGang,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      currentState: GameState.PengGang,
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

  const newCurrentTurn = stateTransition.body.playerTo;
  const newCurrentPlayerInd = gameDataState.allPlayerIds.findIndex(
    (playerId) => playerId === newCurrentTurn,
  );
  const newRoundNumber = gameDataState.roundNumber + 1;

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
      currentState: GameState.PlayCard,
      currentTurn: newCurrentTurn,
      currentPlayerIndex: newCurrentPlayerInd,
      roundNumber: newRoundNumber,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      currentState: GameState.PlayCard,
      currentTurn: newCurrentTurn,
      currentPlayerIndex: newCurrentPlayerInd,
      roundNumber: newRoundNumber,
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

  const newCurrentTurn = stateTransition.body.playerTo;
  const newCurrentPlayerInd = gameDataState.allPlayerIds.findIndex(
    (playerId) => playerId === newCurrentTurn,
  );
  const newRoundNumber = gameDataState.roundNumber + 1;

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
      currentState: GameState.PlayCard,
      currentTurn: newCurrentTurn,
      currentPlayerIndex: newCurrentPlayerInd,
      roundNumber: newRoundNumber,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      currentState: GameState.PlayCard,
      currentTurn: newCurrentTurn,
      currentPlayerIndex: newCurrentPlayerInd,
      roundNumber: newRoundNumber,
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

  const newCurrentTurn = stateTransition.body.playerTo;
  const newCurrentPlayerInd = gameDataState.allPlayerIds.findIndex(
    (playerId) => playerId === newCurrentTurn,
  );
  const newRoundNumber = gameDataState.roundNumber + 1;

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
      currentState: GameState.PlayCard,
      currentTurn: newCurrentTurn,
      currentPlayerIndex: newCurrentPlayerInd,
      roundNumber: newRoundNumber,
    };
  } else {
    return {
      ...gameDataState,
      discards: newDiscards,
      shownTiles: newShownTiles,
      deck: newDeck,
      currentState: GameState.PlayCard,
      currentTurn: newCurrentTurn,
      currentPlayerIndex: newCurrentPlayerInd,
      roundNumber: newRoundNumber,
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
  console.log(stateTransition);
  if (isSending === true) {
    const { allPlayerIds, deck, yourPlayerId } = gameDataState;
    let newDeck = deck;
    newDeck = randomizeDeck([...deck]);

    const hands: { [playerId: string]: Tile[] } = {};
    for (const playerId of allPlayerIds) {
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
      currentState: GameState.DrawCard,
    };
  } else {
    const { hands, deck } = stateTransition.body;
    if (hands === undefined || deck === undefined) {
      throw Error('hands or deck is undefined.');
    }
    const { yourPlayerId } = gameDataState;
    console.log(yourPlayerId, JSON.stringify(hands), hands[yourPlayerId]);
    return {
      ...gameDataState,
      deck: deck,
      yourHand: hands[yourPlayerId],
      currentState: GameState.DrawCard,
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
  const shownTiles = Object.fromEntries(
    playerIds.map((player) => [player, []]),
  );
  const discards = Object.assign({}, shownTiles);
  const flowers = Object.assign({}, shownTiles);
  return {
    ...gameDataState,
    allPlayerIds: sortedPlayerIds,
    yourPlayerId: userId,
    currentTurn: currentPlayerId,
    currentPlayerIndex: currentPlayerIndex,
    currentState: GameState.ShuffleDeck,
    shownTiles: shownTiles,
    flowers: flowers,
    discards: discards,
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
function noDeclare(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  isChi: boolean,
): GameDataState {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  if (isSending === true) {
    const newStateTransition = {
      ...stateTransition,
      body: { isSending: false },
    };
    sendToEveryone(peers, JSON.stringify(newStateTransition));
  }
  const nextState = isChi ? GameState.PengGang : GameState.DrawCard;
  const newCurrentPlayerInd: number =
    (gameDataState.currentPlayerIndex + (isChi ? 1 : 0)) % 4;
  const newCurrentTurn: string = gameDataState.currentTurn[newCurrentPlayerInd];
  return {
    ...gameDataState,
    currentState: nextState,
    currentPlayerIndex: newCurrentPlayerInd,
    currentTurn: newCurrentTurn,
  };
}

function updateGameDataState(
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
    case ActionType.NoChi:
      return noDeclare(currentGameDataState, stateTransition, peers, true);
    case ActionType.NoPengGang:
      return noDeclare(currentGameDataState, stateTransition, peers, false);
    default:
      return currentGameDataState;
  }
}

export async function updateGameDataStateAndLog(
  currentGameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  gameId: string,
): Promise<GameDataState> {
  return mutex.runExclusive(async () => {
    let nextState;
    try {
      nextState = updateGameDataState(
        currentGameDataState,
        stateTransition,
        peers,
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
    try {
      await logStateInIpfs(currentGameDataState, stateTransition, gameId);
    } catch (err) {
      console.error(err);
    }
    console.log(
      'UPDATE_GAME_DATA_STATE: ',
      currentGameDataState.currentState.toString(),
      JSON.stringify(stateTransition),
      JSON.stringify(nextState),
    );
    return nextState;
  });
}

export function stateTransitionAllowed(
  currentState: GameState,
  stateTransition: PlayerAction,
) {
  switch (stateTransition.action) {
    case ActionType.DrawTile:
      return currentState === GameState.DrawCard;
    case ActionType.PlaceTile:
      return currentState === GameState.PlayCard;
    case ActionType.Chi:
      return currentState === GameState.Chi;
    case ActionType.Peng:
      return currentState === GameState.PengGang;
    case ActionType.Gang:
      return currentState === GameState.PengGang;
    case ActionType.ReplaceFlower:
      return currentState === GameState.PlayCard;
    case ActionType.InitGame:
      return currentState === GameState.ShuffleDeck;
    case ActionType.Hu:
      return currentState === GameState.PlayCard;
    case ActionType.SetPlayerId:
      return currentState === GameState.Start;
    case ActionType.NoChi:
      return currentState === GameState.Chi;
    case ActionType.NoPengGang:
      return currentState === GameState.PengGang;
    default:
      throw Error('Invalid state transition');
  }
}
