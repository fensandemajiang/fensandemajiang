import React, { useState, useEffect, FunctionComponent } from 'react';
//import createPeerContextProvider, { PeerContext } from '../p2p/p2p';
import SimplePeer from 'vite-compatible-simple-peer/simplepeer.min.js';
import './GameView.css';

const GameView: FunctionComponent = () => {
  //const PeerContextProvider = createPeerContextProvider(false);
  //const [peer, setPeer] = useState<any>({});
  const [id, setId] = useState({});

  const peer = new SimplePeer();
  useEffect(() => {
    const init = window.location.hash === '#init';
    console.log(init);
    /*
    setPeer(new Peer({
      initiator: false,
      trickle: false
    }));

*/

    /*
    peer.on("signal", (data: {}) => {
      setId(data);
      console.log("hey");
    });

    peer.on("data", (data: {}) => {
      alert(data);
    });
*/
  }, []);

  if (peer != null) {
    console.log('exists');
  } else {
    console.log('none');
  }

  return <div className="mainview">Game</div>;
};

export default GameView;
