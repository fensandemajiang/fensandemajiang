import React, { useEffect, FunctionComponent } from 'react';
import { useGameDataStore, useConnectionStore } from '../../utils/store';
import { compStr, getRandomInt } from '../../utils/utilFunc';
import { updateGameDataState } from './gameState';
import { giveDeck, updateGameState, sendHand } from './playerActions';
import { GameState } from '../../types';
import type { Tile } from '../../types';
import './GameView.css';
import Board from './Board/Board';
import Actions from './Actions/Actions';
import Deck from './Deck/Deck';
import Sidebar from '../GlobalComponents/Sidebar/Sidebar';

const GameView: FunctionComponent = () => {
  const deck: Tile[] = useGameDataStore((state) => state.gameDataState.deck);
  const gameState: GameState = useGameDataStore(
    (state) => state.gameDataState.currentState,
  );

  function randomizeDeck(deck: Tile[]): Tile[] {
    const newDeck = [...deck];

    for (let t1 = 0; t1 < 143; t1++) {
      // this approach could technically swap a tile with itself,
      // but that's going to be rare enough that I don't think it'll be important to worry about
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
      giveDeck(
        useConnectionStore.getState().connectionState.peers,
        newDeck,
        nextPlayer,
      );
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
  }, []); // should we include this here? peers shouldn't really ever be updated during the game so it shouldn't really matter if it's here or not. I'm just putting it here so that the linter will stop complaining. Though it would probably be safer if it wasn't. So that a random update to peers won't accidentally break everything.

  // randomize deck
  useEffect(() => {
    // if someone else sends an action, and deck gets updated through the listener defined in PeerContextProvidor
    // and we are in shuffleDeck state and we are the recipient, then we shuffle the deck as well
    const gameState = useGameDataStore.getState().gameDataState;
    const peers = useConnectionStore.getState().connectionState.peers;

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
  }, [deck]);

  // the main game function
  // every time game state is updated, all the everything should occur (e.g. Visual updates)
  useEffect(() => {
    const peers = useConnectionStore.getState().connectionState.peers;
    const dataStore = useGameDataStore.getState().gameDataState;
    updateGameDataState(dataStore, gameState, peers);
  }, [gameState]);

  function discard(tileType: number, tileIndex: number) {
    const discard = confirm('discard this tile?');
    if (discard) {
      console.log(tileType, tileIndex);
    }
    // placeholder
  }

  function chow(playerID: string) {
    alert(playerID);
  }

  function pung(playerID: string) {
    alert(playerID);
  }

  function kong(playerID: string) {
    alert(playerID);
  }

  return (
    <>
      <div className="game-view-container">
        <Sidebar></Sidebar>
        <div className="game-view-right">
          <div className="game-view-top">
            <Board></Board>
          </div>
          <div className="game-view-bot">
            <Deck discard={discard}></Deck>
            <Actions
              playerActions={{
                chow: chow,
                pung: pung,
                kong: kong,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GameView;
