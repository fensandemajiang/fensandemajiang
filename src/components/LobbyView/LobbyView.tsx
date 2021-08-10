import React, { FunctionComponent } from 'react';
import LPanel from './LPanel';
import RPanel from './RPanel';
import Login from './Login';
import OldLobby from './OldLobby';
import './LobbyView.css';
import { useUserStore } from '../../utils/store';

const LobbyView: FunctionComponent = () => {
  const { loggedIn } = useUserStore((state) => state.userState);
  const props = {
    name: 'username',
    description: 'Love to play Mahjong on my free time',
    residenceCountry: 'Canada',
    age: 18,
  };
  return loggedIn ? (
    <>
      <div className="lobbyview h-screen">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <LPanel {...props} />
          </div>
          <div className="col-span-1">
            <RPanel />
          </div>
        </div>
        <OldLobby />
      </div>
    </>
  ) : (
    <Login />
  );
};
export default LobbyView;
