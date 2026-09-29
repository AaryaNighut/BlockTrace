import { ethers } from 'ethers';
import contractAddressData from '../contracts/contractAddress.json';
import contractAbiData from '../contracts/InvestigationRegistry.json';

const HARDHAT_CHAIN_ID = '0x7a69'; // 31337 in hex

export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && Boolean(window.ethereum);
}

export function formatAddress(address) {
  if (!address || address.length < 10) return address || '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatTimestamp(ts) {
  if (!ts) return 'N/A';
  const date = typeof ts === 'number' && ts < 10000000000 ? new Date(ts * 1000) : new Date(ts);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export async function connectWallet() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask browser extension.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    if (!accounts || accounts.length === 0) {
      throw new Error('No account authorized in MetaMask');
    }
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    return {
      account: accounts[0],
      chainId: network.chainId.toString(),
      provider,
      signer
    };
  } catch (error) {
    if (error.code === 4001) {
      throw new Error('User rejected the wallet connection request.');
    }
    throw error;
  }
}

export async function switchToHardhatNetwork() {
  if (!isMetaMaskInstalled()) return;
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: HARDHAT_CHAIN_ID }],
    });
  } catch (switchError) {
    // If network not added, add Hardhat Local node
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: HARDHAT_CHAIN_ID,
              chainName: 'Hardhat Localhost',
              rpcUrls: ['http://127.0.0.1:8545'],
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
            },
          ],
        });
      } catch (addError) {
        console.error('Failed to add Hardhat network:', addError);
      }
    }
  }
}

export function getContractReadOnly() {
  try {
    // Attempt local RPC connection first
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
    const contract = new ethers.Contract(
      contractAddressData.address,
      contractAbiData.abi,
      provider
    );
    return contract;
  } catch (err) {
    console.warn('ReadOnly contract fallback notice:', err.message);
    return null;
  }
}

export async function getContractWithSigner() {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is required to sign blockchain transactions');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    contractAddressData.address,
    contractAbiData.abi,
    signer
  );
}

export async function fetchOnChainInvestigations() {
  try {
    const contract = getContractReadOnly();
    if (!contract) return [];

    const allInv = await contract.getAllInvestigations();
    return allInv.map((inv) => ({
      id: Number(inv.id),
      walletAddress: inv.walletAddress,
      riskScore: Number(inv.riskScore),
      riskLevel: inv.riskLevel,
      primaryReason: inv.primaryReason,
      timestamp: Number(inv.timestamp) * 1000,
      investigator: inv.investigator,
      status: 'Confirmed On-Chain'
    })).reverse(); // latest first
  } catch (error) {
    console.warn('Could not fetch from local smart contract (is Hardhat node running?):', error.message);
    return null; // Return null so frontend falls back cleanly to demo state
  }
}

export async function registerInvestigationOnChain(walletAddress, riskScore, riskLevel, primaryReason) {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension or use Demo Registration mode.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      contractAddressData.address,
      contractAbiData.abi,
      signer
    );

    const tx = await contract.registerInvestigation(
      walletAddress,
      riskScore,
      riskLevel,
      primaryReason
    );

    const receipt = await tx.wait();
    return {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status === 1 ? 'Confirmed' : 'Failed'
    };
  } catch (error) {
    console.error('On-Chain Registration Error:', error);

    const errStr = String(error.message || error);
    if (errStr.includes('-32002') || errStr.includes('RPC endpoint') || errStr.includes('coalesce error')) {
      throw new Error('Local Blockchain Node Disconnected: Please make sure `npx hardhat node` is running in your terminal and MetaMask is connected to Localhost (http://127.0.0.1:8545).');
    }
    if (error.code === 4001 || errStr.includes('user rejected') || errStr.includes('rejected')) {
      throw new Error('Transaction was cancelled by user in MetaMask.');
    }
    if (errStr.includes('could not detect network') || errStr.includes('failed to fetch')) {
      throw new Error('Could not connect to Hardhat network (http://127.0.0.1:8545). Please start the local node.');
    }
    
    throw new Error(error.shortMessage || error.message || 'Smart contract transaction failed');
  }
}
