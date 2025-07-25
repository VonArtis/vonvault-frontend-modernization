// Basic types for the staking application
export type ScreenType = 
  | 'dashboard' 
  | 'staking-dashboard'
  | 'staking-flow-convert' 
  | 'create-staking'
  | 'staking-completion'
  | 'staking-history'
  | 'staking-analytics'
  | 'staking-tiers';

export interface User {
  id?: string;
  email?: string;
  name?: string;
  walletAddress?: string;
  tier?: 'BASIC' | 'CLUB' | 'PREMIUM' | 'VIP' | 'ELITE';
}

export interface StakeData {
  amount: number;
  token: string;
  apy: number;
  tier: string;
  stakingPeriod: number;
  startDate: string;
  maturityDate: string;
  expectedEarnings: number;
  monthlyIncome: number;
  transactionHash?: string;
  networkFee?: number;
  platformFee?: number;
}