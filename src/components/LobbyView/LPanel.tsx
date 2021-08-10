import React, { FunctionComponent } from 'react';
import './LobbyView.css';

type LPanelProps = {
  username: string;
  description: string;
  country?: string;
  age?: number;
};
const LPanel: FunctionComponent<LPanelProps> = ({
  username,
  description,
  country,
  age,
}: LPanelProps) => {
  return (
    <div className="lobbyview__lpanel p-4 br-2 text-white rounded-xl m-8">
      <h1 className="text-7xl font-bold p-4">{username}</h1>
      <p className="text-3xl p-4">
        <b>Description:</b> {description}
      </p>
      <p className="text-3xl p-4">
        <b>Country:</b> {country}
      </p>
      <p className="text-3xl p-4">
        <b>Age:</b> {age}
      </p>
    </div>
  );
};

export default LPanel;
