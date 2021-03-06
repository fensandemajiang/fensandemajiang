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
import DBSecrets from './dbSecrets';
import { useUserStore, useConnectionStore } from '../../utils/store';
import './LobbyView.css';

const RPanel: FunctionComponent = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
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

          useConnectionStore.setState({
            ...useConnectionStore.getState(),
            connectionState: {
              ...useConnectionStore.getState().connectionState,
              identity: didIdentity,
            },
          });
        } catch (err) {
          console.error(err);
          useConnectionStore.setState({
            ...useConnectionStore.getState(),
            connectionState: {
              ...useConnectionStore.getState().connectionState,
              identity: PrivateKey.fromRandom(),
            },
          });
        }
      } else {
        useConnectionStore.setState({
          ...useConnectionStore.getState(),
          connectionState: {
            ...useConnectionStore.getState().connectionState,
            identity: PrivateKey.fromRandom(),
          },
        });
      }

      const auth: UserAuth = await createUserAuth(
        DBSecrets.key,
        DBSecrets.secret,
      );
      const c = Client.withUserAuth(auth);
      useConnectionStore.setState({
        ...useConnectionStore.getState(),
        connectionState: {
          ...useConnectionStore.getState().connectionState,
          client: c,
        },
      });
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
        open={createOpen}
        hitClose={() => setCreateOpen(!createOpen)}
      />
      <JoinTableModal open={joinOpen} hitClose={() => setJoinOpen(!joinOpen)} />
    </div>
  );
};

export default RPanel;
