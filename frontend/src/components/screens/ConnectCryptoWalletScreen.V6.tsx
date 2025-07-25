import React, { useState, useEffect } from 'react';

interface ConnectWalletScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
  onConnect?: () => void;
}

const ConnectWalletScreen: React.FC<ConnectWalletScreenProps> = ({ onBack, onNavigate, onConnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [manualName, setManualName] = useState('');
  const [connectionStep, setConnectionStep] = useState('select'); // select, connecting, success
  const [selectedWallet, setSelectedWallet] = useState(null);

  // Mock connection data for success state
  const mockSuccessConnection = {
    address: '0x742d35Cc6634C0532925a3b8D77b3f4C2D1234',
    walletName: 'MetaMask',
    chainId: 1,
    balance: '2.5847 ETH'
  };

  // Popular wallets for quick access
  const popularWallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      description: 'Most popular Ethereum wallet',
      icon: '🦊',
      gradient: 'from-orange-600/20 to-yellow-600/10',
      border: 'border-orange-500/30',
      hoverBorder: 'hover:border-orange-500/50',
      hoverGradient: 'hover:from-orange-600/30 hover:to-yellow-600/20'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      description: 'Connect any mobile wallet',
      icon: '🔗',
      gradient: 'from-blue-600/20 to-cyan-600/10',
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500/50',
      hoverGradient: 'hover:from-blue-600/30 hover:to-cyan-600/20'
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      description: 'Secure multi-chain wallet',
      icon: '🛡️',
      gradient: 'from-cyan-600/20 to-blue-600/10',
      border: 'border-cyan-500/30',
      hoverBorder: 'hover:border-cyan-500/50',
      hoverGradient: 'hover:from-cyan-600/30 hover:to-blue-600/20'
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      description: 'Self-custody by Coinbase',
      icon: '💎',
      gradient: 'from-blue-600/20 to-indigo-600/10',
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500/50',
      hoverGradient: 'hover:from-blue-600/30 hover:to-indigo-600/20'
    }
  ];

  // Handle Reown AppKit universal connection
  const handleUniversalConnect = async () => {
    setLoading(true);
    setError(null);
    setConnectionStep('connecting');
    setSelectedWallet({ name: 'Universal Connect', icon: '🌐' });
    
    try {
      // Simulate Reown AppKit connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      setSuccess({
        ...mockSuccessConnection,
        walletName: 'Connected Wallet'
      });
      setConnectionStep('success');
      
      // Navigate after delay to security hub for onboarding
      setTimeout(() => {
        onNavigate?.('security-hub');
      }, 3000);
      
    } catch (error) {
      setError('Failed to connect wallet. Please try again.');
      setConnectionStep('select');
    } finally {
      setLoading(false);
    }
  };

  // Handle specific wallet connection
  const handleWalletConnect = async (wallet) => {
    setLoading(true);
    setError(null);
    setConnectionStep('connecting');
    setSelectedWallet(wallet);
    
    try {
      // Simulate wallet-specific connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess({
        ...mockSuccessConnection,
        walletName: wallet.name
      });
      setConnectionStep('success');
      
      // Navigate after delay to security hub for onboarding
      setTimeout(() => {
        onNavigate?.('security-hub');
      }, 3000);
      
    } catch (error) {
      setError(`Failed to connect to ${wallet.name}. Please try again.`);
      setConnectionStep('select');
    } finally {
      setLoading(false);
    }
  };

  // Handle manual wallet entry
  const handleManualConnect = async () => {
    if (!manualAddress) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    setConnectionStep('connecting');
    setSelectedWallet({ name: manualName || 'Manual Wallet', icon: '🔧' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess({
        address: manualAddress,
        walletName: manualName || 'Manual Wallet',
        chainId: 1,
        balance: 'View-only mode'
      });
      setConnectionStep('success');
      
      setTimeout(() => {
        onNavigate?.('security-hub');
      }, 3000);
      
    } catch (error) {
      setError('Failed to add manual wallet. Please check the address.');
      setConnectionStep('select');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    onBack?.();
  };

  const handleRetry = () => {
    setError(null);
    setConnectionStep('select');
    setSelectedWallet(null);
  };

  // Connecting state
  if (connectionStep === 'connecting') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl animate-pulse"></div>

        <div className="text-center">
          <div className="mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="text-4xl">{selectedWallet?.icon || '🔗'}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Connecting to {selectedWallet?.name}
          </h2>
          <p className="text-gray-400 mb-6">
            Please confirm the connection in your wallet
          </p>
          
          <div className="space-y-2 text-sm text-gray-500">
            <p>✓ Establishing secure connection</p>
            <p>⏳ Waiting for wallet confirmation</p>
            <p className="text-purple-400">🔐 Your keys remain secure</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (connectionStep === 'success' && success) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>

        {/* Back/Skip Button */}
        <div className="absolute top-6 left-6">
          <button 
            onClick={() => {
              onNavigate?.('security-hub');
              // Reset state to allow going back if needed
              setConnectionStep('select');
              setSuccess(null);
            }}
            className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
            aria-label="Continue to security setup"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <span className="text-4xl">✅</span>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Wallet Connected!
            </h2>
            <p className="text-gray-400 mb-6">
              Welcome to VonVault premium staking
            </p>
          </div>

          {/* Connection Details */}
          <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Wallet</span>
                <span className="text-white font-medium">{success.walletName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Address</span>
                <span className="text-white font-mono text-sm">
                  {success.address.slice(0, 6)}...{success.address.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network</span>
                <span className="text-green-400 font-medium">
                  {success.chainId === 1 ? 'Ethereum Mainnet' : `Chain ${success.chainId}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Balance</span>
                <span className="text-blue-400 font-medium">{success.balance}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={() => {
                onNavigate?.('security-hub');
              }}
              className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02]"
            >
              Continue to Security Setup
            </button>
            
            <button
              onClick={() => {
                setConnectionStep('select');
                setSuccess(null);
                setError(null);
              }}
              className="w-full bg-gray-800 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-700 transition-all border border-gray-700"
            >
              Connect Different Wallet
            </button>
          </div>

          {/* Next Steps Preview */}
          <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
            <div className="text-center">
              <p className="text-purple-400 font-semibold mb-2">🚀 Ready for Premium Staking</p>
              <p className="text-sm text-gray-300">
                Start earning up to 20% APY with your connected wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main connection screen
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={handleBack}
          className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 pt-16 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 200 200" className="mx-auto">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="100" fill="#000000"/>
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                fill="none" 
                stroke="url(#logoGradient)" 
                strokeWidth="8"
              />
              <path 
                d="M 65 65 L 100 135 L 135 65" 
                fill="none" 
                stroke="url(#logoGradient)" 
                strokeWidth="16" 
                strokeLinecap="square" 
                strokeLinejoin="miter"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Connect Your Wallet
          </h1>
          <p className="text-gray-400 mb-2">
            Access 600+ wallets with universal support
          </p>
          <p className="text-sm text-gray-500">
            Your keys, your control - always secure
          </p>
        </div>

        {/* Universal Connect - Primary Option */}
        <div className="mb-6">
          <button
            onClick={handleUniversalConnect}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-500/40 rounded-xl p-6 text-left hover:border-purple-500/60 hover:from-purple-600/30 hover:to-blue-600/30 transition-all transform hover:scale-[1.02] group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-xl flex items-center justify-center group-hover:from-purple-600/40 group-hover:to-blue-600/40 transition-all">
                <span className="text-3xl">🌍</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-bold text-white">Universal Connect</h3>
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                    RECOMMENDED
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Connect to 600+ wallets including MetaMask, Trust, Ledger, and more
                </p>
                <div className="flex items-center text-xs text-green-400">
                  <span className="mr-2">✓</span>
                  <span>One-click connection to any wallet</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Popular Wallets Quick Access */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3 text-center">
            Or choose a popular wallet
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {popularWallets.map((wallet) => (
              <button
                key={wallet.id}
                onClick={() => handleWalletConnect(wallet)}
                disabled={loading}
                className={`bg-gradient-to-br ${wallet.gradient} border ${wallet.border} rounded-xl p-4 text-center ${wallet.hoverBorder} ${wallet.hoverGradient} transition-all transform hover:scale-[1.05] group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                <div className="text-2xl mb-2">{wallet.icon}</div>
                <p className="text-xs font-medium text-white group-hover:text-gray-100">
                  {wallet.name}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="w-full flex items-center justify-center space-x-2 py-3 text-sm text-gray-400 hover:text-gray-300 transition-colors"
          >
            <span>Advanced Options</span>
            <span className={`transform transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>

          {/* Manual Entry */}
          {showAdvancedOptions && (
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 space-y-4">
              <h4 className="text-sm font-medium text-white">Manual Wallet Entry</h4>
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="0x... wallet address"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none font-mono text-sm"
              />
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="Wallet name (optional)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              />
              <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <span className="text-amber-400 text-sm">⚠️</span>
                  <p className="text-amber-300 text-xs">
                    Manual wallets are view-only. For transactions, use Universal Connect above.
                  </p>
                </div>
              </div>
              <button
                onClick={handleManualConnect}
                disabled={!manualAddress || loading}
                className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Manual Wallet
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <span className="text-red-400 text-xl">❌</span>
              <div className="flex-1">
                <h4 className="text-red-400 font-semibold mb-1">Connection Failed</h4>
                <p className="text-red-200 text-sm mb-3">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-red-600/20 text-red-400 py-2 px-4 rounded-lg text-sm hover:bg-red-600/30 transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security & Benefits */}
        <div className="space-y-4">
          {/* Security Assurance */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <span className="text-blue-400 text-xl">🛡️</span>
              <div>
                <p className="text-blue-400 text-sm font-medium">
                  Bank-Grade Security
                </p>
                <p className="text-blue-200 text-xs">
                  VonVault never has access to your private keys. Your wallet remains fully under your control.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Preview */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
            <h4 className="text-green-400 font-medium mb-3 flex items-center">
              <span className="mr-2">✨</span>
              What You'll Get
            </h4>
            <div className="text-sm text-green-200 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Access to premium staking tiers (up to 20% APY)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Only 0.75% platform fee (92% savings vs competitors)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Multi-chain support & instant withdrawals</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Professional analytics & portfolio tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Already Have Account */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help connecting?{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              View Setup Guide
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletScreen;
