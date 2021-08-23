/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends U, U> = T | (U & {});

export interface DbConnectDetail {
  to: string;
  from: string;
  data: string;
  _id: string;
}

export interface DbConnectionPlayer {
  playerId: string;
  ready: boolean;
  _id: string;
}

import type { Client, Identity } from '@textile/hub';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
export interface ConnectionState {
  signalIDs: string[];
  userID: string;
  userConnectedCount: number;
  client: Client;
  identity: Identity;
  threadId: string;
  peers: { [userId: string]: SimplePeer.Instance };
  returnedConnectionIds: string[];
  receivedResponse: { [eventId: string]: boolean };
}
export enum UserConnectionState {
  Connected,
  NotConnected,
}
export interface Score {
  [userId: string]: number;
}

export interface GameDataState {
  deck: Tile[];
  discards: { [userId: string]: Tile[] };
  shownTiles: { [userId: string]: Tile[][] };
  flowers: { [userId: string]: Tile[] };
  yourHand: Tile[];
  allPlayerIds: string[];
  yourPlayerId: string;
  currentTurn: string; // id of current player
  currentPlayerIndex: number;
  currentState: GameState;
  roundNumber: number;
  //playerWithDeck: string; // empty string or null if no player has deck
  previousIpfsCid: string;
  score: Score;
}

export interface BetState {
  bettingEnabled: boolean;
  betAmount: number;
  betPaidOut: boolean;
}

export interface ImageMetadata {
  src: string;
  mimeType: string;
  width: number;
  height: number;
  size?: number;
}

export interface ImageSources {
  original: ImageMetadata;
  alternatives?: ImageMetadata[];
}

export interface CryptoAccounts {
  readonly [accountId: string]: string;
}

export interface BasicProfile {
  name?: string;
  description?: string;
  emoji?: string;
  birthDate?: string;
  url?: string;
  gender?: string;
  homeLocation?: string;
  residenceCountry?: string;
  nationalitiies?: string[];
  affiliations?: string[];
  image?: ImageSources;
  background?: ImageSources;
}

import type { IDX } from '@ceramicstudio/idx';
import type Ceramic from '@ceramicnetwork/http-client';
import type { DID } from 'dids';
export interface UserState {
  loggedIn: boolean;
  cryptoAccounts?: CryptoAccounts;
  profile?: BasicProfile;
  did?: DID;
  ceramic?: Ceramic;
  idx?: IDX;
}

export enum GameState {
  Start = 'Start',
  ShuffleDeck = 'ShuffleDeck',
  DrawCard = 'DrawCard',
  PlayCard = 'PlayCard',
  PengGang = 'PengGang',
  Chi = 'Chi',
  Hu = 'Hu',
}

export enum ActionType {
  DrawTile = 1,
  PlaceTile,
  Chi,
  Peng,
  Gang,
  ReplaceFlower,
  InitGame,
  Hu,
  NoChi,
  NoPengGang,
  SetPlayerId,
}
export interface Peers {
  [userId: string]: SimplePeer.Instance;
}

export enum EventType {
  Request,
  Response,
}

export interface IncompleteEvent {
  eventType: EventType;
  requester: string;
  responder?: string;
  body: string;
}
export interface Event {
  eventType: EventType;
  eventId: string;
  requester: string;
  responder: string;
  body: string;
}

export interface PlayerAction {
  action: ActionType;
  body: {
    tile?: Tile;
    deck?: Tile[];
    discards?: { [userId: string]: Tile[] };
    shownTiles?: { [userId: string]: Tile[][] };
    triple?: Tile[]; // used for chi and peng
    quad?: Tile[]; // used for gang
    playerFrom?: string;
    playerTo?: string;
    gameState?: string;
    playerIndex?: number;
    ipfsCid?: string;
    signalIds?: string[];
    userId?: string;
    isSending?: boolean;
    hands?: { [playerId: string]: Tile[] };
    score?: Score;
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
