import create, { SetState } from 'zustand';
import { Suite, Dragon, Flower, Wind, GameState, UserState } from '../types';
import type { ConnectionState, GameDataState, Tile, BetState } from '../types';
import { Client, PrivateKey } from '@textile/hub';
import { devtools } from 'zustand/middleware';

export type ConnectionDataStore = {
  connectionState: ConnectionState;
  updateConnectionState: (connectionState: ConnectionState) => void;
};

const initialConnectionDataState: ConnectionState = {
  signalIDs: [],
  userID: '',
  userConnectedCount: 0,
  client: new Client(),
  identity: PrivateKey.fromRandom(),
  threadId: '',
  peers: {},
  returnedConnectionIds: [],
  recievedResponse: false,
};

export const useConnectionStore = create<ConnectionDataStore>(
  devtools((set: SetState<ConnectionDataStore>) => ({
    connectionState: initialConnectionDataState,
    updateConnectionState: (connectionState: ConnectionState) =>
      set({ connectionState }),
  })),
);

export type GameDataStore = {
  gameDataState: GameDataState;
  updateGameDataState: (gameDataState: GameDataState) => void;
};

const initDeck: Tile[] = ((): Tile[] => {
  const deck: Tile[] = [];
  for (let num = 1; num <= 9; num++) {
    // face value
    for (const suite of [Suite.Wan, Suite.Tong, Suite.Tiao]) {
      // suite
      for (let count = 0; count < 4; count++) {
        // count
        deck.push({
          suite: suite,
          value: num,
        });
      }
    }
  }

  // fill in dragons
  for (const dragon in Object.keys(Dragon)) {
    // face value
    for (let count = 0; count < 4; count++) {
      //count
      deck.push({
        suite: Suite.Dragons,
        dragon: dragon as Dragon,
      });
    }
  }

  // fill in winds
  for (const wind of Object.keys(Wind)) {
    for (let count = 0; count < 4; count++) {
      deck.push({
        suite: Suite.Winds,
        wind: wind as Wind,
      });
    }
  }

  // fill in flowers
  for (const flower of Object.keys(Flower)) {
    deck.push({
      suite: Suite.Flowers,
      flower: flower as Flower,
    });
  }

  return deck;
})();

const initialGameDataState: GameDataState = {
  deck: initDeck,
  discards: {},
  shownTiles: {},
  flowers: {},
  yourHand: [],
  allPlayerIds: [],
  yourPlayerId: '',
  currentTurn: '', //userId of current player
  currentPlayerIndex: 0,
  currentState: GameState.Start,
  roundNumber: 0,
  previousIpfsCid: '',
  score: {},
};

export const useGameDataStore = create<GameDataStore>(
  devtools((set: SetState<GameDataStore>) => ({
    gameDataState: initialGameDataState,
    updateGameDataState: (gameDataState: GameDataState) =>
      set({ gameDataState }),
  })),
);

export type UserStore = {
  userState: UserState;
  updateUserState: (userState: UserState) => void;
};
const initialUserState: UserState = {
  loggedIn: false,
  cryptoAccounts: undefined,
  profile: undefined,
  did: undefined,
  ceramic: undefined,
  idx: undefined,
};

export const useUserStore = create<UserStore>(
  devtools((set: SetState<UserStore>) => ({
    userState: initialUserState,
    updateUserState: (userState: UserState) => set({ userState }),
  })),
);

export type BetStore = {
  betState: BetState;
  updateBetState: (betState: BetState) => void;
};
const initialBetState: BetState = {
  bettingEnabled: false,
  betAmount: 0,
  betPaidOut: false,
};

export const useBetStore = create<BetStore>(
  devtools((set: SetState<BetStore>) => ({
    betState: initialBetState,
    updateBetState: (betState: BetState) => set({ betState }),
  })),
);
