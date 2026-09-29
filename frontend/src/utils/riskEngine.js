/**
 * BlockTrace Rule-Based Risk Engine
 * -------------------------------------------------------------
 * Educational risk scoring algorithm designed for college viva presentation.
 * Calculates a total risk score from 0 to 100 based on 5 discrete indicators (+20 each).
 * Works seamlessly for both Demo datasets and Live Etherscan Mainnet data.
 */

export function calculateRiskScore(walletData) {
  let score = 0;
  const reasons = [];
  const indicators = {
    highFrequency: false,
    multipleAddresses: false,
    largeTransfers: false,
    rapidSequence: false,
    unusualPattern: false,
  };

  // Rule 1: High Transaction Frequency (e.g. total tx >= 25)
  if (walletData.totalTx && walletData.totalTx >= 25) {
    score += 20;
    indicators.highFrequency = true;
    reasons.push("High transaction frequency observed over recent timeframe (>= 25 transactions)");
  }

  // Rule 2: Multiple Interacting Unique Addresses (e.g. unique addresses >= 10)
  if (walletData.uniqueAddresses && walletData.uniqueAddresses >= 10) {
    score += 20;
    indicators.multipleAddresses = true;
    reasons.push("Interacting with a high count of distinct counterparty addresses (>= 10 unique addresses)");
  }

  // Rule 3: Large Value Transfers (e.g. single transfer >= 10.0 ETH)
  const largestEthVal = parseFloat(String(walletData.largestTx || '').replace(' ETH', '') || '0');
  if (walletData.largeTxCount >= 1 || largestEthVal >= 10.0) {
    score += 20;
    indicators.largeTransfers = true;
    reasons.push("High-value ETH volume transfer detected (>= 10 ETH equivalent)");
  }

  // Rule 4: Rapid Sequence Transfers (Short time interval between txs)
  if (walletData.isRapidSequence) {
    score += 20;
    indicators.rapidSequence = true;
    reasons.push("Rapid back-to-back transaction sequences detected (sub-minute intervals)");
  }

  // Rule 5: Unusual Activity Pattern (Mix of zero-value or fan-out structures)
  if (walletData.hasUnusualPattern) {
    score += 20;
    indicators.unusualPattern = true;
    reasons.push("Potentially unusual distribution or fan-out activity pattern");
  }

  // Cap max score at 100
  if (score > 100) score = 100;

  // Determine Risk Level Categorization
  let riskLevel = "LOW RISK";
  let colorClass = "emerald";

  if (score >= 61) {
    riskLevel = "HIGH RISK";
    colorClass = "rose";
  } else if (score >= 31) {
    riskLevel = "MEDIUM RISK";
    colorClass = "amber";
  } else {
    riskLevel = "LOW RISK";
    colorClass = "emerald";
  }

  return {
    score,
    riskLevel,
    colorClass,
    reasons,
    indicators,
  };
}

/**
 * Single Transaction Risk Evaluation helper
 */
export function calculateTxRiskScore(txData) {
  let score = 10;
  const reasons = [];

  const amountEth = parseFloat(String(txData.amount || '0').replace(' ETH', ''));
  const gasUsed = parseInt(String(txData.gasUsed || '21000'), 10);

  if (amountEth > 25.0) {
    score += 40;
    reasons.push("Extremely large transaction amount (> 25 ETH)");
  } else if (amountEth > 5.0) {
    score += 25;
    reasons.push("Substantial ETH value transferred");
  }

  if (gasUsed > 100000) {
    score += 30;
    reasons.push("High gas consumption indicating complex contract execution");
  }

  if (txData.isNewRecipient) {
    score += 20;
    reasons.push("Interaction with unverified counterparty recipient");
  }

  if (score > 100) score = 100;

  let riskLevel = "LOW RISK";
  if (score >= 61) riskLevel = "HIGH RISK";
  else if (score >= 31) riskLevel = "MEDIUM RISK";

  return {
    score,
    riskLevel,
    reasons,
  };
}
