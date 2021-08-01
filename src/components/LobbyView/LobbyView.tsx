import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import './LobbyView.css';

const LobbyView: FunctionComponent = () => {
  const history = useHistory();
  const onClick = () => {
    history.push('/play');
  };
  return (
    <div>
      Lobby
      <button
        className="flex items-center justify-center px-8 py-3 font-medium rounded-md text-white bg-blue-700 shadow uppercase disabled:opacity-50"
        onClick={onClick}
      >
        Go to Play Page [Placeholder]
      </button>
    </div>
  );
};

export default LobbyView;
