import React, { FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useGameDataStore } from '../../utils/store';

type GameOverModalProps = {
  open: boolean;
  hitClose: () => void;
};

const GameOverModal: FC<GameOverModalProps> = (props: {
  open: boolean;
  hitClose: () => void;
}) => {
  const gameStore = useGameDataStore((store) => store.gameDataState);

  function doStuff() {
    const state = useGameDataStore.getState().gameDataState;
    console.log(state.currentTurn);

    console.log('hi');
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
          <button onClick={doStuff}> {gameStore.currentTurn} </button>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default GameOverModal;
