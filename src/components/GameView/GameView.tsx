import React, { useRef, useEffect, useState, FunctionComponent } from 'react';
import './GameView.css';
import Board from './Board/Board';
import Actions from './Actions/Actions';
import Deck from './Deck/Deck';
import Sidebar from '../GlobalComponents/Sidebar/Sidebar';
import Timer from './Timer/Timer';
import GameOverModal from './GameOverModal';
import {
  useConnectionStore,
  useGameDataStore,
  useBetStore,
} from '../../utils/store';
import { isGameDataStateEqual } from '../../utils/utilFunc';
import { updateGameDataStateAndLog } from './gameFsm';
import { Suite, Tile, PlayerAction, ActionType, GameDataState, GameState } from '../../types';
import {
  mostRecentDiscard,
  amFirstPlayer,
  containsChi,
  getFullHand,
} from './GameFunctions';
import history from '../../history-helper';

const GameView: FunctionComponent = () => {
  const { bettingEnabled, betAmount, betPaidOut } = useBetStore(
    (state) => state.betState,
  );
  const { userConnectedCount, peers, threadId, signalIDs, userID } =
    useConnectionStore((state) => state.connectionState);
  const _gameDataState = useGameDataStore((state) => state.gameDataState);
  const gameDataState = Object.assign({}, _gameDataState);
  const [countdown, setCountdown] = useState(5); // 5 second timer? to be more flexible for garbage internet. Pass this variable down to the timer component
  const [openGameOver, setOpenGameOver] = useState(false);
  const timer = useRef<any>();

  useEffect(() => {
    function setGameDataStore(newState: GameDataState): void {
      if (!isGameDataStateEqual(newState, useGameDataStore.getState().gameDataState)) {
        useGameDataStore.setState({
          ...useGameDataStore.getState(),
          gameDataState: newState
        });
      }
    }

    if (userConnectedCount === 3) {
      console.log("current state", gameDataState.currentState);
      // all users have connected
      if (gameDataState.currentState === GameState.Start) {
        const stateTransition: PlayerAction = {
          action: ActionType.SetPlayerId,
          body: {
            signalIds: signalIDs,
            userId: userID,
          },
        };
        if (bettingEnabled) {
          updateGameDataStateAndLog(
            gameDataState,
            stateTransition,
            peers,
            userID,
            threadId,
          )
            .then((newGameDataState: GameDataState) => {
              setGameDataStore(newGameDataState);
            })
            .catch((err) => console.error(err));
        } else {
          updateGameDataStateAndLog(
            gameDataState,
            stateTransition,
            peers,
            userID,
            threadId,
          )
            .then((newGameDataState: GameDataState) => {
              setGameDataStore(newGameDataState);
            })
            .catch((err) => console.error(err));
        }
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
          userID,
          threadId,
        ).then((newGameDataState) => {
          setGameDataStore(newGameDataState);
        });
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
          userID,
          threadId,
        ).then((newGameDataState) => {
          setGameDataStore(newGameDataState);
        });
      } else if (gameDataState.currentState === GameState.PengGang) {
        timer.current = setInterval(() => {
          if (
            countdown !== 0 &&
            gameDataState.currentState === GameState.PengGang
          ) {
            setCountdown(countdown - 1);
          } else {
            clearInterval(timer.current);
            setCountdown(5);
            const stateTransition: PlayerAction = {
              action: ActionType.NoPengGang,
              body: {
                isSending: true,
              },
            };
            updateGameDataStateAndLog(
              gameDataState,
              stateTransition,
              peers,
              userID,
              threadId,
            ).then((newGameDataState) => {
              setGameDataStore(newGameDataState);
            });
          }
        }, 1000);
      } else if (gameDataState.currentState === GameState.Chi) {
        timer.current = setInterval(() => {
          if (countdown !== 0 && gameDataState.currentState === GameState.Chi) {
            setCountdown(countdown - 1);
          } else {
            clearInterval(timer.current);
            setCountdown(5);
            const stateTransition: PlayerAction = {
              action: ActionType.Chi,
              body: {
                isSending: true,
              },
            };
            updateGameDataStateAndLog(
              gameDataState,
              stateTransition,
              peers,
              userID,
              threadId,
            ).then((newGameDataState) => {
              setGameDataStore(newGameDataState);
            });
          }
        }, 1000);
      } else if (gameDataState.currentState === GameState.Hu) {
        if (Object.keys(gameDataState.score).length === 4) {
          if (bettingEnabled && !betPaidOut) {
            setOpenGameOver(true);
          } else {
            setOpenGameOver(true);
          }
        }
      }
    }
  }, [
    userConnectedCount,
    countdown,
    gameDataState,
    signalIDs,
    threadId,
    userID,
    bettingEnabled,
    betAmount,
    betPaidOut,
  ]);

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
        userID,
        threadId,
      );
    }
  }

  function chow(selectedTriple: Tile[]) {
    const mostRecentDiscardTile: Tile | undefined = mostRecentDiscard(
      gameDataState.discards,
      gameDataState.currentTurn,
    );

    // TODO complete this
    // this selected triple is the triple that the user has selected
    // for the chi. The user should be prompted with a list of possible chi
    // (if there are more than one option) and the triple they choose should
    // get thrown into this variable
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

    updateGameDataStateAndLog(
      gameDataState,
      stateTransition,
      peers,
      userID,
      threadId,
    );
  }

  function pung(chowOptions: Tile[]) {
    const mostRecentDiscardTile: Tile | undefined = mostRecentDiscard(
      gameDataState.discards,
      gameDataState.currentTurn,
    );
    if (mostRecentDiscardTile !== undefined) {
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

      updateGameDataStateAndLog(
        gameDataState,
        stateTransition,
        peers,
        userID,
        threadId,
      );
    }
  }

  function kong(chowOptions: Tile[]) {
    const mostRecentDiscardTile: Tile | undefined = mostRecentDiscard(
      gameDataState.discards,
      gameDataState.currentTurn,
    );
    if (mostRecentDiscardTile !== undefined) {
      const selectedTriple: Tile[] = [
        mostRecentDiscardTile,
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

      updateGameDataStateAndLog(
        gameDataState,
        stateTransition,
        peers,
        userID,
        threadId,
      );
    }
  }

  function hu(chowOptions: Tile[]) {
    const stateTransition: PlayerAction = {
      action: ActionType.Hu,
      body: {
        isSending: true,
      },
    };
    updateGameDataStateAndLog(
      gameDataState,
      stateTransition,
      peers,
      userID,
      threadId,
    );
  }

  function replaceFlower() {
    const flower: Tile | undefined = gameDataState.yourHand.find(
      (t) => t.suite === Suite.Flowers,
    );
    if (flower) {
      const stateTransition: PlayerAction = {
        action: ActionType.ReplaceFlower,
        body: {
          tile: flower,
          isSending: true,
        },
      };
      updateGameDataStateAndLog(
        gameDataState,
        stateTransition,
        peers,
        userID,
        threadId,
      );
    } else {
      console.log('no flower found');
    }
  }

  function getChowOptions(): Tile[][] {
    const ret: Tile[][] = [];
    if (gameDataState.yourHand === undefined) return [];
    const _hand = Array.from(gameDataState.yourHand);
    for (let i = 3; i < _hand.length; i++) {
      const hand: Tile[] = _hand.splice(i - 3, i);
      const recentlyDiscarded = mostRecentDiscard(
        gameDataState.discards,
        gameDataState.currentTurn,
      );
      if (
        recentlyDiscarded !== undefined &&
        containsChi(hand, recentlyDiscarded)
      ) {
        ret.push(hand);
      }
    }
    return ret;
  }

  const chowOptions: Tile[][] = getChowOptions();

  function endGame() {
    setOpenGameOver(false);
    history.push('/lobby');
    for (const k in Object.keys(peers)) {
      try {
        peers[k].destroy();
      } catch (err) {
        console.error('Failed to destroy peer', k);
      }
    }
  }

  return (
    <>
      <div className="game-view-container">
        <Sidebar></Sidebar>
        <div className="game-view-right">
          <div className="game-view-top">
            <div className="game-view-top-left">
              <Board></Board>
            </div>
            <div className="game-view-top-right">
              <Timer></Timer>
              <Actions
                playerActions={{
                  chow: chow,
                  pung: pung,
                  kong: kong,
                  hu: hu,
                  replaceFlower: replaceFlower,
                }}
                chowOptions={chowOptions}
              />
            </div>
          </div>
          <div className="game-view-bot">
            <Deck discard={discard} deck={gameDataState.yourHand}></Deck>
          </div>
        </div>
      </div>
      <GameOverModal open={openGameOver} hitClose={endGame} />
    </>
  );
};

export default GameView;
