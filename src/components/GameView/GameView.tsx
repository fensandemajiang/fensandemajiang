import React, { useEffect, useContext, FunctionComponent } from 'react';
import { useGameDataStore, useConnectionStore } from '../../utils/store';
import type SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import {
  compStr,
  getRandomInt,
  amCurrentPlayer,
  findGrouping,
} from '../../utils/utilFunc';
import {
  giveDeck,
  updateGameState,
  sendHand,
  sendPlaceTile,
  updateCurrentPlayerIndex,
  sendConsumeTile,
} from './playerActions';
import { PeerContext } from './PeerContextProvidor';
import { GameState, Action } from '../../types';
import type { Tile } from '../../types';
import './GameView.css';
import Board from "./Board/Board" 
import Deck from "./Deck/Deck"
import Sidebar from "../GlobalComponents/Sidebar/Sidebar"

const GameView: FunctionComponent = () => {
  const deck: Tile[] = useGameDataStore((state) => state.gameDataState.deck);
  const gameState: GameState = useGameDataStore(
    (state) => state.gameDataState.currentState,
  );
  const peers: { [userId: string]: SimplePeer.Instance } =
    useContext(PeerContext);

  function randomizeDeck(deck: Tile[]): Tile[] {
    const newDeck = [...deck];

    for (let t1 = 0; t1 < 143; t1++) {
      // this approach could technically swap a tile with itself, but that's going to be rare enough that I don't think it'll be important to worry about
      const t2 = getRandomInt(0, 143); // 144 total tiles in the deck
      [newDeck[t1], newDeck[t2]] = [newDeck[t2], newDeck[t1]]; //swap
    }

    return newDeck;
  }

  useEffect(() => {
    // initalize game state

    // set player IDs
    // get player IDs from connection State? or from db
    const allPlayerIds: string[] =
      useConnectionStore.getState().connectionState.signalIDs; // currently unsorted
    const sortedPlayerIds: string[] = allPlayerIds.sort(compStr); // sort by id, the order of the array gives the turn order
    const yourPlayerId: string =
      useConnectionStore.getState().connectionState.userID;

    let currentPlayerId: string = sortedPlayerIds[0];
    let currentPlayerIndex = 0;
    let newDeck: Tile[] = useGameDataStore.getState().gameDataState.deck;
    if (currentPlayerId === yourPlayerId) {
      // we're sending the deck to the next player
      currentPlayerId = sortedPlayerIds[1];
      currentPlayerIndex = 1;

      newDeck = randomizeDeck(useGameDataStore.getState().gameDataState.deck);
      const nextPlayer: string = currentPlayerId;
      giveDeck(peers, newDeck, nextPlayer);
    }

    // update deck
    useGameDataStore.setState({
      ...useGameDataStore.getState(),
      gameDataState: {
        ...useGameDataStore.getState().gameDataState,
        allPlayerIds: sortedPlayerIds,
        yourPlayerId: yourPlayerId,
        currentTurn: currentPlayerId,
        currentPlayerIndex: currentPlayerIndex,
        deck: newDeck,
      },
    });
  }, [peers]); // should we include this here? peers shouldn't really ever be updated during the game so it shouldn't really matter if it's here or not. I'm just putting it here so that the linter will stop complaining. Though it would probably be safer if it wasn't. So that a random update to peers won't accidentally break everything.

  // randomize deck
  useEffect(() => {
    // if someone else sends an action, and deck gets updated through the listener defined in PeerContextProvidor
    // and we are in shuffleDeck state and we are the recipient, then we shuffle the deck as well
    const gameState = useGameDataStore.getState().gameDataState;

    // check the game state, this deck randomization stuff will only run during the shuffleDeck phase
    // also check that deck is not currently in centre. Don't think this second check is *really* necessary
    // since the two variables are updated together but i'm also afraid to change it in case there was an
    // edge case I thought of a few days ago, but that I can't remember anymore. I guess this is what you
    // get when you hackathon stuff together.
    if (
      gameState.currentState === GameState.ShuffleDeck &&
      gameState.playerWithDeck !== ''
    ) {
      let newCurrentPlayerInd = gameState.currentPlayerIndex + 1;
      let newCurrentPlayerId = gameState.allPlayerIds[newCurrentPlayerInd];
      let newDeck = gameState.deck;

      // this newPlayerId should be the same as the field playerWithDeck....
      // am wondering if this field is even necessary to keep around?
      if (newCurrentPlayerId === gameState.yourPlayerId) {
        newDeck = randomizeDeck([...gameState.deck]);
        newCurrentPlayerInd += 1;
        newCurrentPlayerId = gameState.allPlayerIds[newCurrentPlayerInd];

        // check if we are last to update deck, distribute hands to everyone
        if (newCurrentPlayerInd >= 5) {
          for (const playerId in gameState.allPlayerIds) {
            const hand = newDeck.slice(newDeck.length - 13); // get the top 13 cards in deck
            newDeck = newDeck.slice(0, newDeck.length - 13);

            sendHand(peers, hand, playerId);
          }

          // do not give deck to player, simply put deck back in centre for everyone to use
          giveDeck(peers, newDeck, '');

          // game state is updated, game begins
          updateGameState(peers, GameState.DrawPlayCard);
        } else {
          // give deck to next player
          giveDeck(peers, newDeck, newCurrentPlayerId);
        }
      }

      useGameDataStore.setState({
        ...useGameDataStore.getState(),
        gameDataState: {
          ...gameState,
          currentPlayerIndex: newCurrentPlayerInd,
          currentTurn: newCurrentPlayerId,
          deck: newDeck,
        },
      });
    }
  }, [deck, peers]);

  // the main game function
  // every time game state is updated, all the everything should occur (e.g. Visual updates)
  useEffect(() => {
    const dataStore = useGameDataStore.getState().gameDataState;

    switch (gameState) {
      case GameState.DrawPlayCard:
        if (
          amCurrentPlayer(
            dataStore.yourPlayerId,
            dataStore.currentPlayerIndex,
            dataStore.allPlayerIds,
          )
        ) {
          let newDeck: Tile[] = [...dataStore.deck];
          const newHand: Tile[] = [...dataStore.yourHand];

          // only draw card if hand has 13 cards, we sometimes just chi or peng. So, we may not need to draw card
          if (newHand.length <= 13) {
            const drawnCard: Tile = newDeck[newDeck.length - 1]; // TODO: check deck is empty and if so, end the game
            newDeck = newDeck.slice(0, newDeck.length - 1); // remove last element
            newHand.push(drawnCard);

            // do we even need to update store here? probably not necessary so will remove for now
            /*
            useGameDataStore.setState({ 
              ...useGameDataStore.getState(),
              gameDataState: {
                ...dataStore,
                deck: newDeck,
                yourHand: newHand
              }
            });
            */
          }

          // render something to tell player to choose card to discard
          // block this function somehow? or move the rest of this functionality into some button?
          // most of this should probably get moved to some sort of callback function that runs if user decides to chi
          // once user has selected tile to discard, continue on

          // this is placeholder logic, until we actually implement how to discard tile
          const tileToDiscardIndex = 0;
          const discardedTile: Tile = newHand[tileToDiscardIndex];
          newHand.splice(tileToDiscardIndex, 1);
          const newDiscards = { ...dataStore.discards };
          newDiscards[dataStore.yourPlayerId].push(discardedTile);

          useGameDataStore.setState({
            ...useGameDataStore.getState(),
            gameDataState: {
              ...dataStore,
              yourHand: newHand,
              discards: newDiscards,
            },
          });

          giveDeck(peers, newDeck, '');
          sendPlaceTile(peers, discardedTile);
          updateGameState(peers, GameState.PengGang);
        } else {
          // not the current player who drew a card, should probably still render some sort of animation for the other player?
        }
        break;
      case GameState.PengGang:
        // if not current player, aka i'm not the player who just played the tile, and so i can peng/gang it
        if (
          !amCurrentPlayer(
            dataStore.yourPlayerId,
            dataStore.currentPlayerIndex,
            dataStore.allPlayerIds,
          )
        ) {
          // wait 5 seconds
          // most of this should probably get moved to some sort of callback function that runs if user decides to chi

          //if we peng/gang, we have to update newCurrPlayerInd to us.
          // logic here can be largely copied from chi

          updateGameState(peers, GameState.Chi);
        }
        break;
      case GameState.Chi:
        // if not current player, aka i'm not the player who just played the tile, and so i can peng/gang it
        if (
          !amCurrentPlayer(
            dataStore.yourPlayerId,
            dataStore.currentPlayerIndex,
            dataStore.allPlayerIds,
          )
        ) {
          // wait 5 seconds

          const newCurrPlayerInd = dataStore.currentPlayerIndex + 1;

          // some more placeholder logic to help out
          // most of this should probably get moved to some sort of callback function that runs if user decides to chi
          const currPlayerId: string =
            dataStore.allPlayerIds[dataStore.currentPlayerIndex % 4];
          const currPlayerDiscards: Tile[] = dataStore.discards[currPlayerId];
          const mostRecentDiscarded: Tile =
            currPlayerDiscards[currPlayerDiscards.length - 1];

          // display each of these groups as an option to user to select
          // user has to decide how to chi
          const group: number[][] = findGrouping(
            [...dataStore.yourHand, mostRecentDiscarded],
            Action.Chi,
            mostRecentDiscarded,
          );
          const selectedChiGroupIndex = 0; // this is the index of the group the user selected
          const valSortedChiGroup: number[] = group[selectedChiGroupIndex];
          const indSortedChiGroup: number[] = valSortedChiGroup
            .sort()
            .reverse();

          /*
          if (userConsumesTile) {
            // if we consume the tile
            var newHand: Tile[] = [
              ...dataStore.yourHand,
              mostRecentDiscarded,
            ];
            const newDiscards = { ...dataStore.discards };
            newDiscards[currPlayerId] = currPlayerDiscards.slice(
              0,
              currPlayerDiscards.length - 1,
            );

            const newMyToShowTiles: Tile[][] = 
              [...dataStore.shownTiles[dataStore.yourPlayerId],
                 [newHand[valSortedChiGroup[0]], 
                  newHand[valSortedChiGroup[1]], 
                  newHand[valSortedChiGroup[2]]]
              ];
            var newToShowTiles: { [userId: string]: Tile[][] } = { ...dataStore.shownTiles };
            newToShowTiles[dataStore.yourPlayerId] = newMyToShowTiles;

            // removes tiles from hand
            newHand.splice(indSortedChiGroup[0], 1);
            newHand.splice(indSortedChiGroup[1], 1);
            newHand.splice(indSortedChiGroup[2], 1);

            useGameDataStore.setState({
              ...useGameDataStore.getState(),
              gameDataState: {
                ...dataStore,
                yourHand: newHand,
                discards: newDiscards,
                shownTiles: newToShowTiles
              },
            });

            //if we chi, we have to update newCurrPlayerInd to us.
            updateCurrentPlayerIndex(
              peers,
              dataStore.allPlayerIds.indexOf(dataStore.yourPlayerId),
            );

            sendConsumeTile(
              peers,
              Action.Chi,
              currPlayerId,
              dataStore.yourPlayerId,
              mostRecentDiscarded,
            );
          } else {*/
          updateCurrentPlayerIndex(peers, newCurrPlayerInd);
          //}
          updateGameState(peers, GameState.DrawPlayCard);
        }
        break;
    }
  }, [gameState, peers]);

  return (
  <>
    <div className="game-view-container">
      <Sidebar></Sidebar>
      <div className="game-view-right">
        <Board></Board>
        <Deck></Deck>
      </div>
    </div>
  </>
  )
  
};

export default GameView;
