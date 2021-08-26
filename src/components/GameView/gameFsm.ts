import {
  GameDataState,
  ActionType,
  PlayerAction,
  Tile,
  Peers,
  GameState,
  IncompleteEvent,
  EventType,
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

async function drawTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
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
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(toSendStateTransition),
    };
    await sendToEveryone(peers, event);

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

async function placeTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
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
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(toSendStateTransition),
    };
    await sendToEveryone(peers, event);

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

async function chi(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
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
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(toSendStateTransition),
    };
    await sendToEveryone(peers, event);

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

async function peng(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
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
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(toSendStateTransition),
    };
    await sendToEveryone(peers, event);

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

async function gang(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
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
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(toSendStateTransition),
    };
    await sendToEveryone(peers, event);

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

async function replaceFlower(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  if (isSending === true) {
    const { tile } = stateTransition.body;
    if (tile === undefined) {
      throw Error('tile is undefined.');
    }
    const { yourHand, deck, shownTiles, yourPlayerId } = gameDataState;
    const handIdx = yourHand.findIndex((t) => tileEqual(t, tile));
    const newHand = [
      ...yourHand.slice(0, handIdx),
      ...yourHand.slice(handIdx + 1),
      deck[0],
    ];

    const newDeck = deck.slice(1);

    const newTileGroup = [tile];
    const newShownTiles = {
      ...shownTiles,
      [yourPlayerId]: [...shownTiles[yourPlayerId], newTileGroup],
    };

    const newStateTransition = {
      ...stateTransition,
      body: { isSending: false, deck: newDeck, shownTiles: newShownTiles },
    };
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(newStateTransition),
    };
    await sendToEveryone(peers, event);
    return {
      ...gameDataState,
      shownTiles: newShownTiles,
      deck: newDeck,
      yourHand: newHand,
    };
  } else {
    const { deck, shownTiles } = stateTransition.body;
    if (deck === undefined || shownTiles === undefined) {
      throw Error('deck or discards is undefined.');
    }
    return { ...gameDataState, shownTiles: shownTiles, deck: deck };
  }
}

async function initGame(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  if (isSending === true) {
    const { allPlayerIds, deck, yourPlayerId } = gameDataState;
    let newDeck = deck;
    newDeck = randomizeDeck([...deck]);

    const hands: { [userId: string]: Tile[] } = {};
    for (const playerId of allPlayerIds) {
      const hand = newDeck.slice(newDeck.length - 13); // get the top 13 cards in deck
      newDeck = newDeck.slice(0, newDeck.length - 13);
      hands[playerId] = hand;
    }
    const stateTransitionHands = Object.assign({}, hands);
    const retHands = Object.assign({}, hands);
    const newStateTransition = {
      ...stateTransition,
      body: {
        ...stateTransition.body,
        isSending: false,
        hands: stateTransitionHands,
        deck: newDeck,
      },
    };
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(newStateTransition),
    };
    await sendToEveryone(peers, event);
    return {
      ...gameDataState,
      deck: Array.from(newDeck),
      yourHand: Array.from(retHands[yourPlayerId]),
      currentState: GameState.DrawCard,
    };
  } else {
    const { hands, deck } = stateTransition.body;
    if (hands === undefined || deck === undefined) {
      throw Error('hands or deck is undefined.');
    }
    const retHands = Object.assign({}, hands);
    const { yourPlayerId } = gameDataState;
    const _yourHand = Array.from(retHands[yourPlayerId]);
    return {
      ...gameDataState,
      deck: Array.from(deck),
      yourHand: _yourHand,
      currentState: GameState.DrawCard,
    };
  }
}

async function setPlayerId(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
  const { signalIds, userId: yourPlayerId } = stateTransition.body;
  if (signalIds === undefined || yourPlayerId === undefined) {
    throw Error('SignalIds or yourPlayerId is undefined');
  }
  const playerIds = signalIds;
  const sortedPlayerIds: string[] = playerIds.sort(compStr); // sort by id, the order of the array gives the turn order
  const currentPlayerId: string = sortedPlayerIds[0];
  const currentPlayerIndex = 0;
  const shownTiles = Object.fromEntries(
    playerIds.map((player) => [player, []]),
  );
  const discards = Object.assign({}, shownTiles);
  const flowers = Object.assign({}, shownTiles);
  return {
    ...gameDataState,
    allPlayerIds: sortedPlayerIds,
    yourPlayerId: yourPlayerId,
    currentTurn: currentPlayerId,
    currentPlayerIndex: currentPlayerIndex,
    currentState: GameState.ShuffleDeck,
    shownTiles: shownTiles,
    flowers: flowers,
    discards: discards,
  };
}

async function hu(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
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
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(newStateTransition),
    };
    await sendToEveryone(peers, event);
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
async function noDeclare(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
  isChi: boolean,
): Promise<GameDataState> {
  const { isSending } = stateTransition.body;
  if (isSending === undefined) {
    throw Error('isSending is undefined.');
  }
  if (isSending === true) {
    const newStateTransition = {
      ...stateTransition,
      body: { isSending: false },
    };
    const event: IncompleteEvent = {
      eventType: EventType.Request,
      requester: userId,
      body: JSON.stringify(newStateTransition),
    };
    await sendToEveryone(peers, event);
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

async function updateGameDataState(
  currentGameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
): Promise<GameDataState> {
  const gameDataState = Object.assign({}, currentGameDataState);
  const transition = Object.assign({}, stateTransition);
  switch (stateTransition.action) {
    case ActionType.DrawTile:
      return await drawTile(gameDataState, transition, peers, userId);
    case ActionType.PlaceTile:
      return await placeTile(gameDataState, transition, peers, userId);
    case ActionType.Chi:
      return await chi(gameDataState, transition, peers, userId);
    case ActionType.Peng:
      return await peng(gameDataState, transition, peers, userId);
    case ActionType.Gang:
      return await gang(gameDataState, transition, peers, userId);
    case ActionType.ReplaceFlower:
      return await replaceFlower(gameDataState, transition, peers, userId);
    case ActionType.InitGame:
      return initGame(gameDataState, transition, peers, userId);
    case ActionType.Hu:
      return await hu(gameDataState, transition, peers, userId);
    case ActionType.SetPlayerId:
      return await setPlayerId(gameDataState, transition, peers, userId);
    case ActionType.NoChi:
      return await noDeclare(gameDataState, transition, peers, userId, true);
    case ActionType.NoPengGang:
      return await noDeclare(gameDataState, transition, peers, userId, false);
    default:
      return new Promise((resolve, reject) => resolve(currentGameDataState));
  }
}

export async function updateGameDataStateAndLog(
  currentGameDataState: GameDataState,
  stateTransition: PlayerAction,
  peers: Peers,
  userId: string,
  gameId: string,
): Promise<GameDataState> {
  return mutex.runExclusive(async () => {
    let _nextState;
    try {
      _nextState = await updateGameDataState(
        currentGameDataState,
        stateTransition,
        peers,
        userId,
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
    const nextState = Object.assign({}, _nextState);
    const obj = {
      logType: 'UPDATE_GAME_DATA_STATE',
      currentState: currentGameDataState.currentState.toString(),
      stateTransition: stateTransition,
      nextState: nextState,
    };
    console.dir(obj);
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
      console.log(
        'currState',
        currentState,
        'state trans',
        stateTransition.action,
      );
      throw Error('Invalid state transition');
  }
}
