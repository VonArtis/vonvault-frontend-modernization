// Reown AppKit Universal Wallet Service - 600+ Wallet Support
import { createAppKit } from '@reown/appkit'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { BrowserProvider } from 'ethers'

// Define networks for Reown AppKit
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

const polygon = {
  chainId: 137,
  name: 'Polygon',
  currency: 'MATIC',
  explorerUrl: 'https://polygonscan.com',
  rpcUrl: 'https://polygon-rpc.com'
}

const arbitrum = {
  chainId: 42161,
  name: 'Arbitrum One',
  currency: 'ETH',
  explorerUrl: 'https://arbiscan.io',
  rpcUrl: 'https://arb1.arbitrum.io/rpc'
}

const optimism = {
  chainId: 10,
  name: 'Optimism',
  currency: 'ETH',
  explorerUrl: 'https://optimistic.etherscan.io',
  rpcUrl: 'https://mainnet.optimism.io'
}

const base = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://mainnet.base.org'
}

// VonVault Reown AppKit Configuration
const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

const metadata = {
  name: 'VonVault',
  description: 'VonVault DeFi Investment Platform',
  url: 'https://vonartis.app',
  icons: ['https://vonartis.app/favicon.ico']
}

// Supported chains for VonVault
const chains = [
  mainnet,
  arbitrum,
  polygon,
  optimism,
  base
]

// Create Ethers adapter
const ethersAdapter = new EthersAdapter()

// Create Reown AppKit instance
const appKit = createAppKit({
  adapters: [ethersAdapter],
  networks: chains as any, // Type assertion to handle AppKit network requirements
  projectId,
  metadata,
  themeMode: 'dark', // Match VonVault design
  themeVariables: {
    '--w3m-color-mix': '#9333ea', // VonVault purple
    '--w3m-color-mix-strength': 20,
    '--w3m-accent': '#9333ea',
    '--w3m-border-radius-master': '8px',
  },
  includeWalletIds: [
    // Priority wallets for VonVault
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa', // Coinbase Wallet
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
    '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927', // Ledger Live
    '163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3', // Frame
  ],
  excludeWalletIds: [
    // Exclude problematic or deprecated wallets
  ],
})

// Interface for VonVault wallet connections
export interface ReownAppKitConnection {
  address: string
  chainId: number
  provider: any
  isConnected: boolean
  walletInfo?: {
    name: string
    icon: string
  }
}

class ReownAppKitService {
  private connection: ReownAppKitConnection | null = null
  private connectedWallets: ReownAppKitConnection[] = []

  constructor() {
    this.initializeListeners()
    this.loadStoredConnections()
  }

  // Initialize Reown AppKit event listeners
  private initializeListeners() {
    // Note: Reown AppKit uses different event system
    // The appKit object doesn't have subscribeProvider/subscribeAccount methods
    // These are handled through ethereum provider events after connection
    
    console.log('Reown AppKit service initialized - events handled post-connection')
    
    // Events will be set up after wallet connection in connectWallet method
  }

  // Handle new wallet connection
  private async handleConnection(provider: any, address: string, chainId: number) {
    try {
      const ethersProvider = new BrowserProvider(provider)
      
      const connection: ReownAppKitConnection = {
        address,
        chainId,
        provider: ethersProvider,
        isConnected: true,
        walletInfo: {
          name: (appKit.getWalletProvider() as any)?.name || 'Connected Wallet',
          icon: (appKit.getWalletProvider() as any)?.icon || ''
        }
      }

      this.connection = connection
      this.addWalletConnection(connection)
      this.updateUserCryptoStatus()

      console.log('Reown AppKit connection established:', {
        address: address.slice(0, 6) + '...' + address.slice(-4),
        chain: chainId,
        wallet: connection.walletInfo?.name
      })

    } catch (error) {
      console.error('Error handling Reown AppKit connection:', error)
      throw new Error('Failed to establish wallet connection')
    }
  }

  // Handle wallet disconnection
  private handleDisconnection() {
    this.connection = null
    this.updateUserCryptoStatus()
    console.log('Wallet disconnected')
  }

  // Update existing connection
  private updateConnection(address: string, chainId?: number) {
    if (this.connection && this.connection.address.toLowerCase() === address.toLowerCase()) {
      if (chainId) {
        this.connection.chainId = chainId
      }
      this.updateUserCryptoStatus()
    }
  }

  // Public methods for VonVault integration
  
  // Open Reown AppKit connection interface
  async connectWallet(): Promise<ReownAppKitConnection> {
    try {
      // Open Reown AppKit modal
      await appKit.open()
      
      // Wait for connection to be established
      const provider = appKit.getWalletProvider() as any
      if (!provider) {
        throw new Error('Failed to connect to wallet')
      }

      // Create ethers provider from Reown AppKit connection
      const ethersProvider = new BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const address = await signer.getAddress()
      const network = await ethersProvider.getNetwork()

      const connection: ReownAppKitConnection = {
        address,
        chainId: Number(network.chainId),
        provider: ethersProvider,
        isConnected: true,
        walletInfo: {
          name: (provider as any)?.name || 'Connected Wallet',
          icon: (provider as any)?.icon || '🦊'
        }
      }

      // Set up provider event listeners for this connection
      if (provider && provider.on) {
        provider.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length > 0) {
            this.updateConnection(accounts[0])
          } else {
            this.handleDisconnection()
          }
        })

