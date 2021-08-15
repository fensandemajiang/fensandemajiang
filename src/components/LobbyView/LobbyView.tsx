import React, { FunctionComponent } from 'react';
import LPanel from './LPanel';
import RPanel from './RPanel';
import Login from './Login';
import './LobbyView.css';
import { useUserStore } from '../../utils/store';

const LobbyView: FunctionComponent = () => {
  const { loggedIn, profile } = useUserStore((state) => state.userState);
  if (loggedIn && profile !== undefined) {
    const props = {
      name: profile.name,
      description: profile.description,
      residenceCountry: profile.residenceCountry,
      age: 18,
    };
    return (
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
        </div>
      </>
    );
  } else {
    return <Login />;
  }
};
export default LobbyView;
