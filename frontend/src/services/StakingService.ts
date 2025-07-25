import { ethers } from 'ethers';
import { SMART_CONTRACTS, STAKING_CONFIG } from '../config/features';

// Staking Contract ABI (simplified for demo)
const STAKING_CONTRACT_ABI = [
  "function stake(uint256 amount, uint256 duration, string memory tier) external",
  "function unstake(uint256 stakingId) external",
  "function getStakingInfo(address user) external view returns (uint256 totalStaked, uint256 totalRewards, uint256[] memory stakingIds)",
  "function calculateRewards(uint256 stakingId) external view returns (uint256)",
  "event Staked(address indexed user, uint256 amount, uint256 duration, string tier, uint256 stakingId)",
  "event Unstaked(address indexed user, uint256 stakingId, uint256 amount, uint256 rewards)"
];

// ERC20 Token ABI (for USDC/USDT)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

class StakingService {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private stakingContract: ethers.Contract | null = null;

  // Initialize with Web3 provider (from Reown AppKit)
  async initialize(provider: any) {
    this.provider = new ethers.providers.Web3Provider(provider);
    this.signer = this.provider.getSigner();
    this.stakingContract = new ethers.Contract(
      SMART_CONTRACTS.STAKING_CONTRACT,
      STAKING_CONTRACT_ABI,
      this.signer
    );
  }

  // Get token balance (USDC/USDT)
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not initialized');
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
    const balance = await tokenContract.balanceOf(userAddress);
    const decimals = await tokenContract.decimals();
    
    return ethers.utils.formatUnits(balance, decimals);
  }

  // Get USDC balance
  async getUSDCBalance(userAddress: string): Promise<string> {
    return this.getTokenBalance(SMART_CONTRACTS.USDC_TOKEN, userAddress);
  }

  // Get USDT balance
  async getUSDTBalance(userAddress: string): Promise<string> {
    return this.getTokenBalance(SMART_CONTRACTS.USDT_TOKEN, userAddress);
  }

  // Approve token spending
  async approveToken(tokenAddress: string, amount: string): Promise<ethers.ContractTransaction> {
    if (!this.signer) throw new Error('Signer not initialized');
    
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
    const decimals = await tokenContract.decimals();
    const amountBN = ethers.utils.parseUnits(amount, decimals);
    
    return tokenContract.approve(SMART_CONTRACTS.STAKING_CONTRACT, amountBN);
  }

  // Create staking investment
  async createStakingInvestment(
    amount: string,
    token: 'USDC' | 'USDT',
    tier: string,
    duration: number = 12
  ): Promise<ethers.ContractTransaction> {
    if (!this.stakingContract) throw new Error('Staking contract not initialized');
    
    const tokenAddress = token === 'USDC' ? SMART_CONTRACTS.USDC_TOKEN : SMART_CONTRACTS.USDT_TOKEN;
    
    // First approve token spending
    const approveTx = await this.approveToken(tokenAddress, amount);
    await approveTx.wait();
    
    // Then create staking
    const amountBN = ethers.utils.parseUnits(amount, 6); // USDC/USDT have 6 decimals
    return this.stakingContract.stake(amountBN, duration, tier);
  }

  // Get staking info for user
  async getStakingInfo(userAddress: string): Promise<{
    totalStaked: string;
    totalRewards: string;
    stakingIds: string[];
  }> {
    if (!this.stakingContract) throw new Error('Staking contract not initialized');
    
    const info = await this.stakingContract.getStakingInfo(userAddress);
    
    return {
      totalStaked: ethers.utils.formatUnits(info.totalStaked, 6),
      totalRewards: ethers.utils.formatUnits(info.totalRewards, 6),
      stakingIds: info.stakingIds.map((id: ethers.BigNumber) => id.toString())
    };
  }

  // Calculate rewards for specific staking
  async calculateRewards(stakingId: string): Promise<string> {
    if (!this.stakingContract) throw new Error('Staking contract not initialized');
    
    const rewards = await this.stakingContract.calculateRewards(stakingId);
    return ethers.utils.formatUnits(rewards, 6);
  }

  // Unstake (claim matured investment)
  async unstake(stakingId: string): Promise<ethers.ContractTransaction> {
    if (!this.stakingContract) throw new Error('Staking contract not initialized');
    
    return this.stakingContract.unstake(stakingId);
  }

  // Format transaction for Reown AppKit
  formatStakingTransaction(amount: string, token: 'USDC' | 'USDT', tier: string) {
    const tokenAddress = token === 'USDC' ? SMART_CONTRACTS.USDC_TOKEN : SMART_CONTRACTS.USDT_TOKEN;
    const amountBN = ethers.utils.parseUnits(amount, 6);
    
    // Encode staking function call
    const iface = new ethers.utils.Interface(STAKING_CONTRACT_ABI);
    const data = iface.encodeFunctionData('stake', [amountBN, 12, tier]);
    
    return {
      to: SMART_CONTRACTS.STAKING_CONTRACT,
      value: '0x0', // No ETH value for ERC20 staking
      data: data
    };
  }

  // Treasury transfer transaction
  formatTreasuryTransfer(amount: string, token: 'USDC' | 'USDT') {
    const tokenAddress = token === 'USDC' ? SMART_CONTRACTS.USDC_TOKEN : SMART_CONTRACTS.USDT_TOKEN;
    const amountBN = ethers.utils.parseUnits(amount, 6);
    
    // Encode ERC20 transfer to treasury
    const iface = new ethers.utils.Interface(ERC20_ABI);
    const data = iface.encodeFunctionData('transfer', [STAKING_CONFIG.TREASURY_WALLET_ADDRESS, amountBN]);
    
    return {
      to: tokenAddress,
      value: '0x0',
      data: data
    };
  }
}

export const stakingService = new StakingService();
export default stakingService;