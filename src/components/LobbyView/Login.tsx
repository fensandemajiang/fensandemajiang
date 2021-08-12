import React, { FunctionComponent, useRef } from 'react';
import Web3Modal from 'web3modal';
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import Ceramic from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { DID } from 'dids';
import { useUserStore } from '../../utils/store';
import type { BasicProfile } from '../../types';
import CreateProfileModal from './CreateProfileModal';
import './LobbyView.css';

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
});

const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com/';

const threeIdConnect = new ThreeIdConnect();

const Login: FunctionComponent = () => {
  const { updateUserState } = useUserStore();
  const { profile, loggedIn } = useUserStore((state) => state.userState);
  const authenticate = async () => {
    const ethProvider = await web3Modal.connect();
    const addresses = await ethProvider.enable();

    const authProvider = new EthereumAuthProvider(ethProvider, addresses[0]);
    await threeIdConnect.connect(authProvider);

    const ceramic = new Ceramic(CERAMIC_URL);
    const provider = threeIdConnect.getDidProvider();
    const did = new DID({
      provider: provider,
      resolver: ThreeIdResolver.getResolver(ceramic),
    });
    ceramic.did = did;

    await ceramic.did.authenticate();
    await did.authenticate();

    const idx = new IDX({ ceramic });
    const idxProfile: BasicProfile | null = await idx.get(
      'basicProfile',
      did.id,
    );
    const basicProfile: BasicProfile | undefined = idxProfile
      ? idxProfile
      : undefined;

    updateUserState({
      loggedIn: true,
      profile: basicProfile,
      did: did,
      ceramic: ceramic,
      idx: idx,
    });
  };

  const loginOnClick = () => {
    authenticate();
  };
  return (
    <>
      <div className="lobbyview h-screen">
        <div className="grid grid-cols-j gap-4">
          <div className="lobbyview__lpanel p-4 br-2 text-white rounded-xl m-8">
            <div className="w-100 m-4"></div>
            <div className="w-100 m-4">
              <button
                className="lobbyview__button text-2xl font-bold p-4 br-4 rounded-md"
                onClick={() => loginOnClick()}
              >
                Login
              </button>
            </div>
          </div>
        </div>
        <CreateProfileModal isOpen={loggedIn && profile === undefined} />
      </div>
    </>
  );
};

export default Login;
