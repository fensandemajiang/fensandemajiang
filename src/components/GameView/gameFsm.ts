import { GameDataState, ActionType, PlayerAction } from '../../types';

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
  return gameDataState;
}

function hu(
  gameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  return gameDataState;
}

export function updateGameDataState(
  currentGameDataState: GameDataState,
  stateTransition: PlayerAction,
): GameDataState {
  switch (stateTransition.action) {
    case ActionType.DrawTile:
<<<<<<< HEAD
      return drawTile(currentGameDataState);
      break;
    case ActionType.PlaceTile:
      return placeTile(currentGameDataState);
      break;
    case ActionType.Chi:
      return chi(currentGameDataState);
      break;
    case ActionType.Peng:
      return peng(currentGameDataState);
      break;
=======
      return drawTile(currentGameDataState, stateTransition);
    case ActionType.PlaceTile:
      return placeTile(currentGameDataState, stateTransition);
    case ActionType.Chi:
      return chi(currentGameDataState, stateTransition);
    case ActionType.Peng:
      return peng(currentGameDataState, stateTransition);
>>>>>>> 122d4755857fa33b5570845d586b4deb3d917440
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
