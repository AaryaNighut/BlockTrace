import { describe, it, expect } from 'vitest';
import { calculateRiskScore, calculateTxRiskScore } from './riskEngine';
import { ethers } from 'ethers';

describe('Risk Engine & Wallet Analysis Logic', () => {
  it('1. Validates valid Ethereum wallet address', () => {
    const validAddr = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    expect(ethers.isAddress(validAddr)).toBe(true);
  });

  it('2. Rejects invalid Ethereum wallet address format', () => {
    const invalidAddr = 'invalid-address-123';
    expect(ethers.isAddress(invalidAddr)).toBe(false);
  });

  it('3. Converts Wei to ETH correctly', () => {
    const weiVal = 10000000000000000000n; // 10 ETH
    const ethFormatted = ethers.formatEther(weiVal);
    expect(ethFormatted).toBe('10.0');
  });

  it('4. Calculates Low Risk score for minimal activity', () => {
    const lowData = {
      totalTx: 5,
      uniqueAddresses: 3,
      largestTx: '0.5 ETH',
      largeTxCount: 0,
      isRapidSequence: false,
      hasUnusualPattern: false,
    };
    const result = calculateRiskScore(lowData);
    expect(result.score).toBe(0);
    expect(result.riskLevel).toBe('LOW RISK');
  });

  it('5. Calculates High Risk score for flagged indicators', () => {
    const highData = {
      totalTx: 50,
      uniqueAddresses: 15,
      largestTx: '25.0 ETH',
      largeTxCount: 3,
      isRapidSequence: true,
      hasUnusualPattern: true,
    };
    const result = calculateRiskScore(highData);
    expect(result.score).toBe(100);
    expect(result.riskLevel).toBe('HIGH RISK');
  });
});
