/** https://github.com/Microsoft/TypeScript/issues/29729 */
export type LiteralUnion<T extends U, U> = T | (U & {});

export interface ConnectionState {
  signalIDs: { [key: number]: string}, //length 3, one for each possible opponent
  userID: number
}
