import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { useBetStore } from '../../../utils/store';
import { placeBet } from './betsFunction';
import '../../LobbyView/LobbyView.css';

type BetsProps = {
  tableId: string;
  isOpen: boolean;
};
const Bets: FunctionComponent<BetsProps> = ({ tableId, isOpen }: BetsProps) => {
  const betState = useBetStore((state) => state.betState);
  const { updateBetState } = useBetStore();
  const minBet = 10000;
  const [bet, setBet] = useState(minBet);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'bet') {
      setBet(parseInt(e.target.value));
    }
  };
  const validateForm = () => {
    if (bet < minBet) return false;
    return true;
  };
  const isValid = validateForm();
  const submitForm = () => {
    if (validateForm()) {
      placeBet(tableId, bet).then(() => {
        updateBetState({ ...betState, betAmount: bet });
      });
    }
  };
  const onClose = function () {
    // do nothing
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed z-10 inset-0 overflow-y-auto lobbyview"
      >
        <div className="flex items-center justify-center min-h-screen z-20">
          <Dialog.Overlay className="fixed inset-0 opacity-100" />

          <div className="lobbyview__modal rounded max-w-sm mx-auto shadow-lg drop-shadow-lg opacity-100 z-30">
            <form className="lobbyview_modal rounded px-8 pt-6 pb-8 mb-4 text-screen text-white opacity-100 z-40">
              <Dialog.Title className="text-2xl font-bold mb-4">
                Place a Bet
              </Dialog.Title>
              <div className="mb-6">
                <label className="block  text-sm font-bold mb-2" htmlFor="bet">
                  Bet (GWEI)
                </label>
                <input
                  className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                  id="bet"
                  type="text"
                  placeholder={minBet.toString()}
                  onChange={(e) => handleChange(e)}
                />
                <p className="text-red-500 text-xs italic">
                  Please place a bet above {minBet} GWEI.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="lobbyview__button font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => submitForm()}
                  disabled={!isValid}
                >
                  Place Bet
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Bets;
