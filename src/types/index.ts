/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends U, U> = T | (U & {});

export interface ConnectionState {
  signalIDs: string[];
  userID: string;
}

export interface GameDataState {
  deck: Tile[];
  discards: { [userId: string]: Tile[] };
  shownTiles: { [userId: string]: Tile[][] };
  flowers: { [userId: string]: Tile[] };
  yourHand: Tile[];
  allPlayerIds: string[];
  yourPlayerId: string;
  currentTurn: string;
  currentPlayerIndex: number;
  currentState: GameState;
  roundNumber: number;
  playerWithDeck: string; // empty string or null if no player has deck
}

export enum GameState {
  ShuffleDeck = "ShuffleDeck",
  DrawPlayCard = "DrawPlayCard",
  PengGang = "PengGang",
  Chi = "Chi"
}

export enum Action {
  DrawTile = 1,
  PlaceTile,
  Chi,
  Peng,
  Gang,
  ShowFlower,
  ReplaceFlower,
  GiveDeck,
  GiveHand,
  UpdateGameState,
  UpdateCurrentPlayerIndex,
}

export interface PlayerAction {
  action: Action;
  body: {
    tile?: Tile;
    deck?: Tile[];
    playerFrom?: string;
    playerTo?: string;
    gameState?: string;
    playerIndex?: number;
  };
}

export enum Suite {
  Wan = 1, // character
  Tong, // dots
  Tiao, // bamboo
  Winds,
  Dragons,
  Flowers,
}

export enum Wind {
  North = 'North',
  South = 'South',
  East = 'East',
  West = 'West',
}

export enum Dragon {
  Red = 'Red',
  White = 'White',
  Green = 'Green',
}

export enum Flower {
  Summer = 'Summer',
  Fall = 'Fall',
  Winter = 'Winter',
  Spring = 'Spring',
  Bamboo = 'Bamboo',
  Chrys = 'Chrys',
  Orchid = 'Orchid',
  Plum = 'Plum',
}

export interface Tile {
  suite: Suite;
  value?: number;
  wind?: Wind;
  dragon?: Dragon;
  flower?: Flower;
}
