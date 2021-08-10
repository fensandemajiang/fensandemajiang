import React, { useState, FunctionComponent } from 'react';
import {
  Public,
  Identity,
  createUserAuth,
  PrivateKey,
  Client,
  KeyInfo,
  UserAuth,
  ThreadID,
  publicKeyBytesFromString,
} from '@textile/hub';
//import { BigNumber, utils } from 'ethers';
import CreateTableModal from './CreateTableModal';
import { useUserStore } from '../../utils/store';
import history from '../../history-helper';
import './LobbyView.css';

const RPanel: FunctionComponent = () => {
  const [createOpen, setCreateOpen] = useState(false);

  const { did } = useUserStore((state) => state.userState);

  if (did) {
    const didPublic: Public = {
      verify: (data: Buffer, sig: Buffer): Promise<boolean> => {
        return did
          .verifyJWS(sig.toString())
          .then(
            (res) =>
              res.didResolutionResult.didDocumentMetadata.error === undefined,
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
  }

  async function start() {
    const keyInfo: KeyInfo = {
      key: 'bfiks67sskbchfmqjyrakub2doq',
      secret: 'bcoqm2bl6dokiyvrjd3b4mmdsu6yvvxdzr5homei',
    };

    /*
    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Person',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        name: { type: 'string' },
        missions: {
          type: 'number',
          minimum: 0,
          exclusiveMaximum: 100,
        },
      },
    }
*/
    /*
    const auth: UserAuth = {
      msg:
      sig:
      token: 'bylrhy7swvhnh33lg7ykhksw36elbxvvfyynceli',
      key: 'bw45ykkoetqwida7gzw2wgt5ryy'
    };
*/
    //console.log(useUserStore.getState().userState.did);
    const auth: UserAuth = await createUserAuth(
      'bw45ykkoetqwida7gzw2wgt5ryy',
      'bylrhy7swvhnh33lg7ykhksw36elbxvvfyynceli',
    );
    const client = await Client.withUserAuth(auth);
    //const userId: string | undefined | null = await useUserStore.getState().userState.idx?.get("ed25519-identity");

    //console.log(useUserStore.getState().userState);
    //console.log(userId);

    const didId: string = did?.id ?? '';

    /*
    const hash = utils.keccak256(''));

    // @ts-ignore
    const array = hash
      // @ts-ignore
      .replace('0x', '')
      // @ts-ignore
      .match(/.{2}/g)
      .map((hexNoPrefix) => BigNumber.from('0x' + hexNoPrefix).toNumber())
    if (array.length !== 32) {
      throw new Error('Hash of signature is not the correct size! Something went wrong!');
    }
    const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array))
    */
    const identity = PrivateKey.fromRandom();

    var id: Identity;
    //if (userId) {
    //id = PrivateKey.fromString('kjzl6cwe1jw146zfmqa10a5x1vry6au3t362p44uttz4l0k4hi88o41zplhmxnf');
    //PrivateKey.fromRawEd25519Seed();

    //} else {
    //  id = PrivateKey.fromRandom();
    //}
    const tok = client.getToken(identity);
    //var id: Identity;
    //id = PrivateKey.fromRandom();
    //const tok = await client.getToken(id);

    //const auth2: UserAuth = await createUserAuth('bw45ykkoetqwida7gzw2wgt5ryy',
    //                                      'bylrhy7swvhnh33lg7ykhksw36elbxvvfyynceli');
    //const client2 = await Client.withUserAuth(auth2);

    const threadId = ThreadID.fromRandom();
    //await client.newDB(threadId);
    //await client.newCollection(threadId, { name: "clientTestCollection" });

    //await client.create(threadId, "testCollection", [ { myName: "john" } ]);
    //const res = await client.find(threadId, "clientTestCollection", {});
    //console.log("res", res);

    //const clientDev = await Client.withKeyInfo(keyInfo);
    //const threadId = ThreadID.fromRandom();
    //const threadId = ThreadID.fromString("bafkvdhfbemhrwzq74nimlgiftljf7sprstel4il7kbjcxhw7doaqp5a");
    //await client.newDB(threadId);
    //await client.newCollection(threadId, { name: "testCollection"});
    //await client.create(threadId, "testCollection", [ {name: "test"} ]);
    const res = await client.find(threadId, 'testCollection', {});
    //console.log(res);
    //const dbInfo = await clientDev.getDBInfo(threadId);
    //console.log(dbInfo);

    //await client.joinFromInfo(dbInfo);
    //const res2 = await client.find(threadId
  }

  const createOnClick = () => {
    //history.push('/play?create=true');

    //start();
    setCreateOpen(true);
  };
  const joinOnClick = () => {
    history.push('/play?join=true');
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
      <CreateTableModal tableCode={"testingtesting"} open={createOpen} hitClose={() => setCreateOpen(!createOpen)} />
    </div>
  );
};

export default RPanel;
