import React, { useEffect, useState, FunctionComponent } from 'react';
import './GameView.css';
import Board from './Board/Board';
import Actions from './Actions/Actions';
import Deck from './Deck/Deck';
import Sidebar from '../GlobalComponents/Sidebar/Sidebar';
import { useConnectionStore, useGameDataStore } from '../../utils/store';
import { updateGameDataStateAndLog } from './gameFsm';
import { Tile, PlayerAction, ActionType, GameState } from '../../types';
import { mostRecentDiscard, amFirstPlayer } from './GameFunctions';

const GameView: FunctionComponent = () => {
  const { userConnectedCount, peers, threadId, signalIDs, userID } =
    useConnectionStore((state) => state.connectionState);
  const gameDataState = useGameDataStore((state) => state.gameDataState);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (userConnectedCount === 3) {
      // all users have connected
      if (gameDataState.currentState === GameState.Start) {
        const stateTransition: PlayerAction = {
          action: ActionType.SetPlayerId,
          body: {
            signalIds: signalIDs,
            userId: userID,
          },
        };
        updateGameDataStateAndLog(
          gameDataState,
          stateTransition,
          peers,
          threadId,
        );
      } else if (
        gameDataState.currentState === GameState.ShuffleDeck &&
        amFirstPlayer(gameDataState.allPlayerIds, gameDataState.yourPlayerId)
      ) {
        const stateTransition: PlayerAction = {
          action: ActionType.InitGame,
          body: {
            isSending: true,
          },
        };
        updateGameDataStateAndLog(
          gameDataState,
          stateTransition,
          peers,
          threadId,
        );
      } else if (
        gameDataState.currentState === GameState.DrawCard &&
        gameDataState.currentTurn === gameDataState.yourPlayerId
      ) {
        const stateTransition: PlayerAction = {
          action: ActionType.DrawTile,
          body: {
            isSending: true,
          },
        };
        updateGameDataStateAndLog(
          gameDataState,
          stateTransition,
          peers,
          threadId,
        );
      } else if (gameDataState.currentState === GameState.PengGang) {
        // TODO complete this
      }
    }
  }, [gameDataState, userConnectedCount]);

  function discard(tileType: number, tileIndex: number) {
    const discard = confirm('discard this tile?');
    if (discard) {
      const tileAtIndex: Tile = gameDataState.yourHand[tileIndex];
      const stateTransition: PlayerAction = {
        action: ActionType.PlaceTile,
        body: {
          tile: tileAtIndex,
          playerTo: gameDataState.yourPlayerId,
          isSending: true,
        },
      };

      updateGameDataStateAndLog(
        gameDataState,
        stateTransition,
        peers,
        threadId,
      );
    }
  }

  function chow(playerID: string) {
    const mostRecentDiscardTile: Tile = mostRecentDiscard(
      gameDataState.discards,
      gameDataState.currentTurn,
    );
    // TODO complete this
    const selectedTriple: Tile[] = [];
    const stateTransition: PlayerAction = {
      action: ActionType.Chi,
      body: {
        // fill with stuff
        triple: selectedTriple,
        playerTo: gameDataState.yourPlayerId,
        playerFrom: gameDataState.currentTurn,
        isSending: true,
      },
    };

    updateGameDataStateAndLog(gameDataState, stateTransition, peers, threadId);
  }

  function pung(playerID: string) {
    const mostRecentDiscardTile: Tile = mostRecentDiscard(
      gameDataState.discards,
      gameDataState.currentTurn,
    );
    const selectedTriple: Tile[] = [
      mostRecentDiscardTile,
      mostRecentDiscardTile,
      mostRecentDiscardTile,
    ];
    const stateTransition: PlayerAction = {
      action: ActionType.Peng,
      body: {
        // fill with stuff
        triple: selectedTriple,
        playerTo: gameDataState.yourPlayerId,
        playerFrom: gameDataState.currentTurn,
        isSending: true,
      },
    };

    updateGameDataStateAndLog(gameDataState, stateTransition, peers, threadId);
  }

  function kong(playerID: string) {
    const mostRecentDiscardTile: Tile = mostRecentDiscard(
      gameDataState.discards,
      gameDataState.currentTurn,
    );
    const selectedTriple: Tile[] = [
      mostRecentDiscardTile,
      mostRecentDiscardTile,
      mostRecentDiscardTile,
    ];
    const stateTransition: PlayerAction = {
      action: ActionType.Gang,
      body: {
        // fill with stuff
        triple: selectedTriple,
        playerTo: gameDataState.yourPlayerId,
        playerFrom: gameDataState.currentTurn,
        isSending: true,
      },
    };

    updateGameDataStateAndLog(gameDataState, stateTransition, peers, threadId);
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
