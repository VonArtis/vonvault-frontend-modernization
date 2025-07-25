import React, { useState } from 'react';
import { VonVaultTierLogo } from '../ui/VonVaultTierLogo';

interface StakingDashboardScreenProps {
  onNavigate?: (screen: string) => void;
}

const DashboardWithSwapWidget: React.FC<StakingDashboardScreenProps> = ({ onNavigate }) => {
  const [showSwapWidget, setShowSwapWidget] = useState(false);
  const [quickSwapAmount, setQuickSwapAmount] = useState('');

  const userData = {
    totalStaked: 75500,
    totalAccrued: 8240,
    currentTier: 'VIP',
    currentApy: 15,
    monthlyIncome: 945,
    activeStakes: 2
  };

  // Mock wallet balances - non-stakeable assets
  const nonStakeableAssets = [
    { symbol: 'ETH', balance: '2.5847', usdValue: '4,250.32', icon: '⟠' },
    { symbol: 'BTC', balance: '0.1234', usdValue: '5,123.45', icon: '₿' }
  ];

  const totalNonStakeable = nonStakeableAssets.reduce((sum, asset) => 
    sum + parseFloat(asset.usdValue.replace(',', '')), 0
  );

  const userTier = userData.currentTier;
  const swapFees = { 'CLUB': '0.8%', 'PREMIUM': '0.6%', 'VIP': '0.4%', 'ELITE': '0.25%' };

  const calculateSwapFee = (amount) => {
    const usdAmount = parseFloat(amount || 0);
    const vonVaultFeeRates = { 'CLUB': 0.008, 'PREMIUM': 0.006, 'VIP': 0.004, 'ELITE': 0.0025 };
    const platformFeeRate = 0.0085; // Reown fee
    const networkGasFee = 15; // Estimated gas cost
    
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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="text-gray-400 hover:text-white">←</button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            <h1 className="text-xl font-bold">Staking Dashboard</h1>
          </div>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-700 transition-all">
            + Stake
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 py-6">
        {/* Current Tier Status */}
        <div className="bg-gradient-to-br from-purple-600/20 via-purple-800/10 to-gray-900 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <VonVaultTierLogo 
                tier={userData.currentTier}
                size="medium"
                className="mr-4"
              />
              <div>
                <h3 className="text-2xl font-bold text-white">{userData.currentTier} Tier</h3>
                <p className="text-purple-300">Premium Member</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{userData.currentApy}%</p>
              <p className="text-sm text-gray-400">Guaranteed APY</p>
            </div>
          </div>
        </div>

        {/* Quick Swap Widget - Show when non-stakeable assets exist */}
        {totalNonStakeable > 0 && (
          <div className="bg-gradient-to-r from-orange-900/30 to-green-900/20 border border-orange-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-orange-400 text-xl mr-3">💱</span>
                <div>
                  <p className="text-orange-400 font-semibold text-lg">Convert to Earn</p>
                  <p className="text-sm text-gray-300">
                    ${totalNonStakeable.toLocaleString()} ready to convert
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSwapWidget(true)}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-all"
              >
                Quick Swap
              </button>
            </div>

            {/* Quick Swap Assets Preview */}
            <div className="flex items-center space-x-4 mt-3">
              {nonStakeableAssets.map((asset, index) => (
                <div key={asset.symbol} className="flex items-center space-x-2 bg-gray-800/30 rounded-lg px-3 py-1">
                  <span className="text-lg">{asset.icon}</span>
                  <span className="text-sm text-gray-300">{asset.balance} {asset.symbol}</span>
                </div>
              ))}
              <span className="text-gray-400">→</span>
              <div className="flex items-center space-x-2 bg-green-800/30 rounded-lg px-3 py-1">
                <span className="text-lg">💵</span>
                <span className="text-sm text-green-300">USDC</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center mr-3">
                <span className="text-purple-400">💰</span>
              </div>
              <span className="text-sm text-gray-400">Total Staked</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${userData.totalStaked.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center mr-3">
                <span className="text-green-400">📈</span>
              </div>
              <span className="text-sm text-gray-400">Interest Earned</span>
            </div>
            <p className="text-2xl font-bold text-green-400">
              +${userData.totalAccrued.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mr-3">
                <span className="text-blue-400">📅</span>
              </div>
              <span className="text-sm text-gray-400">Monthly Income</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              ${userData.monthlyIncome.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-600/20 rounded-xl flex items-center justify-center mr-3">
                <span className="text-gray-400">🔒</span>
              </div>
              <span className="text-sm text-gray-400">Active Stakes</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {userData.activeStakes}
            </p>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center">
            <span className="mr-2">+</span>
            Stake More
          </button>
          <button 
            onClick={() => window.location.href = '/convert'}
            className="bg-gray-800 text-gray-300 py-4 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700 flex items-center justify-center"
          >
            <span className="mr-2">💱</span>
            Convert Assets
          </button>
        </div>

        {/* Fee Benefits */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
          <h4 className="text-green-400 font-medium mb-3 flex items-center">
            <span className="mr-2">✨</span>
            Your {userTier} Conversion Benefits
          </h4>
          <div className="text-sm text-green-200 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Only {swapFees[userTier]} conversion fee (save 60-75% vs exchanges)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Best rates across 300+ liquidity sources</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Convert and stake in single transaction</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Swap Modal */}
      {showSwapWidget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Quick Convert</h2>
              <button
                onClick={() => setShowSwapWidget(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Convert All Option */}
              <div className="bg-gradient-to-r from-orange-600/20 to-green-600/20 border border-orange-500/30 rounded-xl p-4">
                <div className="mb-4">
                  <p className="text-white font-semibold mb-2">Convert All to USDC</p>
                  
                  {/* Complete Fee Transparency */}
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-white font-medium">
                      <span>You Pay:</span>
                      <span>${totalNonStakeable.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-2 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">VonVault Fee ({swapFees[userTier]}):</span>
                        <span className="text-orange-400">-${calculateSwapFee(totalNonStakeable.toString()).vonVaultFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Platform Fee (0.85%):</span>
                        <span className="text-orange-400">-${calculateSwapFee(totalNonStakeable.toString()).platformFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network Gas:</span>
                        <span className="text-orange-400">~${calculateSwapFee(totalNonStakeable.toString()).networkGasFee}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-600 pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-white">You Receive:</span>
                        <span className="text-green-400">~${calculateSwapFee(totalNonStakeable.toString()).receivedAmount} USDC</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-red-400 font-medium">Total Fees:</span>
                        <span className="text-red-400 font-medium">${calculateSwapFee(totalNonStakeable.toString()).totalFees}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-orange-600 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-green-700 transition-all">
                  Convert All & Start Staking
                </button>
              </div>

              {/* Individual Asset Conversion */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Or convert individually:</h3>
                {nonStakeableAssets.map((asset) => (
                  <div key={asset.symbol} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{asset.icon}</span>
                        <div>
                          <p className="font-semibold text-white">{asset.balance} {asset.symbol}</p>
                          <p className="text-sm text-gray-400">${asset.usdValue}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <input
                          type="number"
                          placeholder="Amount"
                          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm w-24 text-right"
                        />
                      </div>
                    </div>
                    <button className="w-full bg-purple-600/20 text-purple-300 py-2 rounded-lg text-sm hover:bg-purple-600/30 transition-all">
                      Convert to USDC ({swapFees[userTier]} fee)
                    </button>
                  </div>
                ))}
              </div>

              {/* Benefits Reminder */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
                <p className="text-blue-400 text-sm font-medium mb-1">💡 Why Convert?</p>
                <p className="text-blue-200 text-xs">
                  Only USDC/USDT can be staked for {userData.currentApy}% APY. Converting unlocks your earning potential.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardWithSwapWidget;