        provider.on('chainChanged', (chainId: string) => {
          if (this.connection) {
            this.connection.chainId = parseInt(chainId, 16)
            this.updateUserCryptoStatus()
          }
        })

        provider.on('disconnect', () => {
          this.handleDisconnection()
        })
      }

      this.connection = connection
      this.addWalletConnection(connection)
      this.updateUserCryptoStatus()

      console.log('Reown AppKit connection established:', {
        address: address.slice(0, 6) + '...' + address.slice(-4),
        chain: Number(network.chainId),
        wallet: connection.walletInfo?.name
      })

      return connection

    } catch (error: any) {
      console.error('Reown AppKit connection failed:', error)
      throw new Error(error.message || 'Failed to connect wallet')
    }
  }

  // Disconnect current wallet (CORRECT Reown AppKit API)
  async disconnectWallet(): Promise<void> {
    try {
      await appKit.disconnect()
      this.connection = null
      this.updateUserCryptoStatus()
    } catch (error) {
      console.error('Error disconnecting wallet:', error)
      // Even if appKit.disconnect fails, clear our local state
      this.connection = null
      this.updateUserCryptoStatus()
    }
  }

  // Get current connection status
  getConnection(): ReownAppKitConnection | null {
    return this.connection
  }

  // Get all connected wallets
  getConnectedWallets(): ReownAppKitConnection[] {
    return [...this.connectedWallets]
  }

  // Check if wallet is connected
  isConnected(): boolean {
    return !!this.connection?.isConnected
  }

  // Get wallet balance
  async getBalance(address?: string): Promise<string> {
    try {
      const targetAddress = address || this.connection?.address
      if (!targetAddress || !this.connection?.provider) {
        throw new Error('No wallet connected')
      }

      const balance = await this.connection.provider.getBalance(targetAddress)
      return balance.toString()
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }

  // Sign message
  async signMessage(message: string): Promise<string> {
    try {
      if (!this.connection?.provider) {
        throw new Error('No wallet connected')
      }

      const signer = await this.connection.provider.getSigner()
      return await signer.signMessage(message)
    } catch (error) {
      console.error('Error signing message:', error)
      throw new Error('Failed to sign message')
    }
  }

  // Add manual wallet (for compatibility with existing VonVault system)
  async addManualWallet(address: string, name: string = 'Manual Wallet'): Promise<ReownAppKitConnection> {
    try {
      // Validate address format
      if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new Error('Invalid Ethereum address format')
      }

      // Check if wallet already exists
      const existing = this.connectedWallets.find(
        w => w.address.toLowerCase() === address.toLowerCase()
      )
      if (existing) {
        throw new Error('This wallet address is already connected')
      }

      // Create manual connection (view-only)
      const manualConnection: ReownAppKitConnection = {
        address,
        chainId: 1, // Default to mainnet
        provider: new BrowserProvider(window.ethereum || {
          request: async () => { throw new Error('No wallet provider'); }
        } as any),
        isConnected: true,
        walletInfo: {
          name,
          icon: '📝'
        }
      }

      this.addWalletConnection(manualConnection)
      return manualConnection

    } catch (error: any) {
      console.error('Manual wallet connection failed:', error)
      throw new Error(error.message || 'Failed to add manual wallet')
    }
  }

  // Private helper methods

  private addWalletConnection(connection: ReownAppKitConnection) {
    // Remove existing connection with same address
    this.connectedWallets = this.connectedWallets.filter(
      w => w.address.toLowerCase() !== connection.address.toLowerCase()
    )

    // Add new connection
    this.connectedWallets.push(connection)

    // Save to localStorage (without provider)
    this.saveConnections()
  }

  private saveConnections() {
    const storableConnections = this.connectedWallets.map(conn => ({
      address: conn.address,
      chainId: conn.chainId,
      isConnected: conn.isConnected,
      walletInfo: conn.walletInfo
    }))

    localStorage.setItem('reown_appkit_connections', JSON.stringify(storableConnections))
  }

  private loadStoredConnections() {
    try {
      const stored = localStorage.getItem('reown_appkit_connections')
      if (stored) {
        const connections = JSON.parse(stored)
        // Note: We can't restore the provider, so these become view-only
        this.connectedWallets = connections.map((conn: any) => ({
          ...conn,
          provider: null // Will need to reconnect for transactions
        }))
      }
    } catch (error) {
      console.error('Error loading stored connections:', error)
    }
  }

  // Update user crypto connection status (VonVault integration)
  private updateUserCryptoStatus() {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser)
        userData.crypto_connected = this.connectedWallets.length > 0
        userData.connected_wallets_count = this.connectedWallets.length
        userData.total_crypto_value = this.calculateTotalValue()
        
        localStorage.setItem('currentUser', JSON.stringify(userData))
      } catch (error) {
        console.error('Error updating user crypto status:', error)
      }
    }
  }

  // Calculate total crypto value (rough estimation)
  private calculateTotalValue(): number {
    // In production, you'd fetch real-time token prices
    const ethPrice = 3000 // Rough ETH price
    
    return this.connectedWallets.reduce((total, wallet) => {
      // This is a simplified calculation
      // In production, you'd fetch actual token balances and prices
      return total + 1000 // Placeholder value
    }, 0)
  }

  // Get Reown AppKit instance (for advanced usage)
  getModal() {
    return appKit
  }
}

// Export singleton instance
export const reownAppKitService = new ReownAppKitService()