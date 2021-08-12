import React, { FunctionComponent } from 'react';
import './LobbyView.css';

type LPanelProps = {
  name?: string;
  description?: string;
  residenceCountry?: string;
  age?: number;
};
const LPanel: FunctionComponent<LPanelProps> = ({
  name,
  description,
  residenceCountry,
  age,
}: LPanelProps) => {
  return (
    <div className="lobbyview__lpanel p-4 br-2 text-white rounded-xl m-8">
      <h1 className="text-7xl font-bold p-4">{name}</h1>
      <p className="text-3xl p-4">
        <b>Description:</b> {description}
      </p>
      <p className="text-3xl p-4">
        <b>Country:</b> {residenceCountry}
      </p>
      <p className="text-3xl p-4">
        <b>Age:</b> {age}
      </p>
    </div>
  );
};

export default LPanel;
