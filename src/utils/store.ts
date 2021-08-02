import create, { SetState } from 'zustand';
import type { ConnectionState, GameDataState } from '../types';

export type ConnectionDataStore = {
  connectionState: ConnectionState;
  updateConnectionState: (connectionState: ConnectionState) => void;
};

const initialConnectionDataState: ConnectionState = {
  signalIDs: [],
  userID: '',
};

export const useConnectionStore = create<ConnectionDataStore>(
  (set: SetState<ConnectionDataStore>) => ({
    connectionState: initialConnectionDataState,
    updateConnectionState: (connectionState: ConnectionState) =>
      set({ connectionState }),
  }),
);

export type GameDataStore = {
  gameDataState: GameDataState;
  updateGameDataState: (gameDataState: GameDataState) => void;
};

const initialGameDataState: GameDataState = {
  deck: [],
  discards: {},
  shownTiles: {},
  flowers: {},
  yourHand: [],
  allPlayerIds: [],
  yourPlayerId: '',
  currentTurn: '', //userId of current player
  currentPlayerIndex: 0,
};

export const useGameDataStore = create<GameDataStore>(
  (set: SetState<GameDataStore>) => ({
    gameDataState: initialGameDataState,
    updateGameDataState: (gameDataState: GameDataState) =>
      set({ gameDataState }),
  }),
);
