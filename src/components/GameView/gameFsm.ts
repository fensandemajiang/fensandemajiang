import { GameDataState, ActionType, PlayerAction, Tile } from '../../types';
import { compStr } from '../../utils/utilFunc';
import { calculateScore, randomizeDeck } from './GameFunctions';

function drawTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

function placeTile(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

function chi(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

function peng(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

function gang(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
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
