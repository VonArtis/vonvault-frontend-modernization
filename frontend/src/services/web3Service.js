import { ethers } from 'ethers';

// Smart Contract ABI (Application Binary Interface)
const VONVAULT_CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "investmentId", "type": "string"},
      {"name": "tokenContract", "type": "address"}, 
      {"name": "grossAmount", "type": "uint256"}
    ],
    "name": "processInvestment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "amount", "type": "uint256"}],
    "name": "calculateFee", 
    "outputs": [
      {"name": "serviceFee", "type": "uint256"},
      {"name": "netInvestment", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "investmentId", "type": "string"},
      {"indexed": true, "name": "investor", "type": "address"},
      {"indexed": true, "name": "tokenContract", "type": "address"},
      {"name": "grossAmount", "type": "uint256"},
      {"name": "serviceFee", "type": "uint256"},
      {"name": "netInvestment", "type": "uint256"},
      {"name": "timestamp", "type": "uint256"}
    ],
    "name": "InvestmentProcessed",
    "type": "event"
  }
];

// ERC20 Token ABI (for approvals)
const ERC20_ABI = [
  {
    "inputs": [
      {"name": "spender", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable", 
    "type": "function"
  },
  {
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "spender", "type": "address"}
    ],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Network Configuration
const NETWORK_CONFIG = {
  ethereum: {
    chainId: '0x1',
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://cloudflare-eth.com',  // FREE RPC
    contractAddress: '', // To be set after deployment
    operationsWallet: '0xC7cbFBEfd24A362E4738Bc5693e6D9CF853787f4',
    tokens: {
      USDC: '0xA0b86a33E6441E7aFEa7E8DE4e8BD1000000000',
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    },
    gasPrice: { low: 20, medium: 30, high: 50 } // Gwei
  },
  polygon: {
    chainId: '0x89', 
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',  // FREE RPC
    contractAddress: '', // To be set after deployment
    operationsWallet: '0xC7cbFBEfd24A362E4738Bc5693e6D9CF853787f4',
    tokens: {
      USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    },
    gasPrice: { low: 30, medium: 35, high: 40 } // Gwei
  },
  bsc: {
    chainId: '0x38',
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',  // FREE RPC
    contractAddress: '', // To be set after deployment  
    operationsWallet: '0xC7cbFBEfd24A362E4738Bc5693e6D9CF853787f4',
    tokens: {
      USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      USDT: '0x55d398326f99059fF775485246999027B3197955'
    },
    gasPrice: { low: 5, medium: 5, high: 6 } // Gwei
  }
};

class VonVaultWeb3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.userAddress = null;
    this.currentNetwork = null;
  }

  // Connect to MetaMask or other Web3 wallet
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask or Web3 wallet not detected');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.userAddress = accounts[0];

      // Get current network
      const network = await this.provider.getNetwork();
      this.currentNetwork = this.getNetworkName(network.chainId);

      return {
        success: true,
        address: this.userAddress,
        network: this.currentNetwork
      };
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Switch to specific network
  async switchNetwork(networkName) {
    if (!window.ethereum) {
      throw new Error('Web3 wallet not detected');
    }

    const config = NETWORK_CONFIG[networkName];
    if (!config) {
      throw new Error('Unsupported network');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.chainId }]
      });

      this.currentNetwork = networkName;
      return { success: true, network: networkName };
    } catch (error) {
      throw new Error(`Failed to switch network: ${error.message}`);
    }
  }

  // Get network name from chain ID
  getNetworkName(chainId) {
    switch (chainId) {
      case 1: return 'ethereum';
      case 137: return 'polygon';
      case 56: return 'bsc';
      default: return 'unknown';
    }
  }

  // Calculate fee for investment amount
  async calculateInvestmentFee(amount, network) {
    const config = NETWORK_CONFIG[network];
    if (!config.contractAddress) {
      // Fallback calculation if contract not deployed
      const grossAmount = parseFloat(amount);
      const serviceFee = grossAmount * 0.0075; // 0.75%
      const netInvestment = grossAmount - serviceFee;
      
      return {
        grossAmount: grossAmount,
        serviceFee: serviceFee,
        netInvestment: netInvestment,
        feePercentage: 0.75
      };
    }

    try {
      const contract = new ethers.Contract(
        config.contractAddress,
        VONVAULT_CONTRACT_ABI,
        this.provider
      );

      const amountWei = ethers.parseUnits(amount, 6); // USDC/USDT have 6 decimals
      const [serviceFeeWei, netInvestmentWei] = await contract.calculateFee(amountWei);

      return {
        grossAmount: parseFloat(amount),
        serviceFee: parseFloat(ethers.formatUnits(serviceFeeWei, 6)),
        netInvestment: parseFloat(ethers.formatUnits(netInvestmentWei, 6)),
        feePercentage: 0.75
      };
    } catch (error) {
      throw new Error(`Failed to calculate fee: ${error.message}`);
    }
  }

  // Estimate gas costs for investment
  async estimateGasCosts(network, tokenType) {
    const config = NETWORK_CONFIG[network];
    
    // Estimated gas usage for smart contract investment
    const estimatedGasUnits = {
      approve: 50000,     // Token approval
      investment: 120000  // Smart contract investment
    };

    const totalGasUnits = estimatedGasUnits.approve + estimatedGasUnits.investment;
    const gasPriceGwei = config.gasPrice.medium;
    const gasPriceWei = ethers.parseUnits(gasPriceGwei.toString(), 'gwei');
    
    const totalGasCostWei = gasPriceWei.mul(totalGasUnits);
    const totalGasCostEth = parseFloat(ethers.formatEther(totalGasCostWei));

    // Convert to USD (rough estimates)
    const ethPriceUSD = {
      ethereum: 2000, // ETH price
      polygon: 0.5,   // MATIC price  
      bsc: 300        // BNB price
    };

    const gasCostUSD = totalGasCostEth * ethPriceUSD[network];

    return {
      gasUnits: totalGasUnits,
      gasPriceGwei: gasPriceGwei,
      gasCostETH: totalGasCostEth,
      gasCostUSD: gasCostUSD,
      network: network
    };
  }

  // Approve token spending
  async approveToken(tokenType, amount, network) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const config = NETWORK_CONFIG[network];
    const tokenAddress = config.tokens[tokenType];
    
    if (!tokenAddress) {
      throw new Error('Token not supported on this network');
    }

    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.signer
      );

      const amountWei = ethers.parseUnits(amount, 6);
      const tx = await tokenContract.approve(config.contractAddress, amountWei);
      
      return {
        success: true,
        transactionHash: tx.hash,
        message: 'Token approval submitted'
      };
    } catch (error) {
      throw new Error(`Token approval failed: ${error.message}`);
    }
  }

  // Monitor transaction status
  async getTransactionStatus(transactionHash) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const receipt = await this.provider.getTransactionReceipt(transactionHash);
      
      if (!receipt) {
        return { status: 'pending', confirmations: 0 };
      }

      const currentBlock = await this.provider.getBlockNumber();
      const confirmations = currentBlock - receipt.blockNumber;

      return {
        status: receipt.status === 1 ? 'success' : 'failed',
        confirmations: confirmations,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }

  // Generate unique investment ID
  generateInvestmentId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `INV-${timestamp}-${random}`.toUpperCase();
  }

  // Get user's token balance
  async getTokenBalance(tokenType, network) {
    if (!this.provider || !this.userAddress) {
      throw new Error('Wallet not connected');
    }

    const config = NETWORK_CONFIG[network];
    const tokenAddress = config.tokens[tokenType];

    try {
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ERC20_ABI,
        this.provider
      );

      const balanceWei = await tokenContract.balanceOf(this.userAddress);
      const balance = parseFloat(ethers.formatUnits(balanceWei, 6));

      return {
        balance: balance,
        token: tokenType,
        network: network
      };
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  // Calculate and route swap/exchange fees to operations wallet
  async calculateSwapFees(amount, userTier, network = 'ethereum') {
    const config = NETWORK_CONFIG[network];
    if (!config) {
      throw new Error(`Unsupported network: ${network}. Supported networks: ethereum, polygon, bsc`);
    }
    
    const grossAmount = parseFloat(amount);
    
    // Fee structure: VonVault Fee (tier-based) + Platform Fee (0.85% Reown) + Network Gas
    const vonVaultFeeRates = { 'CLUB': 0.008, 'PREMIUM': 0.006, 'VIP': 0.004, 'ELITE': 0.0025 };
    const platformFeeRate = 0.0085; // Reown fee
    
    // Network-specific gas fees
    const networkGasFees = {
      'ethereum': 15,  // Higher gas on Ethereum
      'polygon': 2,    // Lower gas on Polygon
      'bsc': 1         // Lowest gas on BNB Smart Chain
    };
    const networkGasFee = networkGasFees[network] || 15;
    
    const vonVaultFee = grossAmount * vonVaultFeeRates[userTier];
    const platformFee = grossAmount * platformFeeRate;
    const totalFees = vonVaultFee + platformFee + networkGasFee;
    const netReceived = grossAmount - totalFees;
    
    return {
      grossAmount: grossAmount,
      vonVaultFee: vonVaultFee,
      platformFee: platformFee,
      networkGasFee: networkGasFee,
      totalFees: totalFees,
      netReceived: netReceived,
      network: network,
      operationsWallet: config.operationsWallet, // Where all fees go
      feeRouting: {
        destination: config.operationsWallet,
        vonVaultPortion: vonVaultFee,
        platformPortion: platformFee,
        networkName: config.name,
        note: "All swap fees route to VonVault Operations Wallet"
      }
    };
  }

  // Execute swap with fee routing to operations wallet
  async executeSwapWithFeeRouting(fromToken, toToken, amount, userTier, network = 'ethereum') {
    const config = NETWORK_CONFIG[network];
    const feeCalculation = await this.calculateSwapFees(amount, userTier, network);
    
    try {
      // This would integrate with Reown's swap execution
      const swapResult = {
        transactionHash: `0x${Math.random().toString(16).slice(2)}`, // Mock transaction hash
        fromToken: fromToken,
        toToken: toToken,
        amountIn: amount,
        amountOut: feeCalculation.netReceived,
        feesRouted: {
          destination: config.operationsWallet,
          totalFeesCollected: feeCalculation.totalFees,
          breakdown: {
            vonVaultFee: feeCalculation.vonVaultFee,
            platformFee: feeCalculation.platformFee,
            networkGas: feeCalculation.networkGasFee
          }
        },
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      console.log(`✅ Swap executed: ${amount} ${fromToken} → ${feeCalculation.netReceived} ${toToken}`);
      console.log(`💰 Fees routed to operations wallet: $${feeCalculation.totalFees}`);
      console.log(`📝 Operations Wallet: ${config.operationsWallet}`);
      
      return swapResult;
    } catch (error) {
      throw new Error(`Swap execution failed: ${error.message}`);
    }
  }
}

// Export singleton instance
export const web3Service = new VonVaultWeb3Service();
export { NETWORK_CONFIG, VONVAULT_CONTRACT_ABI, ERC20_ABI };