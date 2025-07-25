import React, { useState, useEffect } from 'react';

interface CreateStakingScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const CreateStakingScreen: React.FC<CreateStakingScreenProps> = ({ onBack, onNavigate }) => {
  const [showSimpleMode, setShowSimpleMode] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [selectedPeriod, setSelectedPeriod] = useState(365);
  const [showCalculator, setShowCalculator] = useState(false);
  
  // Available tokens
  const tokens = [
    { symbol: 'USDC', name: 'USD Coin', balance: 12500.00 },
    { symbol: 'USDT', name: 'Tether USD', balance: 8750.50 },
  ];

  // Staking periods
  const periods = [
    { days: 30, apy: 5, tier: 'BASIC' },
    { days: 90, apy: 8, tier: 'CLUB' },
    { days: 180, apy: 12, tier: 'PREMIUM' },
    { days: 365, apy: 15, tier: 'VIP' }
  ];

  // Calculate tier based on amount
  const calculateTier = (stakeAmount: number) => {
    if (stakeAmount >= 200000) return { name: 'ELITE', apy: 20, color: '#F59E0B' };
    if (stakeAmount >= 50000) return { name: 'VIP', apy: 15, color: '#8B5CF6' };
    if (stakeAmount >= 10000) return { name: 'PREMIUM', apy: 12, color: '#3B82F6' };
    if (stakeAmount >= 1000) return { name: 'CLUB', apy: 8, color: '#10B981' };
    return { name: 'BASIC', apy: 0, color: '#9CA3AF' };
  };

