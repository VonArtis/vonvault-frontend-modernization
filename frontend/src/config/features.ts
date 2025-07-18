// Feature flags configuration for VonVault DeFi App
export const FEATURES = {
  STAKING_ENABLED: true,
  VIP_TIERS_ENABLED: true,
  ANALYTICS_ENABLED: true,
  EXPORT_HISTORY_ENABLED: true
};

// Smart Contract Configuration
export const SMART_CONTRACTS = {
  STAKING_CONTRACT: "0x742d35Cc6634C0532925a3b8D65f4d2A", // Your staking contract
  TREASURY_WALLET: "0x1234567890123456789012345678901234567890", // Your treasury wallet
  USDC_TOKEN: "0xA0b86a33E6441c0A12b5C3c7E8AD09B1E8A7A9C8", // USDC contract
  USDT_TOKEN: "0xdAC17F958D2ee523a2206206994597C13D831ec7"  // USDT contract
};

// Staking configuration from environment variables
export const STAKING_CONFIG = {
  MIN_AMOUNT: parseInt(process.env.REACT_APP_STAKING_MIN_AMOUNT || '1000'),
  MAX_AMOUNT: parseInt(process.env.REACT_APP_STAKING_MAX_AMOUNT || '250000'),
  TREASURY_WALLET_ADDRESS: process.env.REACT_APP_TREASURY_WALLET_ADDRESS || SMART_CONTRACTS.TREASURY_WALLET,
  LOCK_PERIOD_MONTHS: 12,
  DEFAULT_APY: 15.2
};

// VIP Tier configuration
export const VIP_TIERS = {
  BASIC: { min: 0, max: 4999, apy: 8, icon: 'basic' },
  CLUB: { min: 5000, max: 19999, apy: 10, icon: 'club' },
  PREMIUM: { min: 20000, max: 49999, apy: 12, icon: 'premium' },
  VIP: { min: 50000, max: 99999, apy: 15, icon: 'vip' },
  ELITE: { min: 100000, max: Infinity, apy: 18, icon: 'elite' }
};

// Export helper functions
export const getVIPTierByAmount = (amount: number) => {
  for (const [tierName, tier] of Object.entries(VIP_TIERS)) {
    if (amount >= tier.min && amount <= tier.max) {
      return { name: tierName, ...tier };
    }
  }
  return { name: 'BASIC', ...VIP_TIERS.BASIC };
};

export const getNextVIPTier = (currentAmount: number) => {
  const tiers = Object.entries(VIP_TIERS);
  for (let i = 0; i < tiers.length; i++) {
    const [tierName, tier] = tiers[i];
    if (currentAmount < tier.min) {
      return { name: tierName, ...tier };
    }
  }
  return null; // Already at highest tier
};