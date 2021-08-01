import create, { SetState } from 'zustand';
import type { ConnectionState } from '../types';

export type ConnectionDataStore = {
  connectionState: ConnectionState;
  updateConnectionState: (connectionState: ConnectionState) => void;
}

const initialConnectionDataState: ConnectionState  = {
  signalIDs: {},
  userID: 0
}

export const useConnectionStore = create<ConnectionDataStore>((set: SetState<ConnectionDataStore>) => ({
    connectionState: initialConnectionDataState,
    updateConnectionState: (connectionState: ConnectionState) => set({ connectionState }),
}));
