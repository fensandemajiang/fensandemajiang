import { GameDataState, ActionType, PlayerAction } from '../../types';

function drawTile(gameDataState: GameDataState) {
}

function placeTile(gameDataState: GameDataState) {
} 

function chi(gameDataState: GameDataState) {
} 

function peng(gameDataState: GameDataState) {
} 

function gang(gameDataState: GameDataState) {
} 

function replaceFlower(gameDataState: GameDataState) {
} 

function initGame(gameDataState: GameDataState) {
} 

function SetPlayerId(gameDataState: GameDataState) {
} 

function hu(gameDataState: GameDataState) {
} 

export function updateGameDataState(currentGameDataState: GameDataState, stateTransition: PlayerAction): GameDataState {
  switch (stateTransition.action) {
    case ActionType.DrawTile:
      return drawTile(currentgameDataState);
      break;
    case ActionType.PlaceTile:
      return placeTile(currentgameDataState);
      break;
    case ActionType.Chi:
      return chi(currentgameDataState);
      break;
    case ActionType.Peng:
      return peng(currentgameDataState);
      break;
    case ActionType.Gang:
      return gang(currentgameDataState);
      break;
    case ActionType.ReplaceFlower:
      return replaceFlower(currentgameDataState);
      break;
    case ActionType.InitGame:
      return initGame(currentgameDataState);
      break;
    case ActionType.Hu:
      return hu(currentgameDataState);
      break;
    case ActionType.SetPlayerId:
      return SetPlayerId(currentgameDataState);
      break;
    default:
      console.log("wtf");
  }
}