  const currentTier = calculateTier(parseFloat(amount) || 0);
  const stakeAmount = amount ? parseFloat(amount) : 0;
  const platformFee = amount ? (stakeAmount * 0.0075).toFixed(2) : '0';
  const totalPayment = amount ? (stakeAmount + parseFloat(platformFee)).toFixed(2) : '0';
  const estimatedEarnings = amount ? (stakeAmount * (currentTier.apy / 100) * (selectedPeriod / 365)).toFixed(2) : '0';
  const monthlyIncome = amount ? (stakeAmount * (currentTier.apy / 100) / 12).toFixed(2) : '0';
  const totalReturn = amount ? (stakeAmount + parseFloat(estimatedEarnings)).toFixed(2) : '0';

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);
  const totalRequired = amount ? (parseFloat(amount) + parseFloat(platformFee)) : 0;
  const isValidAmount = amount && parseFloat(amount) >= 100 && selectedTokenData && totalRequired <= selectedTokenData.balance;
  const isOverBalance = amount && selectedTokenData && totalRequired > selectedTokenData.balance;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with VonVault Logo */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <span className="text-xl">←</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {/* VonVault Logo */}
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
            <h1 className="text-xl font-bold text-white">Create Stake</h1>
          </div>
          
          <button className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValidAmount}>
            <span className="mr-1">+</span>
            Stake
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 py-6">
        {/* Low Fee Advantage Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-green-400 text-xl mr-3">✓</span>
              <div>
                <p className="text-green-400 font-semibold text-lg">Only 0.75% Fee</p>
                <p className="text-sm text-gray-300">Save 92% vs competitors</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">
                {amount && parseFloat(amount) > 0 ? `${platformFee}` : '$0'}
              </p>
              <p className="text-xs text-gray-400">Platform Fee</p>
            </div>
          </div>
        </div>

        {showSimpleMode ? (
          /* Simple Mode Layout */
          <div className="space-y-6">
            {/* Amount Input - Simple */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">How much do you want to invest?</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1,000"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-10 pr-20 text-2xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">{selectedToken}</span>
                </div>
                
                {/* Quick Amount Buttons - Simple Mode */}
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 10000, 25000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="py-3 px-2 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                    >
                      ${quickAmount.toLocaleString()}
                    </button>
                  ))}
                </div>
                
                <div className="text-center">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">
                      Minimum: $100 • Available: ${selectedTokenData?.balance.toLocaleString() || '0'}
                    </span>
                    {isOverBalance && (
                      <span className="text-red-400 font-semibold">
                        ⚠️ Insufficient Balance
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-400">
                    🔒 Locked for 12 months • Monthly interest payments
                  </p>
                  {isOverBalance && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                      <p className="text-red-400 font-semibold text-sm mb-1">
                        💳 Wallet Top-Up Required
                      </p>
                      <p className="text-xs text-gray-300">
                        Total needed: ${totalRequired.toLocaleString()} • You have: ${selectedTokenData?.balance.toLocaleString() || '0'}
                        <br />Missing: ${selectedTokenData ? (totalRequired - selectedTokenData.balance).toLocaleString() : '0'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Earnings Preview - Simple */}
            {amount && parseFloat(amount) >= 100 && (
              <div className="bg-gradient-to-br from-purple-600/20 via-purple-800/10 to-gray-900 rounded-xl p-6 border border-purple-500/30">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white mb-2">Your Earnings</h3>
                  <p className="text-4xl font-bold text-green-400 mb-2">+${estimatedEarnings}</p>
                  <p className="text-purple-300 mb-4">in 12 months at {currentTier.apy}% APY</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Amount Staked</p>
                      <p className="text-lg font-bold text-white">${stakeAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">Monthly Income</p>
                      <p className="text-lg font-bold text-blue-400">${monthlyIncome}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300">Total from your wallet:</span>
                      <span className="text-white font-bold">${totalPayment}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      ${stakeAmount.toLocaleString()} staked + ${platformFee} fee
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Detailed Mode Layout */
          <div className="space-y-6">
            {/* Token Selection */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Select Token</h3>
              <div className="grid grid-cols-2 gap-3">
                {tokens.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token.symbol)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedToken === token.symbol
                        ? 'border-purple-500 bg-purple-600/20'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-semibold text-white">{token.symbol}</p>
                      <p className="text-sm text-gray-400">{token.name}</p>
                      <p className="text-sm text-green-400">Balance: ${token.balance.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input - Detailed */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Stake Amount</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl py-4 pl-10 pr-4 text-xl font-bold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 10000, 25000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="py-3 px-3 bg-gray-800 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                    >
                      ${quickAmount.toLocaleString()}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Available: ${selectedTokenData?.balance.toLocaleString() || '0'}</span>
                  <div className="flex items-center space-x-3">
                    {isOverBalance && (
                      <span className="text-red-400 font-semibold text-xs">
                        ⚠️ Insufficient Balance
                      </span>
                    )}
                    <button
                      onClick={() => selectedTokenData && setAmount(selectedTokenData.balance.toString())}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Use Max
                    </button>
                  </div>
                </div>
                
                {isOverBalance && (
                  <div className="mt-3 p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                    <p className="text-red-400 font-semibold text-sm mb-1">
                      💳 Wallet Top-Up Required
                    </p>
                    <p className="text-xs text-gray-300">
                      Total needed: ${totalRequired.toLocaleString()} (${parseFloat(amount).toLocaleString()} stake + ${platformFee} fee)
                      <br />You need ${(totalRequired - selectedTokenData?.balance).toLocaleString()} more {selectedToken}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Staking Period - Fixed 12 Months */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Staking Period</h3>
              <div className="bg-purple-600/20 border-2 border-purple-500 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">12 Months (365 Days)</p>
                    <p className="text-sm text-purple-400">Fixed staking period • Guaranteed {currentTier.apy}% APY</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-400">🔒</p>
                    <p className="text-xs text-gray-400">Locked</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <span className="text-green-400">✓</span> Monthly interest payments
                    <span className="mx-3 text-green-400">✓</span> Principal + final interest at maturity
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tier Status */}
        {amount && parseFloat(amount) >= 100 && (
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Your Tier Status</h3>
              <div 
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ backgroundColor: currentTier.color + '20', color: currentTier.color }}
              >
                {currentTier.name}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-400 mb-1">Amount Staked</p>
                <p className="text-xl font-bold text-white">${stakeAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
                <p className="text-xl font-bold text-blue-400">${monthlyIncome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Return</p>
                <p className="text-xl font-bold text-green-400">${totalReturn}</p>
              </div>
            </div>
          </div>
        )}

        {/* Earnings Calculator Toggle */}
        {!showSimpleMode && (
          <div className="bg-gray-900 rounded-xl border border-gray-800">
            <button 
              onClick={() => setShowCalculator(!showCalculator)}
              className="w-full p-6 text-left hover:bg-gray-800/50 transition-colors rounded-xl group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      Earnings Calculator
                    </h3>
                    <p className="text-sm text-gray-400">
                      {showCalculator ? 'Hide detailed breakdown' : 'Click to see detailed payment breakdown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-purple-400 mr-2 group-hover:text-purple-300">
                    {showCalculator ? 'Hide' : 'Show'}
                  </span>
                  <span className={`text-gray-400 transition-transform text-xl ${showCalculator ? 'rotate-180' : ''}`}>
                    ⌄
                  </span>
                </div>
              </div>
            </button>
            
            {showCalculator && amount && parseFloat(amount) >= 100 && (
              <div className="px-6 pb-6 space-y-4">
                <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-3 mb-4">
                  <p className="text-amber-400 font-semibold text-sm mb-1">💡 How Your Payment Works</p>
                  <p className="text-xs text-gray-300">
                    ${parseFloat(amount).toLocaleString()} gets staked in treasury wallet, ${platformFee} fee goes to operations wallet.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Amount Staked</p>
                    <p className="text-xl font-bold text-white">${parseFloat(amount).toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Platform Fee (0.75%)</p>
                    <p className="text-xl font-bold text-orange-400">+${platformFee}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Total Interest</p>
                    <p className="text-xl font-bold text-green-400">+${estimatedEarnings}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Your Total Payment</p>
                    <p className="text-xl font-bold text-purple-400">${totalPayment}</p>
                  </div>
                </div>
                
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3">
                  <p className="text-green-400 font-semibold text-sm mb-1">💰 Your Final Return</p>
                  <p className="text-lg font-bold text-green-400">${totalReturn} (Principal + Interest)</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Risk Warning */}
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-xl p-4">
          <div className="flex items-start">
            <span className="text-amber-400 text-lg mr-3 mt-1">⚠️</span>
            <div>
              <p className="text-amber-400 font-semibold mb-1">Important Notice</p>
              <p className="text-sm text-gray-300">
                Staking involves locking your funds for the selected period. Early withdrawal may result in penalties. 
                APY rates are estimates and may vary based on market conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {/* Handle preview */}}
            className="bg-gray-800 text-gray-300 py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700 flex items-center justify-center"
            disabled={!isValidAmount}
          >
            <span className="mr-2">👁️</span>
            Preview
          </button>
          <button 
            onClick={() => {/* Handle stake creation */}}
            className="bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValidAmount}
          >
            <span className="mr-2">🚀</span>
            Create Stake
          </button>
        </div>

        {/* Simple/Detailed Mode Toggle */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${!showSimpleMode ? 'text-white font-bold' : 'text-gray-400'}`}>
              Detailed Mode
            </span>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showSimpleMode}
                onChange={(e) => setShowSimpleMode(e.target.checked)}
                className="sr-only"
              />
              <div className="relative w-12 h-6 rounded-full transition-colors bg-purple-600">
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showSimpleMode ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </div>
            </label>
            
            <span className={`text-sm ${showSimpleMode ? 'text-white font-bold' : 'text-gray-400'}`}>
              Simple Mode
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStakingScreen;
