// import { GameDataState, GameState, Action, Tile } from '../../types';
// import { amCurrentPlayer } from '../../utils/utilFunc';
// import { findGrouping, hasWon } from './GameFunctions';
// import { useGameDataStore } from '../../utils/store';
// import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
// import {
//   giveDeck,
//   updateGameState,
//   sendPlaceTile,
//   updateCurrentPlayerIndex,
// } from './playerActions';
// export const updateGameDataState = (
//   gameDataState: GameDataState,
//   gameState: GameState,
//   peers: { [userId: string]: SimplePeer.Instance },
// ): void => {
//   switch (gameState) {
//     case GameState.DrawPlayCard:
//       if (
//         amCurrentPlayer(
//           gameDataState.yourPlayerId,
//           gameDataState.currentPlayerIndex,
//           gameDataState.allPlayerIds,
//         )
//       ) {
//         let newDeck: Tile[] = [...gameDataState.deck];
//         const newHand: Tile[] = [...gameDataState.yourHand];
//
//         // only draw card if hand has 13 cards, we sometimes just chi or peng. So, we may not need to draw card
//         if (newHand.length <= 13) {
//           const drawnCard: Tile = newDeck[newDeck.length - 1]; // TODO: check deck is empty and if so, end the game
//           newDeck = newDeck.slice(0, newDeck.length - 1); // remove last element
//           newHand.push(drawnCard);
//           // display new hand
//
//           // do we even need to update store here? probably not necessary so will remove for now
//           /*
//             useGameDataStore.setState({
//               ...useGameDataStore.getState(),
//               gameDataState: {
//                 ...gameDataState,
//                 deck: newDeck,
//                 yourHand: newHand
//               }
//             });
//             */
//         }
//
//         // user has won?
//         // returns amount of points won (if user won)
//         const wonAmount: number = hasWon(gameDataState.yourHand);
//         if (wonAmount !== -1) {
//           //exit game...somehow
//         }
//
//         // render something to tell player to choose card to discard
//         // block this function somehow? or move the rest of this functionality into some button?
//         // most of this should probably get moved to some sort of callback function that runs if user decides to chi
//         // once user has selected tile to discard, continue on
//
//         // this is placeholder logic, until we actually implement how to discard tile
//         const tileToDiscardIndex = 0;
//         const discardedTile: Tile = newHand[tileToDiscardIndex];
//         newHand.splice(tileToDiscardIndex, 1);
//         const newDiscards = { ...gameDataState.discards };
//         newDiscards[gameDataState.yourPlayerId].push(discardedTile);
//
//         useGameDataStore.setState({
//           ...useGameDataStore.getState(),
//           gameDataState: {
//             ...gameDataState,
//             yourHand: newHand,
//             discards: newDiscards,
//           },
//         });
//
//         giveDeck(peers, newDeck, '');
//         sendPlaceTile(peers, discardedTile);
//         updateGameState(peers, GameState.PengGang);
//       } else {
//         // not the current player who drew a card, should probably still render some sort of animation for the other player?
//       }
//       break;
//     case GameState.PengGang:
//       // if not current player, aka i'm not the player who just played the tile, and so i can peng/gang it
//       if (
//         !amCurrentPlayer(
//           gameDataState.yourPlayerId,
//           gameDataState.currentPlayerIndex,
//           gameDataState.allPlayerIds,
//         )
//       ) {
//         // wait 3 seconds
//         // most of this should probably get moved to some sort of callback function that runs if user decides to chi
//
//         //if we peng/gang, we have to update newCurrPlayerInd to us.
//         // logic here can be largely copied from chi
//
//         updateGameState(peers, GameState.Chi);
//       }
//       break;
//     case GameState.Chi:
//       // if not current player, aka i'm not the player who just played the tile, and so i can peng/gang it
//       if (
//         !amCurrentPlayer(
//           gameDataState.yourPlayerId,
//           gameDataState.currentPlayerIndex,
//           gameDataState.allPlayerIds,
//         )
//       ) {
//         // wait 5 seconds
//
//         const newCurrPlayerInd = gameDataState.currentPlayerIndex + 1;
//
//         // some more placeholder logic to help out
//         // most of this should probably get moved to some sort of callback function that runs if user decides to chi
//         const currPlayerId: string =
//           gameDataState.allPlayerIds[gameDataState.currentPlayerIndex % 4];
//         const currPlayerDiscards: Tile[] = gameDataState.discards[currPlayerId];
//         const mostRecentDiscarded: Tile =
//           currPlayerDiscards[currPlayerDiscards.length - 1];
//
//         // display each of these groups as an option to user to select
//         // user has to decide how to chi
//         const group: number[][] = findGrouping(
//           [...gameDataState.yourHand, mostRecentDiscarded],
//           Action.Chi,
//           mostRecentDiscarded,
//         );
//         const selectedChiGroupIndex = 0; // this is the index of the group the user selected
//         const valSortedChiGroup: number[] = group[selectedChiGroupIndex];
//
//         /*
//           const findSortedChiGroup: number[] = valSortedChiGroup.sort().reverse();
//           if (userConsumesTile) {
//             // if we consume the tile
//             var newHand: Tile[] = [
//               ...gameDataState.yourHand,
//               mostRecentDiscarded,
//             ];
//             const newDiscards = { ...gameDataState.discards };
//             newDiscards[currPlayerId] = currPlayerDiscards.slice(
//               0,
//               currPlayerDiscards.length - 1,
//             );
//
//             const newMyToShowTiles: Tile[][] =
//               [...gameDataState.shownTiles[gameDataState.yourPlayerId],
//                  [newHand[valSortedChiGroup[0]],
//                   newHand[valSortedChiGroup[1]],
//                   newHand[valSortedChiGroup[2]]]
//               ];
//             var newToShowTiles: { [userId: string]: Tile[][] } = { ...gameDataState.shownTiles };
//             newToShowTiles[gameDataState.yourPlayerId] = newMyToShowTiles;
//
//             // removes tiles from hand
//             newHand.splice(findSortedChiGroup[0], 1);
//             newHand.splice(findSortedChiGroup[1], 1);
//             newHand.splice(findSortedChiGroup[2], 1);
//
//             useGameDataStore.setState({
//               ...useGameDataStore.getState(),
//               gameDataState: {
//                 ...gameDataState,
//                 yourHand: newHand,
//                 discards: newDiscards,
//                 shownTiles: newToShowTiles
//               },
//             });
//
//             //if we chi, we have to update newCurrPlayerInd to us.
//             updateCurrentPlayerIndex(
//               peers,
//               gameDataState.allPlayerIds.indexOf(gameDataState.yourPlayerId),
//             );
//
//             sendConsumeTile(
//               peers,
//               Action.Chi,
//               currPlayerId,
//               gameDataState.yourPlayerId,
//               mostRecentDiscarded,
//             );
//           } else {*/
//         updateCurrentPlayerIndex(peers, newCurrPlayerInd);
//         //}
//         updateGameState(peers, GameState.DrawPlayCard);
//       }
//       break;
//   }
// };
