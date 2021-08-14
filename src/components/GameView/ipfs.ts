import { Web3Storage } from 'web3.storage';
// import { updateIpfsCid } from './playerActions';
import type { PlayerAction, GameDataState } from '../../types';
function getAccessToken(): string {
  if (import.meta.env.VITE_WEB3_STORAGE_API_TOKEN) {
    return import.meta.env.VITE_WEB3_STORAGE_API_TOKEN;
  } else {
    throw Error('Web3 Storage API Token not found');
  }
}
function createStorageClient(): Web3Storage {
  return new Web3Storage({ token: getAccessToken() });
}

function createFileFromState(
  gameDataState: GameDataState,
  playerAction: PlayerAction,
  gameId: string,
) {
  const obj = { gameDataState: gameDataState, playerAction: playerAction };
  const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
  const filename = `fensandemajiang_log_player_${
    gameDataState.yourPlayerId
  }_game_${gameId}_${new Date().getTime().toString()}.json`;
  return new File([blob], filename);
}
export async function logStateInIpfs(
  gameDataState: GameDataState,
  playerAction: PlayerAction,
  gameId: string,
) {
  const file = createFileFromState(gameDataState, playerAction, gameId);
  let storageClient: Web3Storage;
  try {
    storageClient = createStorageClient();
  } catch {
    return '';
  }
  const cid = await storageClient.put([file]);
  console.log(`LOGGING ${file.name} @ https://dweb.link/ipfs/${cid}`);
  return cid;
}
