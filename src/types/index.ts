/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends U, U> = T | (U & {});

export interface ConnectionState {
  signalIDs: string[],
  userID: string
}

export interface GameDataState {
  deck: Tile[],
  discards: { [userId: string]: Tile[] },
  shownTiles: { [userId: string]: Tile[][] },
  flowers: { [userId: string]: Tile[] },
  yourHand: Tile[],
  allPlayerIds: string[],
  yourPlayerId: string,
  currentTurn: string,
  currentPlayerIndex: number
}

export enum Action {
  DrawTile = 1,
  PlaceTile,
  Chi,
  Peng,
  Gang,
  ShowFlower,
  ReplaceFlower
}

export interface PlayerAction {
  action: Action
  body: {
    tile?: Tile
    playerFrom?: string
    playerTo?: string
  }
}

export enum Suite {
  Wan = 1, // character
  Tong, // dots
  Tiao, // bamboo
  Winds,
  Dragons,
  Flowers
}

export interface Tile {
  suite: Suite
  value?: number
  wind?: string
  dragon?: string
  flower?: string
}
