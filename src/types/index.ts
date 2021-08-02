/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends U, U> = T | (U & {});

export interface ConnectionState {
  signalIDs: number[],
  userID: number
}

export enum Action {
  DrawTile = 1,
  PlaceTile,
  Chi,
  Kong,
  Pang,
  Gang,
  ShowFlower,
  ReplaceFlower
}

export interface PlayerAction {
  action: Action
  body?: {
    tile?: Tile
    playerFrom?: number
    playerTo?: number
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
  dragon: string
  flower: string
}
