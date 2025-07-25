// Real Crypto Wallet Integration Service
import { ethers, BrowserProvider } from 'ethers';
import { secureStorage } from '../utils/secureStorage';

interface WalletConnection {
  type: 'metamask' | 'walletconnect' | 'trust' | 'coinbase' | 'manual';
  address: string;
  provider?: any;
  balance?: string;
  network?: string;
  name?: string;
}

interface WalletService {
  connectMetaMask(): Promise<WalletConnection>;
  connectWalletConnect(): Promise<WalletConnection>;
  connectTrustWallet(): Promise<WalletConnection>;
  connectCoinbaseWallet(): Promise<WalletConnection>;
  connectManualWallet(address: string, name?: string): Promise<WalletConnection>;
  validateAddress(address: string): boolean;
  getBalance(address: string): Promise<string>;
  signMessage(message: string, address: string): Promise<string>;
  disconnectWallet(address: string): Promise<void>;
  getConnectedWallets(): WalletConnection[];
}

class CryptoWalletService implements WalletService {
  private connectedWallets: WalletConnection[] = [];

  constructor() {
    // Load connected wallets from localStorage with vonvault prefix (per API standardization)
    const stored = localStorage.getItem('vonvault-connected-wallets');
    if (stored) {
      try {
        this.connectedWallets = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading stored wallets:', error);
      }
    }
  }

  // MetaMask Integration
  async connectMetaMask(): Promise<WalletConnection> {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      // Request account access
      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in MetaMask.');
      }

      const address = accounts[0];
      const provider = new ethers.BrowserProvider(window.ethereum as any);

      // Get network information
      const network = await provider.getNetwork();
      
