import React, { useState, FunctionComponent } from 'react';
import { useConnectionStore } from '../../utils/store';
import { UserConnectionState } from '../../types';
import { useHistory } from 'react-router-dom';
import './LobbyView.css';

const LobbyView: FunctionComponent = () => {
  const history = useHistory();
  const [userId, setUserId] = useState('');
  const [opp1, setOpp1] = useState('');
  const [opp2, setOpp2] = useState('');
  const [opp3, setOpp3] = useState('');

  const goToPage = () => {
    history.push('/play');
  };

  const setIDs = () => {
    useConnectionStore.setState({
      ...useConnectionStore.getState(),
      connectionState: {
        ...useConnectionStore.getState().connectionState,
        userID: userId,
        signalIDs: [opp1, opp2, opp3],
        userConnectionState: [
          UserConnectionState.NotConnected,
          UserConnectionState.NotConnected,
          UserConnectionState.NotConnected,
        ],
      },
    });

    console.log(useConnectionStore.getState().connectionState);
  };

  return (
    <div>
      Lobby
      <div className="flex items-center justify-center mb-4">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="py-2 px-3 shadow border rounded leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="userId"
        />
        <input
          value={opp1}
          onChange={(e) => setOpp1(e.target.value)}
          className="py-2 px-3 shadow border rounded leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="opp1"
        />
        <input
          value={opp2}
          onChange={(e) => setOpp2(e.target.value)}
          className="py-2 px-3 shadow border rounded leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="opp2"
        />
        <input
          value={opp3}
          onChange={(e) => setOpp3(e.target.value)}
          className="py-2 px-3 shadow border rounded leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="opp3"
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        onClick={setIDs}
      >
        set IDs
      </button>
      <button
        className="flex items-center justify-center px-8 py-3 font-medium rounded-md text-white bg-blue-700 shadow uppercase disabled:opacity-50"
        onClick={goToPage}
      >
        Go to Play Page [Placeholder]
      </button>
    </div>
  );
};

export default LobbyView;
