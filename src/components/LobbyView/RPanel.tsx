import React, { FunctionComponent } from 'react';
import history from '../../history-helper';
import './LobbyView.css';

const RPanel: FunctionComponent = () => {
  const createOnClick = () => {
    history.push('/play?create=true');
  };
  const joinOnClick = () => {
    history.push('/play?join=true');
  };
  return (
    <div className="lobbyview__rpanel p-4 br-2 text-white rounded-xl m-8">
      <div className="w-100 m-4">
        <button
          className="lobbyview__button text-2xl font-bold p-4 br-4 rounded-md"
          onClick={() => createOnClick()}
        >
          Create a Table
        </button>
      </div>
      <div className="w-100 m-4">
        <button
          className="lobbyview__button text-2xl font-bold p-4 br-4 rounded-md"
          onClick={() => joinOnClick()}
        >
          Join a Table
        </button>
      </div>
    </div>
  );
};

export default RPanel;