      // Get balance
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: 'metamask',
        address,
        provider,
        balance: formattedBalance,
        network: network.name,
        name: 'MetaMask'
      };

      // Verify ownership with signature
      await this.verifyWalletOwnership(connection);

      // Store connection
      await this.addWalletConnection(connection);

      return connection;
    } catch (error: any) {
      console.error('MetaMask connection failed:', error);
      throw new Error(error.message || 'Failed to connect to MetaMask');
    }
  }

  // WalletConnect Integration - DEPRECATED TEMPORARILY
  async connectWalletConnect(): Promise<WalletConnection> {
    throw new Error('WalletConnect integration temporarily disabled. Use Reown AppKit instead via the main "Connect Your Wallet" button.');
  }

  // Trust Wallet Integration (uses same interface as MetaMask on web)
  async connectTrustWallet(): Promise<WalletConnection> {
    try {
      // Trust Wallet uses the same ethereum provider interface
      if (!window.ethereum) {
        throw new Error('Trust Wallet is not detected. Please use Trust Wallet browser or install the extension.');
      }

      // Request account access
      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in Trust Wallet.');
      }

      const address = accounts[0];
      const provider = new BrowserProvider(window.ethereum as any);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: 'trust',
        address,
        provider,
        balance: formattedBalance,
        network: network.name,
        name: 'Trust Wallet'
      };

      await this.verifyWalletOwnership(connection);
      await this.addWalletConnection(connection);

      return connection;
    } catch (error: any) {
      console.error('Trust Wallet connection failed:', error);
      throw new Error(error.message || 'Failed to connect to Trust Wallet');
    }
  }

  // Coinbase Wallet Integration
  async connectCoinbaseWallet(): Promise<WalletConnection> {
    try {
      // Check for Coinbase Wallet
      if (!window.ethereum || !window.ethereum.isCoinbaseWallet) {
        throw new Error('Coinbase Wallet is not detected. Please install Coinbase Wallet extension.');
      }

      const accounts = await (window.ethereum as any).request({
        method: 'eth_requestAccounts',
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in Coinbase Wallet.');
      }

      const address = accounts[0];
      const provider = new BrowserProvider(window.ethereum as any);
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);

      const connection: WalletConnection = {
        type: 'coinbase',
        address,
        provider,
        balance: formattedBalance,
        network: network.name,
        name: 'Coinbase Wallet'
      };

      await this.verifyWalletOwnership(connection);
      await this.addWalletConnection(connection);

      return connection;
    } catch (error: any) {
      console.error('Coinbase Wallet connection failed:', error);
      throw new Error(error.message || 'Failed to connect to Coinbase Wallet');
    }
  }

  // Manual Wallet Address Input
  async connectManualWallet(address: string, name: string = 'Manual Wallet'): Promise<WalletConnection> {
    try {
      // Validate address format
      if (!this.validateAddress(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      // Check if wallet already connected
      const existing = this.connectedWallets.find(w => w.address.toLowerCase() === address.toLowerCase());
      if (existing) {
        throw new Error('This wallet address is already connected');
      }

      // Get balance using a public provider (no signature verification for manual)
      let balance = '0';
      try {
        const publicProvider = new ethers.JsonRpcProvider(
          process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/demo'
        );
        const balanceWei = await publicProvider.getBalance(address);
        balance = ethers.formatEther(balanceWei);
      } catch (error) {
        console.warn('Could not fetch balance for manual wallet:', error);
      }

      const connection: WalletConnection = {
        type: 'manual',
        address,
        balance,
        network: 'mainnet',
        name: name || 'Manual Wallet'
      };

      await this.addWalletConnection(connection);
      return connection;
    } catch (error: any) {
      console.error('Manual wallet connection failed:', error);
      throw new Error(error.message || 'Failed to add manual wallet');
    }
  }

  // Verify wallet ownership with signature
  private async verifyWalletOwnership(connection: WalletConnection): Promise<void> {
    if (connection.type === 'manual' || !connection.provider) {
      return; // Skip verification for manual wallets
    }

    try {
      const message = `Verify wallet ownership for VonVault - ${Date.now()}`;
      const signature = await this.signMessage(message, connection.address);
      
      // Verify signature
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== connection.address.toLowerCase()) {
        throw new Error('Wallet verification failed - signature mismatch');
      }

      console.log('Wallet ownership verified successfully');
    } catch (error) {
      console.error('Wallet verification failed:', error);
      throw new Error('Failed to verify wallet ownership');
    }
  }

  // Validate Ethereum address
  validateAddress(address: string): boolean {
    try {
      return ethers.isAddress(address);
    } catch {
      return false;
    }
  }

  // Get wallet balance
  async getBalance(address: string): Promise<string> {
    try {
      const provider = new ethers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/demo'
      );
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  // Sign message with wallet
  async signMessage(message: string, address: string): Promise<string> {
    const connection = this.connectedWallets.find(w => w.address.toLowerCase() === address.toLowerCase());
    if (!connection || !connection.provider) {
      throw new Error('Wallet not connected or provider not available');
    }

    try {
      // For ethers v6 BrowserProvider
      const signer = await connection.provider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Message signing failed:', error);
      throw new Error('Failed to sign message');
    }
  }

  // Add wallet connection to storage
  private async addWalletConnection(connection: WalletConnection): Promise<void> {
    // Remove provider before storing (not serializable)
    const storableConnection = {
      ...connection,
      provider: undefined
    };

    // Check for duplicates
    const existingIndex = this.connectedWallets.findIndex(
      w => w.address.toLowerCase() === connection.address.toLowerCase()
    );

    if (existingIndex >= 0) {
      this.connectedWallets[existingIndex] = storableConnection;
    } else {
      this.connectedWallets.push(storableConnection);
    }

    // Save to localStorage with vonvault prefix (per API standardization)
    localStorage.setItem('vonvault-connected-wallets', JSON.stringify(this.connectedWallets));
    
    // Update user status with real-time USDT value
    await this.updateUserCryptoStatus();
  }

  // FIXED: Validate wallet connection persistence across navigation
  validateWalletConnections(): Promise<WalletConnection[]> {
    return new Promise((resolve) => {
      try {
        const storedWallets = localStorage.getItem('vonvault-connected-wallets');
        if (!storedWallets) {
          this.connectedWallets = [];
          resolve([]);
          return;
        }

        const parsedWallets = JSON.parse(storedWallets);
        
        // Validate each wallet connection
        const validWallets = parsedWallets.filter((wallet: WalletConnection) => {
          // Basic validation
          if (!wallet.address || !wallet.type || !wallet.network) {
            console.warn(`Invalid wallet connection found: ${wallet.address}`);
            return false;
          }

          // Address validation
          if (!this.validateAddress(wallet.address)) {
            console.warn(`Invalid wallet address: ${wallet.address}`);
            return false;
          }

          return true;
        });

        // Update connectedWallets with validated wallets
        this.connectedWallets = validWallets;
        
        // If some wallets were invalid, update storage
        if (validWallets.length !== parsedWallets.length) {
          localStorage.setItem('vonvault-connected-wallets', JSON.stringify(validWallets));
          console.log(`Cleaned up ${parsedWallets.length - validWallets.length} invalid wallet connections`);
        }

        resolve(validWallets);
      } catch (error) {
        console.error('Error validating wallet connections:', error);
        this.connectedWallets = [];
        localStorage.removeItem('vonvault-connected-wallets');
        resolve([]);
      }
    });
  }

  // FIXED: Restore wallet connections on app initialization
  async restoreWalletConnections(): Promise<void> {
    console.log('Restoring wallet connections from storage...');
    
    const validWallets = await this.validateWalletConnections();
    
    if (validWallets.length > 0) {
      console.log(`Restored ${validWallets.length} wallet connections`);
      
      // Update user crypto status
      await this.updateUserCryptoStatus();
    } else {
      console.log('No valid wallet connections to restore');
    }
  }

  // Update user crypto connection status
  private async updateUserCryptoStatus(): Promise<void> {
    const currentUser = secureStorage.getItem('currentUser'); // Fixed: using sessionStorage per API standardization
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        userData.crypto_connected = this.connectedWallets.length > 0;
        userData.connected_wallets_count = this.connectedWallets.length;
        userData.total_crypto_eth = this.calculateTotalValue(); // ETH amount
        userData.total_crypto_value = await this.calculateTotalValueUSDT(); // USDT value with real-time price
        
        secureStorage.setItem('currentUser', JSON.stringify(userData)); // Fixed: using sessionStorage per API standardization
      } catch (error) {
        console.error('Error updating user crypto status:', error);
      }
    }
  }

  // Calculate total crypto value in USDT using real-time price
  private async calculateTotalValueUSDT(): Promise<number> {
    const totalETH = this.connectedWallets.reduce((total, wallet) => {
      const balance = parseFloat(wallet.balance || '0');
      return total + balance;
    }, 0);

    if (totalETH === 0) return 0;

    try {
      // Fetch real ETH price from CoinGecko API
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      const data = await response.json();
      const ethPrice = data.ethereum?.usd;
      
      if (ethPrice && typeof ethPrice === 'number') {
        return totalETH * ethPrice;
      }
    } catch (error) {
      console.warn('Could not fetch real-time ETH price:', error);
    }

    // Fallback: Use a reasonable market estimate (updated periodically)
    const ETH_PRICE_FALLBACK = 2400; // Conservative estimate - should be updated monthly
    console.log('Using fallback ETH price estimate:', ETH_PRICE_FALLBACK);
    return totalETH * ETH_PRICE_FALLBACK;
  }

  // Calculate total crypto value - returns ETH amount
  private calculateTotalValue(): number {
    return this.connectedWallets.reduce((total, wallet) => {
      const balance = parseFloat(wallet.balance || '0');
      return total + balance; // Returns ETH amount
    }, 0);
  }

  // Disconnect wallet
  async disconnectWallet(address: string): Promise<void> {
    this.connectedWallets = this.connectedWallets.filter(
      w => w.address.toLowerCase() !== address.toLowerCase()
    );
    
    localStorage.setItem('vonvault-connected-wallets', JSON.stringify(this.connectedWallets)); // Fixed: vonvault prefix per API standardization
    await this.updateUserCryptoStatus();
  }

  // Get all connected wallets
  getConnectedWallets(): WalletConnection[] {
    return [...this.connectedWallets];
  }

  // Check if specific wallet type is available
  isWalletAvailable(type: WalletConnection['type']): boolean {
    switch (type) {
      case 'metamask':
        return !!(window.ethereum && window.ethereum.isMetaMask);
      case 'trust':
        return !!(window.ethereum && window.ethereum.isTrust);
      case 'coinbase':
        return !!(window.ethereum && window.ethereum.isCoinbaseWallet);
      case 'walletconnect':
        return true; // WalletConnect works everywhere
      case 'manual':
        return true; // Manual input always available
      default:
        return false;
    }
  }

  // REAL BLOCKCHAIN BALANCE FETCHING METHODS
  
  // USDT Token Contract (Ethereum Mainnet)
  private readonly USDT_CONTRACT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  private readonly USDT_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
  ];

  // USDC Token Contract (Ethereum Mainnet)  
  private readonly USDC_CONTRACT_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  private readonly USDC_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)'
  ];

  /**
   * Fetch real USDT balance from blockchain
   */
  async fetchRealUSDTBalance(walletAddress: string): Promise<number> {
    try {
      // Use public RPC provider for balance fetching
      const publicProvider = new ethers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/demo'
      );
      
      // Create contract instance
      const usdtContract = new ethers.Contract(
        this.USDT_CONTRACT_ADDRESS,
        this.USDT_ABI,
        publicProvider
      );
      
      // Get balance and decimals
      const balance = await usdtContract.balanceOf(walletAddress);
      const decimals = await usdtContract.decimals();
      
      // Convert to human-readable format
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return parseFloat(formattedBalance);
      
    } catch (error) {
      console.error('Error fetching USDT balance:', error);
      // Return 0 on error - no fake data
      return 0;
    }
  }

  /**
   * Fetch real USDC balance from blockchain
   */
  async fetchRealUSDCBalance(walletAddress: string): Promise<number> {
    try {
      // Use public RPC provider for balance fetching
      const publicProvider = new ethers.JsonRpcProvider(
        process.env.REACT_APP_RPC_URL || 'https://mainnet.infura.io/v3/demo'
      );
      
      // Create contract instance
      const usdcContract = new ethers.Contract(
        this.USDC_CONTRACT_ADDRESS,
        this.USDC_ABI,
        publicProvider
      );
      
      // Get balance and decimals
      const balance = await usdcContract.balanceOf(walletAddress);
      const decimals = await usdcContract.decimals();
      
      // Convert to human-readable format
      const formattedBalance = ethers.formatUnits(balance, decimals);
      return parseFloat(formattedBalance);
      
    } catch (error) {
      console.error('Error fetching USDC balance:', error);
      // Return 0 on error - no fake data
      return 0;
    }
  }

  /**
   * Fetch both USDT and USDC balances for a wallet
   */
  async fetchWalletCryptoBalances(walletAddress: string): Promise<{usdt: number, usdc: number}> {
    try {
      // Fetch both balances in parallel
      const [usdtBalance, usdcBalance] = await Promise.all([
        this.fetchRealUSDTBalance(walletAddress),
        this.fetchRealUSDCBalance(walletAddress)
      ]);
      
      return {
        usdt: usdtBalance,
        usdc: usdcBalance
      };
      
    } catch (error) {
      console.error('Error fetching wallet crypto balances:', error);
      return { usdt: 0, usdc: 0 };
    }
  }
}

// Global wallet service instance
export const cryptoWalletService = new CryptoWalletService();
export type { WalletConnection, WalletService };