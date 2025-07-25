import React, { useState } from 'react';

const StakingCompletionScreen = () => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Mock data for the completed stake
  const stakeData = {
    amount: 25000,
    token: 'USDC',
    apy: 15,
    tier: 'VIP',
    stakingPeriod: 365,
    startDate: '19/07/2025',
    maturityDate: '19/07/2026',
    expectedEarnings: 3750,
    monthlyIncome: 312,
    transactionHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
    networkFee: 12.50,
    platformFee: 187.50
  };

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
            <h1 className="text-xl font-bold text-white">Staking Complete</h1>
          </div>
          
          <button className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-all">
            <span className="mr-1">✓</span>
            Done
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 py-6">
        {/* Success Animation/Icon */}
        <div className="text-center py-8">
          <div className="w-24 h-24 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Staking Successful!</h2>
          <p className="text-gray-400 text-lg">Your funds are now earning rewards</p>
        </div>

        {/* Low Fee Celebration Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-green-400 text-xl mr-3">🎉</span>
              <div>
                <p className="text-green-400 font-semibold text-lg">Only 0.75% Fee Charged</p>
                <p className="text-sm text-gray-300">You saved ${((stakeData.amount * 0.10) - (stakeData.amount * 0.0075)).toFixed(0)} vs competitors</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${stakeData.platformFee}</p>
              <p className="text-xs text-gray-400">Total Fee</p>
            </div>
          </div>
        </div>

        {/* Stake Summary Card */}
        <div className="bg-gradient-to-br from-purple-600/20 via-purple-800/10 to-gray-900 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-purple-500/20 rounded-full p-3 mr-4">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">${stakeData.amount.toLocaleString()} {stakeData.token}</h3>
                <p className="text-purple-300">{stakeData.tier} Tier • {stakeData.stakingPeriod} Days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{stakeData.apy}%</p>
              <p className="text-sm text-gray-400">APY</p>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Expected Earnings</p>
              <p className="text-xl font-bold text-green-400">+${stakeData.expectedEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Monthly Income</p>
              <p className="text-xl font-bold text-blue-400">${stakeData.monthlyIncome}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Staking Timeline</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-white font-medium">Stake Started</span>
              </div>
              <span className="text-gray-400">{stakeData.startDate}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-white font-medium">First Interest Payment</span>
              </div>
              <span className="text-gray-400">19/08/2025</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                <span className="text-white font-medium">Maturity Date</span>
              </div>
              <span className="text-gray-400">{stakeData.maturityDate}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center">
            <span className="mr-2">+</span>
            Stake More
          </button>
          <button className="bg-gray-800 text-gray-300 py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700 flex items-center justify-center">
            <span className="mr-2">📊</span>
            View Dashboard
          </button>
        </div>

        {/* Transaction Details - Expandable */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full p-6 text-left hover:bg-gray-800/50 transition-colors rounded-xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Transaction Details</h3>
              <span className={`text-gray-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </div>
          </button>
          
          {showDetails && (
            <div className="px-6 pb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction Hash</span>
                <span className="text-purple-400 text-sm font-mono">{stakeData.transactionHash.slice(0, 10)}...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network Fee</span>
                <span className="text-blue-400">${stakeData.networkFee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Platform Fee (0.75%)</span>
                <span className="text-green-400">${stakeData.platformFee}</span>
              </div>
              <hr className="border-gray-800" />
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">Total Fees</span>
                <span className="text-white font-bold">${(stakeData.networkFee + stakeData.platformFee).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Security Confirmation */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Security Confirmation</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="text-green-400 mr-3">✅</span>
              <span className="text-gray-300">Funds secured in smart contract</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-3">✅</span>
              <span className="text-gray-300">Multi-signature protection enabled</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-400 mr-3">✅</span>
              <span className="text-gray-300">Insurance coverage active</span>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">What Happens Next?</h3>
          <div className="space-y-3 text-gray-300">
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">1.</span>
              <span>Your funds start earning {stakeData.apy}% APY immediately</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">2.</span>
              <span>Interest payments begin next month (${stakeData.monthlyIncome}/month)</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">3.</span>
              <span>Track your earnings in real-time on your dashboard</span>
            </div>
            <div className="flex items-start">
              <span className="text-purple-400 mr-3 mt-1">4.</span>
              <span>Full principal + interest available on {stakeData.maturityDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center py-6">
          <p className="text-gray-400 mb-2">🎉 Congratulations on your smart investment!</p>
          <p className="text-sm text-gray-500">VonVault - Making DeFi Simple & Profitable</p>
        </div>
      </div>
    </div>
  );
};

export default StakingCompletionScreen;
