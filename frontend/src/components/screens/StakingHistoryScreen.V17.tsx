import React, { useState } from 'react';

const StakingHistoryScreen = () => {
  const [showSimpleMode, setShowSimpleMode] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedStake, setSelectedStake] = useState(null);
  
  // Mock staking history data with contract addresses and tx hashes
  const stakingHistory = [
    {
      id: 'STK-001',
      contractAddress: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      txHash: '0x9876543210abcdef1234567890abcdef1234567890abcdef1234567890abcdef98',
      amount: 50000,
      token: 'USDC',
      apy: 15,
      tier: 'VIP',
      startDate: '19/07/2024',
      maturityDate: '19/07/2025',
      daysCompleted: 178,
      daysRemaining: 187,
      totalDays: 365,
      accruedInterest: 5625,
      monthlyIncome: 625,
      status: 'Active',
      platformFee: 375,
      totalReturn: 55625
    },
    {
      id: 'STK-002',
      contractAddress: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      txHash: '0x8765432109abcdef1234567890abcdef1234567890abcdef1234567890abcdef87',
      amount: 25500,
      token: 'USDT',
      apy: 15,
      tier: 'VIP',
      startDate: '15/06/2024',
      maturityDate: '15/06/2025',
      daysCompleted: 162,
      daysRemaining: 203,
      totalDays: 365,
      accruedInterest: 2615,
      monthlyIncome: 320,
      status: 'Active',
      platformFee: 191.25,
      totalReturn: 28115
    },
    {
      id: 'STK-003',
      contractAddress: '0x3c4d5e6f7890abcdef1234567890abcdef123456',
      txHash: '0x7654321098abcdef1234567890abcdef1234567890abcdef1234567890abcdef76',
      amount: 15000,
      token: 'USDC',
      apy: 12,
      tier: 'PREMIUM',
      startDate: '20/01/2024',
      maturityDate: '20/01/2025',
      daysCompleted: 365,
      daysRemaining: 0,
      totalDays: 365,
      accruedInterest: 1800,
      monthlyIncome: 150,
      status: 'Matured',
      platformFee: 112.50,
      totalReturn: 16800
    }
  ];

  const statusOptions = ['All', 'Active', 'Matured', 'Claimed'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'amount-high', label: 'Highest Amount' },
    { value: 'amount-low', label: 'Lowest Amount' }
  ];

  // Filter and sort logic
  const filteredHistory = stakingHistory
    .filter(stake => filterStatus === 'All' || stake.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.startDate.split('/').reverse().join('-')) - new Date(a.startDate.split('/').reverse().join('-'));
        case 'oldest':
          return new Date(a.startDate.split('/').reverse().join('-')) - new Date(b.startDate.split('/').reverse().join('-'));
        case 'amount-high':
          return b.amount - a.amount;
        case 'amount-low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

  // Summary calculations
  const totalStaked = stakingHistory.reduce((sum, stake) => sum + stake.amount, 0);
  const totalEarned = stakingHistory.reduce((sum, stake) => sum + stake.accruedInterest, 0);
  const activeStakes = stakingHistory.filter(stake => stake.status === 'Active').length;
  const totalFeesPaid = stakingHistory.reduce((sum, stake) => sum + stake.platformFee, 0);

  const handleClaimClick = (stake) => {
    setSelectedStake(stake);
    setShowClaimModal(true);
  };

  const handleClaimAction = (action) => {
    console.log(`${action} for stake ${selectedStake.id}`);
    setShowClaimModal(false);
    setSelectedStake(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-900 text-green-300';
      case 'Matured': return 'bg-blue-900 text-blue-300';
      case 'Claimed': return 'bg-gray-700 text-gray-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return '🔄';
      case 'Matured': return '✅';
      case 'Claimed': return '💰';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <span className="text-xl">←</span>
          </button>
          
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
            <h1 className="text-xl font-bold text-white">Staking History</h1>
          </div>
          
          <button className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-all">
            <span className="mr-1">+</span>
            New Stake
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 py-6">
        {/* Fee Banner */}
        <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-green-400 text-xl mr-3">💰</span>
              <div>
                <p className="text-green-400 font-semibold text-lg">Total Fees Paid</p>
                <p className="text-sm text-gray-300">92% savings vs industry average</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">${totalFeesPaid.toFixed(0)}</p>
              <p className="text-xs text-gray-400">All Time</p>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Portfolio Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Total Staked</p>
              <p className="text-xl font-bold text-white">${totalStaked.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Total Earned</p>
              <p className="text-xl font-bold text-green-400">+${totalEarned.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Active Stakes</p>
              <p className="text-xl font-bold text-blue-400">{activeStakes}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Success Rate</p>
              <p className="text-xl font-bold text-purple-400">100%</p>
            </div>
          </div>
        </div>

        {/* Stakes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Your Stakes ({filteredHistory.length})</h3>
          
          {showSimpleMode ? (
            <div className="space-y-4">
              {filteredHistory.map((stake) => (
                <div key={stake.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mr-4">
                        <span className="text-xl">{getStatusIcon(stake.status)}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">
                          ${stake.amount.toLocaleString()} {stake.token}
                        </h4>
                        <p className="text-sm text-gray-400">
                          Contract: {stake.contractAddress.slice(0, 6)}...{stake.contractAddress.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stake.status)}`}>
                      {stake.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Interest Earned</p>
                      <p className="text-lg font-bold text-green-400">+${stake.accruedInterest.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {stake.status === 'Active' ? 'Days Remaining' : 'Total Return'}
                      </p>
                      <p className={`text-lg font-bold ${stake.status === 'Active' ? 'text-blue-400' : 'text-purple-400'}`}>
                        {stake.status === 'Active' ? `${stake.daysRemaining} days` : `$${stake.totalReturn.toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  {stake.status === 'Matured' && (
                    <button 
                      onClick={() => handleClaimClick(stake)}
                      className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                      Claim ${stake.totalReturn.toLocaleString()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="text-left p-4 text-sm font-semibold text-gray-300">Contract</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-300">Amount</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-300">Earnings</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
                    <th className="text-left p-4 text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((stake, index) => (
                    <tr key={stake.id} className={`border-t border-gray-800 hover:bg-gray-800/50 transition-colors`}>
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getStatusIcon(stake.status)}</span>
                          <div>
                            <p className="font-semibold text-white">{stake.contractAddress.slice(0, 10)}...{stake.contractAddress.slice(-8)}</p>
                            <p className="text-sm text-gray-400">{stake.tier} Tier</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-white">${stake.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">{stake.token} • {stake.apy}% APY</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-green-400">+${stake.accruedInterest.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">${stake.monthlyIncome}/month</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(stake.status)}`}>
                          {stake.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {stake.status === 'Matured' ? (
                          <button 
                            onClick={() => handleClaimClick(stake)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                          >
                            Claim
                          </button>
                        ) : stake.status === 'Active' ? (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                            View
                          </button>
                        ) : (
                          <span className="text-gray-500 text-sm">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Claim Modal */}
        {showClaimModal && selectedStake && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Claim Your Stake</h3>
                <button 
                  onClick={() => setShowClaimModal(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Smart Contract:</span>
                  <div className="text-right">
                    <span className="text-white font-mono text-sm">{selectedStake.contractAddress.slice(0, 10)}...{selectedStake.contractAddress.slice(-8)}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(selectedStake.contractAddress)}
                      className="ml-2 text-purple-400 hover:text-purple-300 text-xs"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Transaction Hash:</span>
                  <div className="text-right">
                    <span className="text-white font-mono text-sm">{selectedStake.txHash.slice(0, 10)}...{selectedStake.txHash.slice(-8)}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(selectedStake.txHash)}
                      className="ml-2 text-purple-400 hover:text-purple-300 text-xs"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Principal:</span>
                  <span className="text-white">${selectedStake.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Interest Earned:</span>
                  <span className="text-green-400">+${selectedStake.accruedInterest.toLocaleString()}</span>
                </div>
                <hr className="border-gray-700 my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">Total Available:</span>
                  <span className="text-white font-bold text-lg">${selectedStake.totalReturn.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleClaimAction('claim-to-wallet')}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🏦</span>
                    <div className="text-left">
                      <p className="font-semibold">Claim All to Wallet</p>
                      <p className="text-sm text-green-100">Full amount sent to your wallet</p>
                    </div>
                  </div>
                  <span className="font-bold">${selectedStake.totalReturn.toLocaleString()}</span>
                </button>

                <button 
                  onClick={() => handleClaimAction('claim-and-reinvest')}
                  className="w-full bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔄</span>
                    <div className="text-left">
                      <p className="font-semibold">Claim & Reinvest</p>
                      <p className="text-sm text-purple-100">Start new 12-month stake immediately</p>
                    </div>
                  </div>
                  <span className="font-bold">${selectedStake.totalReturn.toLocaleString()}</span>
                </button>

                <button 
                  onClick={() => handleClaimAction('claim-interest-only')}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💰</span>
                      <div className="text-left">
                        <p className="font-semibold">Claim Interest Only</p>
                        <p className="text-sm text-blue-100">Interest to wallet, principal restaked</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Interest: <strong>${selectedStake.accruedInterest.toLocaleString()}</strong></span>
                    <span>Restake: <strong>${selectedStake.amount.toLocaleString()}</strong></span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toggle */}
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

export default StakingHistoryScreen;
