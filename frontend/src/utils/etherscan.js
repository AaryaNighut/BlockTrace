import { ethers } from 'ethers';

const ETHERSCAN_API_KEY = import.meta.env.VITE_ETHERSCAN_API_KEY || '';

/**
 * Fetch real Ethereum transaction history for a public wallet address using Etherscan API V2.
 * @param {string} address Public 0x... Ethereum address
 */
export async function fetchRealWalletData(address) {
  if (!address || !ethers.isAddress(address)) {
    throw new Error('Invalid Ethereum wallet address.');
  }

  const cleanAddress = address.trim();
  const apiKey = ETHERSCAN_API_KEY !== 'YOUR_ETHERSCAN_API_KEY' ? ETHERSCAN_API_KEY : '';

  // Etherscan API V2 URL (chainid=1 for Ethereum Mainnet)
  const primaryUrl = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=txlist&address=${cleanAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`;
  const fallbackUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${cleanAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`;

  let response;
  let data;

  try {
    response = await fetch(primaryUrl);
    data = await response.json();

    // Fallback if primary V2 format has issues
    if (!data || (data.status === '0' && data.message?.includes('NOTOK') && !data.result)) {
      const fallbackResp = await fetch(fallbackUrl);
      data = await fallbackResp.json();
    }
  } catch (err) {
    console.warn('Etherscan API fetch error:', err);
    throw new Error('Unable to fetch blockchain data. Please check your network connection.');
  }

  // Handle specific Etherscan error responses
  if (data.status === '0') {
    const msg = (data.message || '').toLowerCase();
    const resultStr = typeof data.result === 'string' ? data.result.toLowerCase() : '';

    if (msg.includes('no transactions found') || resultStr.includes('no transactions found')) {
      return {
        address: cleanAddress,
        label: 'Live Ethereum Wallet',
        description: 'Real-time Ethereum Mainnet wallet (0 transactions found)',
        totalTx: 0,
        totalReceived: '0.00 ETH',
        totalSent: '0.00 ETH',
        uniqueAddresses: 0,
        largestTx: '0.00 ETH',
        averageTx: '0.00 ETH',
        largeTxCount: 0,
        isRapidSequence: false,
        hasUnusualPattern: false,
        firstSeen: 'N/A',
        lastSeen: 'N/A',
        recentActivity: [],
        rawTxs: []
      };
    }

    if (resultStr.includes('api key') || msg.includes('invalid api key')) {
      throw new Error('Invalid Etherscan API key. Please check your .env configuration.');
    }

    if (resultStr.includes('rate limit') || msg.includes('rate limit')) {
      throw new Error('API rate limit reached. Please wait a few seconds and try again.');
    }

    // If result contains error string
    if (typeof data.result === 'string') {
      throw new Error(`Etherscan API Notice: ${data.result}`);
    }
  }

  const txList = Array.isArray(data.result) ? data.result : [];

  if (txList.length === 0) {
    return {
      address: cleanAddress,
      label: 'Live Ethereum Wallet',
      description: 'Real-time Ethereum Mainnet wallet',
      totalTx: 0,
      totalReceived: '0.00 ETH',
      totalSent: '0.00 ETH',
      uniqueAddresses: 0,
      largestTx: '0.00 ETH',
      averageTx: '0.00 ETH',
      largeTxCount: 0,
      isRapidSequence: false,
      hasUnusualPattern: false,
      firstSeen: 'N/A',
      lastSeen: 'N/A',
      recentActivity: [],
      rawTxs: []
    };
  }

  // Compute metrics from transaction list
  let totalReceivedWei = 0n;
  let totalSentWei = 0n;
  let largestWei = 0n;
  let totalValueWei = 0n;
  let largeTxCount = 0;
  const uniqueAddrSet = new Set();
  const timestamps = [];
  let unusualGasCount = 0;

  const targetLower = cleanAddress.toLowerCase();

  txList.forEach((tx) => {
    const val = BigInt(tx.value || '0');
    totalValueWei += val;
    if (val > largestWei) largestWei = val;

    const fromAddr = (tx.from || '').toLowerCase();
    const toAddr = (tx.to || '').toLowerCase();

    if (fromAddr === targetLower) {
      totalSentWei += val;
      if (toAddr && toAddr !== targetLower) uniqueAddrSet.add(toAddr);
    } else if (toAddr === targetLower) {
      totalReceivedWei += val;
      if (fromAddr && fromAddr !== targetLower) uniqueAddrSet.add(fromAddr);
    }

    // Check large transfers (>= 10 ETH)
    if (val >= 10000000000000000000n) {
      largeTxCount++;
    }

    // Track timestamps for velocity calculation
    if (tx.timeStamp) {
      timestamps.push(parseInt(tx.timeStamp, 10));
    }

    // Track high gas or zero-value contract calls
    if (parseInt(tx.gasUsed || '0', 10) > 150000 || (val === 0n && tx.input && tx.input !== '0x')) {
      unusualGasCount++;
    }
  });

  // Calculate rapid sequence (transactions occurring within 60s of each other)
  timestamps.sort((a, b) => a - b);
  let isRapidSequence = false;
  for (let i = 1; i < timestamps.length; i++) {
    if (timestamps[i] - timestamps[i - 1] <= 60) {
      isRapidSequence = true;
      break;
    }
  }

  const hasUnusualPattern = unusualGasCount >= 3 || (txList.length > 10 && uniqueAddrSet.size >= 8);

  const totalEthReceived = parseFloat(ethers.formatEther(totalReceivedWei)).toFixed(2);
  const totalEthSent = parseFloat(ethers.formatEther(totalSentWei)).toFixed(2);
  const largestEth = parseFloat(ethers.formatEther(largestWei)).toFixed(2);
  const avgEth = (parseFloat(ethers.formatEther(totalValueWei)) / txList.length).toFixed(2);

  const formattedActivity = txList.slice(0, 10).map((tx) => {
    const valEth = parseFloat(ethers.formatEther(tx.value || '0')).toFixed(4);
    const isOut = (tx.from || '').toLowerCase() === targetLower;
    const counterparty = isOut ? tx.to : tx.from;
    const dateObj = new Date(parseInt(tx.timeStamp || '0', 10) * 1000);

    return {
      hash: tx.hash,
      type: isOut ? 'OUT' : 'IN',
      amount: `${valEth} ETH`,
      counterparty: counterparty ? `${counterparty.substring(0, 6)}...${counterparty.substring(counterparty.length - 4)}` : 'Contract Creation',
      time: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: tx.isError === '0' ? 'Confirmed' : 'Failed'
    };
  });

  const firstDate = timestamps.length > 0 ? new Date(timestamps[0] * 1000).toLocaleDateString() : 'N/A';
  const lastDate = timestamps.length > 0 ? new Date(timestamps[timestamps.length - 1] * 1000).toLocaleDateString() : 'N/A';

  return {
    address: cleanAddress,
    label: 'Live Ethereum Mainnet Wallet',
    description: `Fetched ${txList.length} real transactions from Ethereum Mainnet`,
    totalTx: txList.length,
    totalReceived: `${totalEthReceived} ETH`,
    totalSent: `${totalEthSent} ETH`,
    uniqueAddresses: uniqueAddrSet.size,
    largestTx: `${largestEth} ETH`,
    averageTx: `${avgEth} ETH`,
    largeTxCount,
    isRapidSequence,
    hasUnusualPattern,
    firstSeen: firstDate,
    lastSeen: lastDate,
    recentActivity: formattedActivity,
    rawTxs: txList
  };
}

/**
 * Fetch details for a real Ethereum transaction by hash.
 * @param {string} txHash 66-character hex transaction hash
 */
export async function fetchRealTransactionData(txHash) {
  if (!txHash || !/^0x[a-fA-F0-9]{64}$/.test(txHash.trim())) {
    throw new Error('Invalid Ethereum transaction hash format.');
  }

  const cleanHash = txHash.trim();
  const apiKey = ETHERSCAN_API_KEY !== 'YOUR_ETHERSCAN_API_KEY' ? ETHERSCAN_API_KEY : '';

  const url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${cleanHash}${apiKey ? `&apikey=${apiKey}` : ''}`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();

    if (!data || !data.result) {
      throw new Error('Transaction hash not found on Ethereum Mainnet.');
    }

    const tx = data.result;
    const amountEth = parseFloat(ethers.formatEther(tx.value || '0x0')).toFixed(4);
    const gasUsedInt = parseInt(tx.gas || '0x5208', 16);
    const gasPriceGwei = (parseInt(tx.gasPrice || '0x0', 16) / 1e9).toFixed(2);
    const blockNum = parseInt(tx.blockNumber || '0x0', 16);

    return {
      hash: cleanHash,
      sender: tx.from || 'Unknown Sender',
      receiver: tx.to || 'Contract Execution',
      amount: `${amountEth} ETH`,
      gasUsed: gasUsedInt.toString(),
      gasPrice: `${gasPriceGwei} Gwei`,
      blockNumber: blockNum,
      timestamp: 'Confirmed on Mainnet',
      status: 'Success (Confirmed)',
      nonce: parseInt(tx.nonce || '0x0', 16),
      risk: {
        score: parseFloat(amountEth) > 10 ? 70 : parseFloat(amountEth) > 2 ? 40 : 15,
        level: parseFloat(amountEth) > 10 ? 'HIGH RISK' : parseFloat(amountEth) > 2 ? 'MEDIUM RISK' : 'LOW RISK',
        explanation: parseFloat(amountEth) > 10 
          ? 'Live Mainnet transfer involves a substantial ETH volume (> 10 ETH).' 
          : 'Standard Ethereum Mainnet transaction execution.'
      }
    };
  } catch (err) {
    console.warn('Real Tx fetch error:', err);
    throw new Error(err.message || 'Unable to fetch transaction details from Ethereum Mainnet.');
  }
}
