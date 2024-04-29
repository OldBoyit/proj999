import { ethers } from 'ethers';
import ProductRegistryABI from './contracts/ABI/ProductRegistryABI.json';

const provider = new ethers.providers.JsonRpcProvider('https://sepolia.infura.io/v3/911f720870ce4d18951c55a6943ebd55');

export function getContract(address, privateKey) {
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(address, ProductRegistryABI, wallet);
  return contract;
}
