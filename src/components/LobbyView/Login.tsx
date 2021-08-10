import React, { FunctionComponent } from 'react';
import Web3Modal from 'web3modal';
import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect';
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver';
import Ceramic from '@ceramicnetwork/http-client';
import { IDX } from '@ceramicstudio/idx';
import { DID } from 'dids';
import { useUserStore } from '../../utils/store';
import type { BasicProfile } from '../../types';
import './LobbyView.css';

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
});

const CERAMIC_URL = 'https://ceramic-clay.3boxlabs.com/';

const threeIdConnect = new ThreeIdConnect();

const Login: FunctionComponent = () => {
  const { updateUserState } = useUserStore();
  const authenticate = async () => {
    const ethProvider = await web3Modal.connect();
    const addresses = await ethProvider.enable();

    const authProvider = new EthereumAuthProvider(ethProvider, addresses[0]);
    await threeIdConnect.connect(authProvider);

    const ceramic = new Ceramic(CERAMIC_URL);
    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: ThreeIdResolver.getResolver(ceramic),
    });

    await did.authenticate();

    const idx = new IDX({ ceramic });
    let basicProfile: BasicProfile | null = await idx.get(
      'basicProfile',
      did.id,
    );
    if (basicProfile === null) {
      basicProfile = await createProfile(idx);
    }

    updateUserState({
      loggedIn: true,
      profile: basicProfile,
      did: did,
      ceramic: ceramic,
      idx: idx,
    });
  };

  const createProfile = async (idx: IDX): Promise<BasicProfile> => {
    const profile = {
      name: 'username',
      description: 'Love to play Mahjong on my free time',
      residenceCountry: 'Canada',
    };
    // TODO: Implement profile

    return profile;
  };

  const loginOnClick = () => {
    authenticate();
  };
  return (
    <div className="lobbyview__rpanel p-4 br-2 text-white rounded-xl m-8">
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
  );
};

export default Login;
