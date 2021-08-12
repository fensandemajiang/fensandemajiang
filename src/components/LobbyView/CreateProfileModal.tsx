import React, { FunctionComponent, useState, ChangeEvent } from 'react';
import { Dialog } from '@headlessui/react';
import { useUserStore } from '../../utils/store';
import type { BasicProfile } from '../../types';
import './LobbyView.css';

type CreateProfileModalProps = {
  isOpen: boolean;
};
const CreateProfileModal: FunctionComponent<CreateProfileModalProps> = ({
  isOpen,
}: CreateProfileModalProps) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [residenceCountry, setResidenceCountry] = useState('');
  const [description, setDescription] = useState('');

  const { updateUserState, userState } = useUserStore();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'name') {
      setName(e.target.value);
    } else if (e.target.id === 'birthDate') {
      setBirthDate(e.target.value);
    } else if (e.target.id === 'residenceCountry') {
      setResidenceCountry(e.target.value);
    } else if (e.target.id === 'description') {
      setDescription(e.target.value);
    }
  };
  const validateForm = () => {
    // TODO: Fix UX of errors
    if (
      name === '' ||
      birthDate === '' ||
      residenceCountry === '' ||
      description === ''
    )
      return false;
    return true;
  };
  const isValid = validateForm();
  const submitForm = () => {
    if (validateForm()) {
      const basicProfile: BasicProfile = {
        name: name,
        description: description,
        birthDate: birthDate,
        residenceCountry: residenceCountry,
      };
      userState.idx
        ?.set('basicProfile', basicProfile)
        .then(() => updateUserState({ ...userState, profile: basicProfile }));
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
                Create Profile
              </Dialog.Title>
              <div className="mb-4">
                <label className="block  text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline text-black"
                  id="name"
                  type="text"
                  placeholder="Name"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="residenceCountry"
                >
                  Residence Country
                </label>
                <input
                  className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                  id="residenceCountry"
                  type="text"
                  placeholder="CA"
                  onChange={(e) => handleChange(e)}
                  maxLength={2}
                />
                <p className="text-red-500 text-xs italic">
                  Please choose a valid country.
                </p>
              </div>
              <div className="mb-4">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="birthDate"
                >
                  Birth Date
                </label>
                <input
                  className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                  id="birthDate"
                  type="text"
                  placeholder="yyyy-mm-dd"
                  onChange={(e) => handleChange(e)}
                />
                <p className="text-red-500 text-xs italic">
                  Please choose a valid date.
                </p>
              </div>
              <div className="mb-6">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="birthDate"
                >
                  Description
                </label>
                <input
                  className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline text-black"
                  id="description"
                  type="text"
                  placeholder="Description"
                  onChange={(e) => handleChange(e)}
                />
                <p className="text-red-500 text-xs italic">
                  Please write a valid description.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="lobbyview__button font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  onClick={() => submitForm()}
                  disabled={!isValid}
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CreateProfileModal;
