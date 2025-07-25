import React, { useState } from 'react';

const StakingTiersScreen = () => {
  const [showSimpleMode, setShowSimpleMode] = useState(true);
  
  // VIP Tier Configuration
  const VIP_TIERS = [
    {
      name: 'BASIC',
      min_amount: 0,
      max_amount: 999,
      apy: 0,
      color: '#9CA3AF',
      gradient: 'from-gray-600/20 via-gray-800/10 to-gray-900',
      benefits: ['Wallet Connection', 'Platform Access', 'Basic Support'],
      features: ['Account Dashboard', 'Transaction History', 'Email Notifications'],
      staking_enabled: false,
      popular: false
    },
    {
      name: 'CLUB', 
      min_amount: 1000,
      max_amount: 9999,
      apy: 8,
      color: '#10B981',
      gradient: 'from-green-600/20 via-green-800/10 to-gray-900',
      benefits: ['8% APY', 'Monthly Interest', 'Community Access', 'Email Support'],
      features: ['Priority Customer Support', 'Monthly Reports', 'Mobile App Access'],
      staking_enabled: true,
      popular: false
    },
    {
      name: 'PREMIUM',
      min_amount: 10000,
      max_amount: 49999,
      apy: 12,
      color: '#3B82F6',
      gradient: 'from-blue-600/20 via-blue-800/10 to-gray-900',
      benefits: ['12% APY', 'Monthly Interest', 'Priority Support', 'Advanced Analytics'],
      features: ['Dedicated Support Line', 'Weekly Market Reports', 'Portfolio Analytics'],
      staking_enabled: true,
      popular: true
    },
    {
      name: 'VIP',
      min_amount: 50000,
      max_amount: 199999,
      apy: 15,
      color: '#8B5CF6',
      gradient: 'from-purple-600/20 via-purple-800/10 to-gray-900',
      benefits: ['15% APY', 'Monthly Interest', 'VIP Support', 'Exclusive Events'],
      features: ['Personal Account Manager', 'Exclusive Investment Opportunities', 'VIP Events Access'],
      staking_enabled: true,
      popular: false
    },
    {
      name: 'ELITE',
      min_amount: 200000,
      max_amount: null,
      apy: 20,
      color: '#F59E0B',
      gradient: 'from-amber-600/20 via-amber-800/10 to-gray-900',
      benefits: ['20% APY', 'Monthly Interest', 'Personal Manager', 'Early Access', 'Premium Events'],
      features: ['Exclusive Concierge', 'Private Portfolio Management', 'Private Banking Access'],
      staking_enabled: true,
      popular: false
    }
  ];

  const currentUserTier = 'VIP'; // Mock user's current tier
  const currentStaked = 75500; // Mock user's current staked amount

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
            <h1 className="text-xl font-bold text-white">Staking Tiers</h1>
          </div>
          
          <button className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-all">
            <span className="mr-1">+</span>
            Stake Now
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
                <p className="text-green-400 font-semibold text-lg">Industry's Lowest Fees</p>
                <p className="text-sm text-gray-300">92% fee savings compared to other platforms</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">0.75%</p>
              <p className="text-xs text-gray-400">Platform Fee</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Your Current Status</h3>
            <div 
              className="px-3 py-1 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: VIP_TIERS.find(t => t.name === currentUserTier)?.color + '20', 
                color: VIP_TIERS.find(t => t.name === currentUserTier)?.color 
              }}
            >
              {currentUserTier} Tier
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-400 mb-1">Current Staked</p>
              <p className="text-xl font-bold text-white">${currentStaked.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Current APY</p>
              <p className="text-xl font-bold text-purple-400">
                {VIP_TIERS.find(t => t.name === currentUserTier)?.apy}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">To Next Tier</p>
              <p className="text-xl font-bold text-blue-400">${(200000 - currentStaked).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">All Tiers & Benefits</h3>
            <span className="text-sm text-gray-400">Choose your investment level</span>
          </div>

          {showSimpleMode ? (
            /* Simple Mode - Focused Layout */
            <div className="space-y-4">
              {VIP_TIERS.filter(tier => tier.staking_enabled).map((tier) => (
                <div 
                  key={tier.name}
                  className={`relative rounded-xl p-6 border transition-all hover:scale-[1.02] ${
                    tier.name === currentUserTier 
                      ? 'border-purple-500/50 ring-2 ring-purple-500/30' 
                      : 'border-gray-800'
                  } ${tier.popular ? 'ring-2 ring-blue-500/30 border-blue-500/50' : ''}`}
                  style={{ 
                    background: `linear-gradient(135deg, ${tier.gradient})` 
                  }}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}
                  
                  {tier.name === currentUserTier && (
                    <div className="absolute -top-3 right-6">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Your Current Tier
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">{tier.name}</h4>
                      <p className="text-sm text-gray-300">
                        ${tier.min_amount.toLocaleString()} - ${tier.max_amount?.toLocaleString() || '∞'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-white">{tier.apy}%</p>
                      <p className="text-sm text-gray-400">APY</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tier.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        {benefit}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <button 
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        tier.name === currentUserTier
                          ? 'bg-gray-600 text-gray-300 cursor-default'
                          : tier.min_amount > currentStaked
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-800 text-gray-400 border border-gray-600'
                      }`}
                      disabled={tier.name === currentUserTier || tier.min_amount <= currentStaked}
                    >
                      {tier.name === currentUserTier ? 'Current Tier' : 
                       tier.min_amount > currentStaked ? 'Upgrade Now' : 
                       'Already Qualified'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Detailed Mode - Complete Information */
            <div className="space-y-6">
              {VIP_TIERS.map((tier) => (
                <div 
                  key={tier.name}
                  className={`relative rounded-xl p-6 border transition-all hover:scale-[1.01] ${
                    tier.name === currentUserTier 
                      ? 'border-purple-500/50 ring-2 ring-purple-500/30' 
                      : 'border-gray-800'
                  } ${tier.popular ? 'ring-2 ring-blue-500/30 border-blue-500/50' : ''} ${
                    !tier.staking_enabled ? 'opacity-75' : ''
                  }`}
                  style={{ 
                    background: `linear-gradient(135deg, ${tier.gradient})` 
                  }}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        ⭐ Most Popular
                      </span>
                    </div>
                  )}
                  
                  {tier.name === currentUserTier && (
                    <div className="absolute -top-3 right-6">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Your Current Tier
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-1">{tier.name}</h4>
                      <p className="text-sm text-gray-300">
                        ${tier.min_amount.toLocaleString()} {tier.max_amount ? `- $${tier.max_amount.toLocaleString()}` : '+'} minimum
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-5xl font-bold text-white">{tier.apy}%</p>
                      <p className="text-sm text-gray-400">Annual APY</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3">Core Benefits</h5>
                      <div className="space-y-2">
                        {tier.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <span className="text-green-400 mr-3">✓</span>
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-semibold text-white mb-3">Platform Features</h5>
                      <div className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-300">
                            <span className="text-blue-400 mr-3">•</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {tier.staking_enabled && (
                    <div className="mt-6 p-4 bg-black/20 rounded-lg">
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Monthly on $10K</p>
                          <p className="text-green-400 font-bold">
                            ${((10000 * tier.apy / 100) / 12).toFixed(0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Annual on $50K</p>
                          <p className="text-green-400 font-bold">
                            ${((50000 * tier.apy / 100)).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Platform Fee</p>
                          <p className="text-green-400 font-bold">0.75%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <button 
                      className={`w-full py-4 rounded-xl font-semibold transition-all ${
                        !tier.staking_enabled
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : tier.name === currentUserTier
                          ? 'bg-gray-600 text-gray-300 cursor-default'
                          : tier.min_amount > currentStaked
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-gray-800 text-gray-400 border border-gray-600'
                      }`}
                      disabled={!tier.staking_enabled || tier.name === currentUserTier || tier.min_amount <= currentStaked}
                    >
                      {!tier.staking_enabled ? 'Registration Only' :
                       tier.name === currentUserTier ? 'Your Current Tier' : 
                       tier.min_amount > currentStaked ? `Upgrade to ${tier.name}` : 
                       'Already Qualified'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upgrade Benefits */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4">Why Upgrade Your Tier?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 text-xl">📈</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Higher Returns</h4>
              <p className="text-sm text-gray-400">Earn up to 20% APY with higher tier investments</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 text-xl">🏆</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Premium Support</h4>
              <p className="text-sm text-gray-400">Personal managers and priority customer service</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 text-xl">🎯</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Exclusive Access</h4>
              <p className="text-sm text-gray-400">VIP events, early access, and special opportunities</p>
            </div>
          </div>
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

export default StakingTiersScreen;
