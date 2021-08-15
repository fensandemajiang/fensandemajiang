import type { Score } from '../../../types';
import Web3 from 'web3';
import Web3Modal from 'web3modal';

const web3Modal = new Web3Modal({
  network: 'mainnet',
  cacheProvider: true,
});
const ethProvider = await web3Modal.connect();
const web3 = new Web3(ethProvider || 'ws://localhost:8545');
const abi: any = {};
//const address = import.meta.env.VITE_ENV_CONTRACT_ADDRESS || '0x0';
const address = '0x0';
const contract = new web3.eth.Contract(abi, address);

const account = () => {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts((err: Error, accounts: any) => {
      if (err === null) {
        resolve(accounts[0]);
      } else {
        reject(err);
      }
    });
  });
};
export function addTable(tableId: string) {
  return new Promise((resolve, reject) => {
    const id = web3.utils.soliditySha3(tableId);
    account().then((account) => {
      contract.methods
        .addTable(id)
        .send({ from: account, gas: 60000000 })
        .then((data: any) => resolve(data))
        .catch((e: Error) => reject(e));
    });
  });
}

export function getTable(tableId: string) {
  return new Promise((resolve, reject) => {
    const id = web3.utils.soliditySha3(tableId);
    account().then((account) => {
      contract.methods
        .getTable(id)
        .send({ from: account, gas: 60000000 })
        .then((data: any) => resolve(data))
        .catch((e: Error) => reject(e));
    });
  });
}

export function finishTable(tableId: string, score: Score) {
  return new Promise((resolve, reject) => {
    const id = web3.utils.soliditySha3(tableId);
    account().then((account) => {
      contract.methods
        .finishTable(id, score)
        .send({ from: account, gas: 60000000 })
        .then((data: any) => resolve(data))
        .catch((e: Error) => reject(e));
    });
  });
}

export function placeBet(tableId: string, betAmount: number) {
  return new Promise((resolve, reject) => {
    const id = web3.utils.soliditySha3(tableId);
    account().then((account) => {
      contract.methods
        .placeBet(id)
        .send({ from: account, gas: 60000000, value: betAmount })
        .then((data: any) => resolve(data))
        .catch((e: Error) => reject(e));
    });
  });
}
