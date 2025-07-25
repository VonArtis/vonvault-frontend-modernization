import React, { useState } from 'react';

interface WalletManagementScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const WalletManagementWithSwap: React.FC<WalletManagementScreenProps> = ({ onBack, onNavigate }) => {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapDirection, setSwapDirection] = useState({ from: null, to: null });
  const [swapAmount, setSwapAmount] = useState('');

  // Mock wallet data
  const wallet = {
    address: '0x742d35Cc6634C0532925a3b8D77b3f4C2D1234',
    name: 'MetaMask',
    totalValue: '$12,128.71'
  };

  const holdings = [
    { symbol: 'ETH', balance: '2.5847', usdValue: '4,250.32', icon: '⟠', price: '$1,645.22' },
    { symbol: 'BTC', balance: '0.1234', usdValue: '5,123.45', icon: '₿', price: '$41,523.12' },
    { symbol: 'USDC', balance: '1,250.00', usdValue: '1,250.00', icon: '💵', price: '$1.00' },
    { symbol: 'USDT', balance: '1,505.94', usdValue: '1,504.94', icon: '💰', price: '$0.999' }
  ];

  const userTier = 'VIP';
  const swapFees = { 'CLUB': '0.8%', 'PREMIUM': '0.6%', 'VIP': '0.4%', 'ELITE': '0.25%' };

  const handleSwap = (fromAsset, toAsset = null) => {
    setSwapDirection({ from: fromAsset, to: toAsset });
    setShowSwapModal(true);
    setSwapAmount('');
  };

  const calculateSwapFee = (amount) => {
    const feeRates = { 'CLUB': 0.008, 'PREMIUM': 0.006, 'VIP': 0.004, 'ELITE': 0.0025 };
    return (parseFloat(amount || 0) * feeRates[userTier]).toFixed(4);
  };

  const getSwapSuggestions = (asset) => {
    if (asset.symbol === 'ETH' || asset.symbol === 'BTC') {
      return [
        { symbol: 'USDC', icon: '💵', reason: 'For staking' },
        { symbol: 'USDT', icon: '💰', reason: 'For staking' }
      ];
    }
    return [
      { symbol: 'ETH', icon: '⟠', reason: 'Blue chip' },
      { symbol: 'BTC', icon: '₿', reason: 'Store of value' }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="text-gray-400 hover:text-white">←</button>
          
          <div className="flex items-center space-x-3">
            <svg width="32" height="32" viewBox="0 0 200 200" className="flex-shrink-0">
              <circle cx="100" cy="100" r="100" fill="#000000"/>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#8B5CF6" strokeWidth="8"/>
              <path d="M 65 65 L 100 135 L 135 65" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="16" 
                    strokeLinecap="square" 
                    strokeLinejoin="miter"/>
            </svg>
            <h1 className="text-xl font-bold text-white">Wallet Holdings</h1>
          </div>
          
          <button 
            onClick={() => setShowSwapModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-700 transition-all"
          >
            Swap
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Wallet Overview */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 font-semibold text-lg">{wallet.name}</p>
              <p className="text-sm text-gray-300">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{wallet.totalValue}</p>
              <p className="text-sm text-gray-400">Total Value</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleSwap(holdings.find(h => h.symbol === 'ETH'), holdings.find(h => h.symbol === 'USDC'))}
              className="bg-gradient-to-r from-orange-600/20 to-green-600/20 border border-orange-500/30 hover:border-orange-500/50 rounded-xl p-4 text-left transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⟠→💵</div>
                <div>
                  <p className="font-semibold text-white">ETH to USDC</p>
                  <p className="text-sm text-gray-400">Ready for staking</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => handleSwap(holdings.find(h => h.symbol === 'BTC'), holdings.find(h => h.symbol === 'USDC'))}
              className="bg-gradient-to-r from-yellow-600/20 to-green-600/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-xl p-4 text-left transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">₿→💵</div>
                <div>
                  <p className="font-semibold text-white">BTC to USDC</p>
                  <p className="text-sm text-gray-400">Ready for staking</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Holdings List */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold mb-4">Your Holdings</h3>
          <div className="space-y-4">
            {holdings.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{asset.icon}</span>
                  <div>
                    <p className="font-bold text-white">{asset.balance} {asset.symbol}</p>
                    <p className="text-sm text-gray-400">${asset.usdValue} • {asset.price}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getSwapSuggestions(asset).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSwap(asset, holdings.find(h => h.symbol === suggestion.symbol))}
                      className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg text-xs hover:bg-purple-600/30 transition-all"
                      title={`Swap to ${suggestion.symbol} - ${suggestion.reason}`}
                    >
                      {suggestion.icon}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handleSwap(asset)}
                    className="bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition-all"
                  >
                    Swap
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staking Readiness */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-green-400 text-xl mr-3">💰</span>
              <div>
                <p className="text-green-400 font-semibold">Staking Ready</p>
                <p className="text-sm text-gray-300">
                  ${(parseFloat(holdings.find(h => h.symbol === 'USDC')?.usdValue.replace(',', '') || 0) + 
                     parseFloat(holdings.find(h => h.symbol === 'USDT')?.usdValue.replace(',', '') || 0)).toLocaleString()} 
                  available for staking
                </p>
              </div>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-all">
              Start Staking
            </button>
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Swap Holdings</h2>
              <button
                onClick={() => setShowSwapModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* From Asset Selection */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-2">From</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  {swapDirection.from ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{swapDirection.from.icon}</span>
                        <div>
                          <p className="font-semibold">{swapDirection.from.symbol}</p>
                          <p className="text-sm text-gray-400">Balance: {swapDirection.from.balance}</p>
                        </div>
                      </div>
                      <input
                        type="number"
                        value={swapAmount}
                        onChange={(e) => setSwapAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-transparent text-right text-xl font-bold text-white placeholder-gray-500 border-none outline-none w-24"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {holdings.map((asset) => (
                        <button
                          key={asset.symbol}
                          onClick={() => setSwapDirection({...swapDirection, from: asset})}
                          className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
                        >
                          <span className="text-xl">{asset.icon}</span>
                          <span className="text-sm">{asset.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Arrow */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-600/20 rounded-full">
                  <span className="text-purple-400">↓</span>
                </div>
              </div>

              {/* To Asset Selection */}
              <div>
                <p className="text-sm text-gray-400 mb-2">To</p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  {swapDirection.to ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{swapDirection.to.icon}</span>
                        <div>
                          <p className="font-semibold">{swapDirection.to.symbol}</p>
                          <p className="text-sm text-gray-400">Estimated</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-400">
                          {swapAmount ? (parseFloat(swapAmount) - parseFloat(calculateSwapFee(swapAmount))).toFixed(4) : '0.00'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {holdings.filter(h => h.symbol !== swapDirection.from?.symbol).map((asset) => (
                        <button
                          key={asset.symbol}
                          onClick={() => setSwapDirection({...swapDirection, to: asset})}
                          className="flex items-center space-x-2 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all"
                        >
                          <span className="text-xl">{asset.icon}</span>
                          <span className="text-sm">{asset.symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Display */}
              {swapAmount && swapDirection.from && swapDirection.to && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{userTier} Tier Fee ({swapFees[userTier]})</span>
                    <span className="text-orange-400">-{calculateSwapFee(swapAmount)} {swapDirection.from.symbol}</span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <button
                disabled={!swapDirection.from || !swapDirection.to || !swapAmount}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Swap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletManagementWithSwap;
