import React, { useState } from 'react';
import { web3Service } from '../../services/web3Service';

interface StakingFlowConvertScreenProps {
  onNavigate?: (screen: string) => void;
}

const StakingFlowWithConvert: React.FC<StakingFlowConvertScreenProps> = ({ onNavigate }) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [convertAmount, setConvertAmount] = useState('');
  const [showConversion, setShowConversion] = useState(false);

  // Mock wallet balances
  const walletBalances = [
    { symbol: 'ETH', balance: '2.5847', usdValue: '4,250.32', icon: '⟠', canStake: false },
    { symbol: 'BTC', balance: '0.1234', usdValue: '5,123.45', icon: '₿', canStake: false },
    { symbol: 'USDC', balance: '1,250.00', usdValue: '1,250.00', icon: '💵', canStake: true },
    { symbol: 'USDT', balance: '500.00', usdValue: '500.00', icon: '💰', canStake: true }
  ];

  const userTier = 'VIP'; // Current user tier
  const swapFees = {
    'CLUB': '0.8%',
    'PREMIUM': '0.6%', 
    'VIP': '0.4%',
    'ELITE': '0.25%'
  };

  const handleConvertAndStake = (asset) => {
    setSelectedAsset(asset);
    setShowConversion(true);
  };

  const calculateSwapFee = (amount) => {
    const usdAmount = parseFloat(amount || '0');
    const vonVaultFeeRates = { 'CLUB': 0.008, 'PREMIUM': 0.006, 'VIP': 0.004, 'ELITE': 0.0025 };
    const platformFeeRate = 0.0085; // Reown fee
    
    // Network-specific gas fees to match web3Service
    const networkGasFees = {
      'ethereum': 15,  // Higher gas on Ethereum
      'polygon': 2,    // Lower gas on Polygon  
      'bsc': 1         // Lowest gas on BNB Smart Chain
    };
    const networkGasFee = networkGasFees['ethereum']; // Default to Ethereum, but could be dynamic
    
    const vonVaultFee = usdAmount * vonVaultFeeRates[userTier];
    const platformFee = usdAmount * platformFeeRate;
    const totalFees = vonVaultFee + platformFee + networkGasFee;
    const receivedAmount = usdAmount - totalFees;
    
    return {
      vonVaultFee: vonVaultFee.toFixed(2),
      platformFee: platformFee.toFixed(2),
      networkGasFee: networkGasFee.toFixed(2),
      totalFees: totalFees.toFixed(2),
      receivedAmount: receivedAmount.toFixed(2)
    };
  };

  const calculateReceived = (amount) => {
    const feeData = calculateSwapFee(amount);
    return feeData.receivedAmount;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
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
            Start Staking
          </h1>
          <p className="text-gray-400">Convert your crypto to USDC/USDT for staking</p>
        </div>

        {/* Your Assets */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Your Assets</h3>
          <div className="space-y-3">
            {walletBalances.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{asset.icon}</span>
                  <div>
                    <p className="font-semibold">{asset.balance} {asset.symbol}</p>
                    <p className="text-sm text-gray-400">${asset.usdValue}</p>
                  </div>
                </div>
                
                {asset.canStake ? (
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-all">
                    Stake Now
                  </button>
                ) : (
                  <button 
                    onClick={() => handleConvertAndStake(asset)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-all"
                  >
                    Convert to USDC
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Interface */}
        {showConversion && selectedAsset && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Convert to Stake</h3>
              <button 
                onClick={() => setShowConversion(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* From Asset */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">From</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedAsset.icon}</span>
                    <div>
                      <p className="font-semibold">{selectedAsset.symbol}</p>
                      <p className="text-sm text-gray-400">Balance: {selectedAsset.balance}</p>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-transparent text-right text-xl font-bold text-white placeholder-gray-500 border-none outline-none w-32"
                  />
                </div>
              </div>

              {/* Conversion Arrow */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-full">
                  <span className="text-purple-400">↓</span>
                </div>
              </div>

              {/* To Asset */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">To</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💵</span>
                    <div>
                      <p className="font-semibold">USDC</p>
                      <p className="text-sm text-gray-400">Ready for staking</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">
                      {convertAmount ? calculateReceived(convertAmount) : '0.00'}
                    </p>
                    <p className="text-sm text-gray-400">USDC</p>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              {convertAmount && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-medium flex items-center">
                      <span className="mr-2">✨</span>
                      {userTier} Tier Benefits
                    </span>
                    <span className="text-purple-300 font-bold">{swapFees[userTier]} fee</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {/* Complete Fee Transparency */}
                    <div className="flex justify-between text-white font-medium">
                      <span>You Pay:</span>
                      <span>{convertAmount && selectedAsset ? `${(parseFloat(convertAmount) / parseFloat(selectedAsset.usdValue.replace(',', ''))).toFixed(4)} ${selectedAsset.symbol} ($${convertAmount})` : '$0'}</span>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">VonVault Fee ({swapFees[userTier]}):</span>
                        <span className="text-orange-400">-${convertAmount ? calculateSwapFee(convertAmount).vonVaultFee : '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Platform Fee (0.85%):</span>
                        <span className="text-orange-400">-${convertAmount ? calculateSwapFee(convertAmount).platformFee : '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network Gas:</span>
                        <span className="text-orange-400">~${convertAmount ? calculateSwapFee(convertAmount).networkGasFee : '0.00'}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">You Receive:</span>
                        <span className="text-green-400">~${convertAmount ? calculateReceived(convertAmount) : '0.00'} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-red-400 font-medium">Total Fees:</span>
                        <span className="text-red-400 font-medium">${convertAmount ? calculateSwapFee(convertAmount).totalFees : '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  disabled={!convertAmount}
                  onClick={async () => {
                    if (convertAmount && selectedAsset) {
                      try {
                        // Execute swap with fee routing to operations wallet
                        const swapResult = await web3Service.executeSwapWithFeeRouting(
                          selectedAsset.symbol,
                          'USDC',
                          convertAmount,
                          userTier
                        );
                        
                        console.log('✅ Swap completed with fee routing:', swapResult);
                        
                        // Redirect to create staking screen
                        window.location.href = '/create';
                      } catch (error) {
                        console.error('❌ Swap execution failed:', error);
                        alert('Swap failed: ' + error.message);
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-purple-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Convert & Start Staking
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Conversion uses Reown's 300+ liquidity sources for best rates
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    💰 All swap fees are routed to VonVault Operations Wallet
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier Benefits */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
          <h4 className="text-blue-400 font-medium mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Your {userTier} Benefits
          </h4>
          <div className="text-sm text-blue-200 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">✓</span>
              <span>Only {swapFees[userTier]} conversion fee (vs 1%+ on exchanges)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">✓</span>
              <span>Best swap rates from 300+ liquidity sources</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">✓</span>
              <span>Instant conversion + staking in one transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingFlowWithConvert;
