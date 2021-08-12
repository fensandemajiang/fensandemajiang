import React, { useState, useEffect, FunctionComponent } from 'react';
import {
  Public,
  Identity,
  createUserAuth,
  PrivateKey,
  Client,
  UserAuth,
  publicKeyBytesFromString,
} from '@textile/hub';
import CreateTableModal from './CreateTableModal';
import JoinTableModal from './JoinTableModal';
import { useUserStore } from '../../utils/store';
import './LobbyView.css';

const RPanel: FunctionComponent = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const { did } = useUserStore((state) => state.userState);

  useEffect(() => {
    async function initClient() {
      if (did) {
        try {
          const didPublic: Public = {
            verify: (_: Buffer, sig: Buffer): Promise<boolean> => {
              return did
                .verifyJWS(sig.toString())
                .then(
                  (res) =>
                    res.didResolutionResult.didDocumentMetadata.error ===
                    undefined,
                );
            },
            bytes: publicKeyBytesFromString(did.id),
          };

          const didIdentity: Identity = {
            sign: (data: Buffer): Promise<Buffer> => {
              return did
                .createJWS(data)
                .then((out) => Buffer.from(JSON.stringify(out)));
            },

            public: didPublic,
          };

          setIdentity(didIdentity);
        } catch (err) {
          console.error(err);
          setIdentity(PrivateKey.fromRandom());
        }
      } else {
        setIdentity(PrivateKey.fromRandom());
      }

      const auth: UserAuth = await createUserAuth(
        'bw45ykkoetqwida7gzw2wgt5ryy',
        'bylrhy7swvhnh33lg7ykhksw36elbxvvfyynceli',
      );
      const c = Client.withUserAuth(auth);
      setClient(c);
      console.log('client init done');
    }
    initClient();
  }, [did]);

  const createOnClick = () => {
    setCreateOpen(true);
  };

  const joinOnClick = () => {
    setJoinOpen(true);
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
      <CreateTableModal
        client={client}
        identity={identity}
        open={createOpen}
        hitClose={() => setCreateOpen(!createOpen)}
      />
      <JoinTableModal
        client={client}
        identity={identity}
        open={joinOpen}
        hitClose={() => setJoinOpen(!joinOpen)}
      />
    </div>
  );
};

export default RPanel;
