import React, {MouseEvent} from 'react';
import PropTypes, { InferProps } from 'prop-types';
import ActionButton from './Buttons/ActionButton';
import { useGameDataStore } from '@utils/store';
import { GameDataStore } from '@utils/store';
import './Actions.css';

function Actions(props: InferProps<typeof Actions.propTypes>) {

  const playerID = useGameDataStore().gameDataState.yourPlayerId

  const getAction = (actionName : string) => {
    if(props.playerActions){
      return props.playerActions[actionName] ? () => props.playerActions[actionName](playerID) : () => {}
    }
  }

  return (
    <>
      <div className="actions-container">
        <div className="actions">
          <ActionButton
            type={0}
            otherProps={{ "onClick": getAction("chow")}}
          ></ActionButton>
          <ActionButton
            type={1}
            otherProps={{ "onClick": getAction("pung") }}
          ></ActionButton>
          <ActionButton
            type={2}
            otherProps={{ "onClick": getAction("kong") }}
          ></ActionButton>
        </div>
      </div>
    </>
  );
}

Actions.propTypes = {
  any: PropTypes.any,
  playerActions: PropTypes.objectOf(PropTypes.func)
}

export default Actions;
