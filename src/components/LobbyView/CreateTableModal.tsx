import React, {
  Fragment,
  useRef,
  useState,
  useEffect,
  FunctionComponent,
} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Filter, Client, ThreadID, Identity } from '@textile/hub';
import history from '../../history-helper';
import { useUserStore, useConnectionStore } from '../../utils/store';
import type { DbConnectionPlayer } from '../../types';

function CreateTableModal(props: { open: boolean, hitClose: () => void }) {
  const cancelButtonRef = useRef(null)
  const [tableCode, setTableCode] = useState("");
  const [threadId, setThreadId] = useState<ThreadID>(ThreadID.fromRandom());
  const [playerCount, setPlayerCount] = useState<number>(0);
  const { client, identity } = useConnectionStore(state => state.connectionState);

  useEffect(() => {
    async function createTable() {
      if (props.open) {
        setTableCode("loading...");

        const tok = await client.getToken(identity);
        // check if table db already exists
        const existingDB = await client.listDBs();
        if (existingDB.filter(dbInfo => dbInfo?.name === "table" && dbInfo?.id === threadId.toString()).length === 0) {
          await client.newDB(threadId, "table"); // creates a new db named table
        }

        await client.newCollection(threadId, { name: "playerId" }); // create a collection of player ids
        await client.newCollection(threadId, { name: "connectDetail" }); // creates separate collection for players to place their signal data for p2p

        const dbInfo = await client.getDBInfo(threadId);
        setTableCode(JSON.stringify(dbInfo)); // maybe we should hash this?

        const userId: string = useUserStore.getState().userState.did?.id ?? "playerx";
        
        const insertPlayer: DbConnectionPlayer = {
          playerId: userId,
          ready: false
        };
        await client.create(threadId, "playerId", [insertPlayer]);
        setPlayerCount(1);

        const listenFilters: Filter[] = [
          { collectionName: "playerId" },
          { actionTypes: ['CREATE'] }
        ];
        client.listen(threadId, listenFilters, (reply, err) => {
          async function asyncWrapper() {
            if (client) {
              const data: DbConnectionPlayer[] = await client.find(threadId, "playerId", {});
              const connectionStore = useConnectionStore.getState().connectionState;
              const usersIds: string[] = data.map((val: DbConnectionPlayer) => val.playerId);

              useConnectionStore.setState({
                ...useConnectionStore.getState(),
                connectionState: {
                  ...useConnectionStore.getState().connectionState,
                  signalIDs: usersIds
                }
              });

              setPlayerCount(playerCount + 1);

              // table is full
              if (usersIds.length === 4) {
                const myId = useConnectionStore.getState().connectionState.userID;
                for (let i = 0; i < 4; i++) {
                  if (data[i].playerId === myId)
                    data[i].ready = true;
                }
                await client.save(threadId, "playerId", data);

                // change page and start game 
                history.push('/play');
              }
            }
          }
          asyncWrapper();
        });
      }

      useConnectionStore.setState({
        ...useConnectionStore.getState(),
        connectionState: {
          ...useConnectionStore.getState().connectionState,
          userID: useUserStore.getState().userState.did?.id ?? '',
        },
      });
    }
    createTable();

    useConnectionStore.setState({
      ...useConnectionStore.getState(),
      connectionState: {
        ...useConnectionStore.getState().connectionState,
        userID: useUserStore.getState().userState.did?.id ?? ""
      }
    });

  }, [props.open]);

  async function close() {
    //check if collections were created, if so delete them
    const collections = await client.listCollections(threadId);

    for (let i = 0; i < collections.length; i++) {
      if (collections[i].name === "playerId") {
        console.log("delete playerId");
        await client.deleteCollection(threadId, "playerId");
      } else if (collections[i].name === "connectDetail") {
        console.log("delete connectDetail");
        await client.deleteCollection(threadId, "connectDetail");
      }
    }

    setPlayerCount(0);
    props.hitClose();
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
        initialFocus={cancelButtonRef}
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
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                          className="appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

                      <div></div>
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