import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  FunctionComponent,
  ChangeEvent,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Filter, ThreadID } from '@textile/hub';
import history from '../../history-helper';
import {
  useUserStore,
  useConnectionStore,
  useBetStore,
} from '../../utils/store';
import type { DbConnectionPlayer } from '../../types';
import type { grpc } from '@improbable-eng/grpc-web';

type CreateTableModalProps = {
  open: boolean;
  hitClose: () => void;
};

const CreateTableModal: FunctionComponent<CreateTableModalProps> = (props: {
  open: boolean;
  hitClose: () => void;
}) => {
  const { updateBetState } = useBetStore();
  const cancelButtonRef = useRef(null);
  const toggleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    updateBetState({
      bettingEnabled: checked,
      betAmount: 0,
      betPaidOut: false,
    });
  };
  const [tableCode, setTableCode] = useState('');
  const [threadId, setThreadId] = useState(ThreadID.fromRandom());
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [createListener, setCreateListener] = useState<grpc.Request | null>(
    null,
  );
  const { client, identity } = useConnectionStore(
    (state) => state.connectionState,
  );

  useEffect(() => {
    async function createTable() {
      if (props.open && playerCount === 0) {
        setTableCode('loading...');
        // check if table db already exists
        console.log(await client.getToken(identity));
        await client.newDB(threadId, 'table');
        await client.newCollection(threadId, { name: 'playerId' }); // create a collection of player ids
        await client.newCollection(threadId, { name: 'connectDetail' }); // creates separate collection for players to place their signal data for p2p
        await client.newCollection(threadId, { name: 'completedConnection' });

        useConnectionStore.setState({
          ...useConnectionStore.getState(),
          connectionState: {
            ...useConnectionStore.getState().connectionState,
            threadId: threadId.toString(),
          },
        });

        setTableCode(threadId.toString());

        const userId: string =
          useUserStore.getState().userState.did?.id ?? 'playerx';

        const insertPlayer: DbConnectionPlayer = {
          playerId: userId,
          ready: false,
          _id: '',
        };
        await client.create(threadId, 'playerId', [insertPlayer]);
        setPlayerCount(1);

        const listenFilters: Filter[] = [
          { collectionName: 'playerId' },
          { actionTypes: ['CREATE', 'DELETE'] },
        ];
        const listen = client.listen(
          threadId,
          listenFilters,
          async (reply, err) => {
            if (client) {
              const data: DbConnectionPlayer[] = await client.find(
                threadId,
                'playerId',
                {},
              );

              const usersIds: string[] = data.map(
                (val: DbConnectionPlayer) => val.playerId,
              );

              useConnectionStore.setState({
                ...useConnectionStore.getState(),
                connectionState: {
                  ...useConnectionStore.getState().connectionState,
                  signalIDs: usersIds,
                },
              });
              console.log(usersIds);
              setPlayerCount(usersIds.length);

              // table is full
              if (usersIds.length === 4) {
                // change page and start game
                history.push('/play');
              }
            }
          },
        );

        setCreateListener(listen);
      }
    }
    createTable();

    useConnectionStore.setState({
      ...useConnectionStore.getState(),
      connectionState: {
        ...useConnectionStore.getState().connectionState,
        userID: useUserStore.getState().userState.did?.id ?? '',
        userConnectedCount: 0,
      },
    });
  }, [props.open, playerCount, client, identity]);

  async function close() {
    //check if collections were created, if so delete them
    //const client = useConnectionStore.getState().connectionState.client;
    props.hitClose();
    setPlayerCount(0);
    const collections = await client.listCollections(threadId);

    if (createListener) createListener.close();

    for (let i = 0; i < collections.length; i++) {
      if (collections[i].name === 'playerId') {
        console.log('delete playerId');

        const allEntries: DbConnectionPlayer[] = await client.find(
          threadId,
          'playerId',
          {},
        );
        const allIds = allEntries.map((e) => e._id);
        await client.delete(threadId, 'playerId', allIds);
        await client.deleteCollection(threadId, 'playerId');
      } else if (collections[i].name === 'connectDetail') {
        console.log('delete connectDetail');
        await client.deleteCollection(threadId, 'connectDetail');
      } else if (collections[i].name === 'completedConnection') {
        console.log('delete completedConnection');
        await client.deleteCollection(threadId, 'completedConnection');
      }
    }

    await client.deleteDB(threadId);

    setThreadId(ThreadID.fromRandom());
  }

  function copyToClip() {
    navigator.clipboard.writeText(tableCode);
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={props.open}
        onClose={props.hitClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-white-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Create Table
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You have created a table with the following code:
                      </p>

                      <div className="flex my-4 shadow rounded">
                        <div
                          className="appearance-none border w-full py-2 px-3 break-all text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="username"
                        >
                          {' '}
                          {tableCode}{' '}
                        </div>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4"
                          onClick={copyToClip}
                        >
                          {' '}
                          copy{' '}
                        </button>
                      </div>

                      <p className="text-sm text-gray-500">
                        Send this to your friends for them to join. Currently{' '}
                        {playerCount}{' '}
                        {playerCount === 1 ? 'player has' : 'players have'}{' '}
                        joined.
                      </p>

                      <div className="my-4 inline-flex align-items-center">
                        <label className="mx-4">Enable Betting</label>
                        <input
                          onChange={toggleCheckboxChange}
                          type="checkbox"
                          className="form-checkbox vertical-align-middle"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={close}
                  ref={cancelButtonRef}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default CreateTableModal;
