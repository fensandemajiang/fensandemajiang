import React, { MouseEvent } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import ActionButton from './Buttons/ActionButton';
import { calculateScore, mostRecentDiscard, getFullHand, triplifyShownTiles, containsPeng, containsChi, containsGang } from '../GameFunctions';
import { useGameDataStore } from '@utils/store';
import { GameDataStore } from '@utils/store';
import { GameState, Suite, Tile } from '../../../types';
import './Actions.css';

function Actions(props: { playerActions: any }) {
  const gameDataState = useGameDataStore(state => state.gameDataState);
  const playerID: string = useGameDataStore().gameDataState.yourPlayerId;

  const getAction = (actionName: string) => {
    if (props && props.playerActions) {
      return props.playerActions[actionName]
        ? () => props.playerActions[actionName](playerID)
        : function () {
            // do nothing}
          };
    }
  };

  const replaceFlowerButton = (
     <ActionButton
      type={4}
      otherProps={{ onClick: getAction('replaceFlower') }}
    ></ActionButton>
  );

  const huButton = (
    <ActionButton
      type={3}
      otherProps={{ onClick: getAction('hu') }}
    ></ActionButton>
  );

  const kongButton = (
    <ActionButton
      type={2}
      otherProps={{ onClick: getAction('kong') }}
    ></ActionButton>
  );

  const pungButton = (
    <ActionButton
      type={1}
      otherProps={{ onClick: getAction('pung') }}
    ></ActionButton>
  );

  const chiButton = (
    <ActionButton
      type={0}
      otherProps={{ onClick: getAction('chow') }}
    ></ActionButton>
  );

  const displayHu: boolean = (() => {
    const myShownTiles: Tile[][] | undefined = gameDataState.shownTiles[gameDataState.yourPlayerId];
    if (myShownTiles) {
      return calculateScore(getFullHand(gameDataState.yourHand, triplifyShownTiles(myShownTiles))) >= 0;
    } else return false;
  })();

  const displayPung: boolean = (() => {
    if (gameDataState.discards && gameDataState.discards[gameDataState.currentTurn]) {
      const recentDiscard: Tile = mostRecentDiscard(gameDataState.discards, gameDataState.currentTurn);
      return containsPeng(gameDataState.yourHand, recentDiscard) && gameDataState.currentTurn !== gameDataState.yourPlayerId;
    } else return false;
  })();

  const displayKong: boolean = (() => {
    if (gameDataState.discards && gameDataState.discards[gameDataState.currentTurn]) {
      const recentDiscard: Tile = mostRecentDiscard(gameDataState.discards, gameDataState.currentTurn);
      return containsGang(gameDataState.yourHand, recentDiscard) && gameDataState.currentTurn !== gameDataState.yourPlayerId;
    } else return false;
  })();

  const displayChi: boolean = (() => {
    const nextPlayerInd: number = (gameDataState.currentPlayerIndex + 1) % 4;
    if (gameDataState.allPlayerIds[nextPlayerInd] === gameDataState.yourPlayerId &&
        gameDataState.discards && 
        gameDataState.discards[gameDataState.currentTurn]) {
      const recentDiscard: Tile = mostRecentDiscard(gameDataState.discards, gameDataState.currentTurn);
      return containsChi(gameDataState.yourHand, recentDiscard) && gameDataState.currentTurn !== gameDataState.yourPlayerId;
    } else return false;
  })();

  const displayReplaceFlower: boolean = (() => {
    const flower: Tile | undefined = gameDataState.yourHand.find(t => t.suite === Suite.Flowers);
    if (flower) {
      return gameDataState.currentState === GameState.PlayCard && 
             gameDataState.currentTurn === gameDataState.yourPlayerId;
    } else return false;
  })();

  return (
    <>
      <div className="actions-container">
        <div className="actions">
          { displayReplaceFlower ? replaceFlowerButton : null }
          { displayChi ? chiButton : null }
          { displayKong ? kongButton : null }
          { displayPung ? pungButton : null }
          { displayHu ? huButton : null }
        </div>
      </div>
    </>
  );
}

Actions.propTypes = {
  any: PropTypes.any,
  playerActions: PropTypes.objectOf(PropTypes.func),
};

export default Actions;
