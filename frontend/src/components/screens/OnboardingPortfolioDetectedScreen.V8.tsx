import React, { useState } from 'react';

const OnboardingConvertFlow = () => {
  const [currentStep, setCurrentStep] = useState('detection'); // detection, convert, staking
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [convertAmounts, setConvertAmounts] = useState({});

  // Mock detected wallet balances after connection
  const detectedAssets = [
    { symbol: 'ETH', balance: '2.5847', usdValue: '4,250.32', icon: '⟠', canStake: false, priority: 'high' },
    { symbol: 'BTC', balance: '0.1234', usdValue: '5,123.45', icon: '₿', canStake: false, priority: 'high' },
    { symbol: 'USDC', balance: '1,250.00', usdValue: '1,250.00', icon: '💵', canStake: true, priority: 'ready' },
    { symbol: 'MATIC', balance: '450.00', usdValue: '425.50', icon: '🔷', canStake: false, priority: 'low' },
    { symbol: 'LINK', balance: '25.5', usdValue: '485.50', icon: '🔗', canStake: false, priority: 'low' }
  ];

  const userTier = 'CLUB'; // New user starts at CLUB
  const swapFees = { 'CLUB': '0.8%', 'PREMIUM': '0.6%', 'VIP': '0.4%', 'ELITE': '0.25%' };

  const stakeableAmount = detectedAssets
    .filter(asset => asset.canStake)
    .reduce((sum, asset) => sum + parseFloat(asset.usdValue.replace(',', '')), 0);

  const convertibleAmount = detectedAssets
    .filter(asset => !asset.canStake && asset.priority === 'high')
    .reduce((sum, asset) => sum + parseFloat(asset.usdValue.replace(',', '')), 0);

  const totalPortfolioValue = detectedAssets
    .reduce((sum, asset) => sum + parseFloat(asset.usdValue.replace(',', '')), 0);

  const handleSelectAsset = (asset) => {
    if (selectedAssets.includes(asset.symbol)) {
      setSelectedAssets(selectedAssets.filter(s => s !== asset.symbol));
      const newAmounts = { ...convertAmounts };
      delete newAmounts[asset.symbol];
      setConvertAmounts(newAmounts);
    } else {
      setSelectedAssets([...selectedAssets, asset.symbol]);
      setConvertAmounts({
        ...convertAmounts,
        [asset.symbol]: asset.balance
      });
    }
  };

  const calculateTotalAfterConversion = () => {
    let total = stakeableAmount;
    selectedAssets.forEach(symbol => {
      const asset = detectedAssets.find(a => a.symbol === symbol);
      const amount = parseFloat(convertAmounts[symbol] || 0);
      const feeRate = 0.008; // CLUB tier
      total += (amount * parseFloat(asset.usdValue.replace(',', '')) / parseFloat(asset.balance)) * (1 - feeRate);
    });
    return total;
  };

  if (currentStep === 'detection') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full space-y-6">
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
              Portfolio Detected!
            </h1>
            <p className="text-gray-400">We found ${totalPortfolioValue.toLocaleString()} in your wallet</p>
          </div>

          {/* Portfolio Breakdown */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4">Your Assets</h3>
            
            {/* Ready to Stake */}
            {stakeableAmount > 0 && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-green-400 text-xl mr-3">✅</span>
                    <div>
                      <p className="text-green-400 font-semibold">Ready to Stake</p>
                      <p className="text-sm text-gray-300">${stakeableAmount.toLocaleString()} USDC/USDT</p>
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">
                    15% APY
                  </div>
                </div>
              </div>
            )}

            {/* Need Conversion */}
            {convertibleAmount > 0 && (
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-orange-400 text-xl mr-3">💱</span>
                    <div>
                      <p className="text-orange-400 font-semibold">Can Convert & Stake</p>
                      <p className="text-sm text-gray-300">${convertibleAmount.toLocaleString()} ETH/BTC</p>
                    </div>
                  </div>
                  <div className="text-orange-400 font-bold">
                    {swapFees[userTier]} fee
                  </div>
                </div>
              </div>
            )}

            {/* Asset List */}
            <div className="space-y-2">
              {detectedAssets.map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{asset.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{asset.balance} {asset.symbol}</p>
                      <p className="text-sm text-gray-400">${asset.usdValue}</p>
                    </div>
                  </div>
                  
                  {asset.canStake ? (
                    <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-xs">
                      Stakeable
                    </span>
                  ) : asset.priority === 'high' ? (
                    <span className="bg-orange-600/20 text-orange-300 px-2 py-1 rounded-full text-xs">
                      Convert
                    </span>
                  ) : (
                    <span className="bg-gray-600/20 text-gray-400 px-2 py-1 rounded-full text-xs">
                      Hold
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {convertibleAmount > 0 && (
              <button
                onClick={() => setCurrentStep('convert')}
                className="w-full bg-gradient-to-r from-orange-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-orange-700 hover:to-purple-700 transition-all"
              >
                Convert & Maximize Earnings →
              </button>
            )}
            
            {stakeableAmount > 0 && (
              <button
                onClick={() => setCurrentStep('staking')}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-all"
              >
                Stake ${stakeableAmount.toLocaleString()} Now →
              </button>
            )}

            {stakeableAmount === 0 && convertibleAmount === 0 && (
              <button className="w-full bg-gray-700 text-gray-300 py-4 rounded-xl font-semibold">
                No Assets Available for Staking
              </button>
            )}
          </div>

          {/* Education */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center">
              <span className="mr-2">💡</span>
              Why Convert?
            </h4>
            <div className="text-sm text-blue-200 space-y-1">
              <p>• VonVault treasury only accepts USDC/USDT for guaranteed returns</p>
              <p>• Converting unlocks 15% APY on your crypto holdings</p>
              <p>• {userTier} tier gets {swapFees[userTier]} conversion fee (lower than exchanges)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'convert') {
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
            
            <button
              onClick={() => setCurrentStep('detection')}
              className="text-gray-400 hover:text-white mb-4"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Convert to Earn
            </h1>
            <p className="text-gray-400">Select assets to convert to USDC for staking</p>
          </div>

          {/* Conversion Summary */}
          <div className="bg-gradient-to-r from-purple-900/30 to-green-900/20 border border-purple-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 font-semibold">Projected Staking Power</p>
                <p className="text-sm text-gray-300">After conversion + existing USDC</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">
                  ${calculateTotalAfterConversion().toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Available to stake</p>
              </div>
            </div>
          </div>

          {/* Asset Selection */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold mb-4">Select Assets to Convert</h3>
            <div className="space-y-3">
              {detectedAssets.filter(asset => !asset.canStake && asset.priority === 'high').map((asset) => (
                <div key={asset.symbol} className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                  selectedAssets.includes(asset.symbol) 
                    ? 'border-purple-500 bg-purple-900/20' 
                    : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                }`}>
                  <div 
                    className="flex items-center justify-between mb-3"
                    onClick={() => handleSelectAsset(asset)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAssets.includes(asset.symbol)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-600'
                      }`}>
                        {selectedAssets.includes(asset.symbol) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className="text-2xl">{asset.icon}</span>
                      <div>
                        <p className="font-semibold text-white">{asset.symbol}</p>
                        <p className="text-sm text-gray-400">Balance: {asset.balance}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">${asset.usdValue}</p>
                      <p className="text-sm text-gray-400">{swapFees[userTier]} fee</p>
                    </div>
                  </div>

                  {selectedAssets.includes(asset.symbol) && (
                    <div className="border-t border-gray-700 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Amount to convert:</span>
                        <input
                          type="number"
                          value={convertAmounts[asset.symbol] || ''}
                          onChange={(e) => setConvertAmounts({
                            ...convertAmounts,
                            [asset.symbol]: e.target.value
                          })}
                          max={asset.balance}
                          placeholder={asset.balance}
                          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm w-24 text-right"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Complete Conversion Preview */}
          {selectedAssets.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Complete Cost Breakdown</h3>
              <div className="space-y-4">
                {selectedAssets.map(symbol => {
                  const asset = detectedAssets.find(a => a.symbol === symbol);
                  const amount = parseFloat(convertAmounts[symbol] || asset.balance);
                  const usdAmount = amount * parseFloat(asset.usdValue.replace(',', '')) / parseFloat(asset.balance);
                  const vonvaultFee = usdAmount * 0.008; // CLUB fee
                  const platformFee = usdAmount * 0.0085; // Reown fee
                  const gasFee = 15; // Estimated gas
                  const totalFees = vonvaultFee + platformFee + gasFee;
                  const received = usdAmount - totalFees;
                  
                  return (
                    <div key={symbol} className="bg-gray-800/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{asset.icon}</span>
                          <span className="font-semibold text-white">{amount.toFixed(4)} {symbol}</span>
                        </div>
                        <span className="text-green-400 font-semibold">${received.toFixed(2)} USDC</span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">You Pay</span>
                          <span className="text-white">${usdAmount.toFixed(2)}</span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between">
                          <span className="text-gray-400">VonVault Fee (0.8%)</span>
                          <span className="text-orange-400">-${vonvaultFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Platform Fee (0.85%)</span>
                          <span className="text-orange-400">-${platformFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Network Gas (est.)</span>
                          <span className="text-orange-400">-$15.00</span>
                        </div>
                        <hr className="border-gray-600" />
                        <div className="flex justify-between text-red-400 font-medium">
                          <span className="text-xs">Total Fees</span>
                          <span className="text-xs">${totalFees.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-400 font-semibold">Total USDC Received</span>
                    <span className="text-green-400 font-bold text-lg">
                      ${selectedAssets.reduce((total, symbol) => {
                        const asset = detectedAssets.find(a => a.symbol === symbol);
                        const amount = parseFloat(convertAmounts[symbol] || asset.balance);
                        const usdAmount = amount * parseFloat(asset.usdValue.replace(',', '')) / parseFloat(asset.balance);
                        const vonvaultFee = usdAmount * 0.008;
                        const platformFee = usdAmount * 0.0085;
                        const gasFee = 15;
                        const received = usdAmount - vonvaultFee - platformFee - gasFee;
                        return total + received;
                      }, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              disabled={selectedAssets.length === 0}
              onClick={() => setCurrentStep('staking')}
              className="w-full bg-gradient-to-r from-purple-600 to-green-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Convert & Start Staking →
            </button>
            
            <button
              onClick={() => setCurrentStep('staking')}
              className="w-full border border-gray-700 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-800 transition-all"
            >
              Skip - Stake Existing USDC Only
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Staking confirmation step
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-6">
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
            Ready to Stake!
          </h1>
          <p className="text-gray-400">
            ${calculateTotalAfterConversion().toLocaleString()} available for 15% APY staking
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-purple-600/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Your Staking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Amount:</span>
              <span className="text-white font-semibold">${calculateTotalAfterConversion().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Annual Yield (15%):</span>
              <span className="text-green-400 font-semibold">+${(calculateTotalAfterConversion() * 0.15).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Income:</span>
              <span className="text-green-400 font-semibold">${(calculateTotalAfterConversion() * 0.15 / 12).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform Fee:</span>
              <span className="text-white font-semibold">0.75%</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-green-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-purple-700 transition-all">
          Start Earning 15% APY →
        </button>
      </div>
    </div>
  );
};

export default OnboardingConvertFlow;
