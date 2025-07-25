import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StakingAnalyticsScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const StakingAnalyticsScreen: React.FC<StakingAnalyticsScreenProps> = ({ onBack, onNavigate }) => {
  const [showSimpleMode, setShowSimpleMode] = useState(true);
  const [timeframe, setTimeframe] = useState('12M');
  
  // Mock analytics data with timeframe-specific data
  const analyticsData = {
    timeframes: {
      '1M': {
        totalStaked: 105500,
        totalEarned: 1245,
        averageAPY: 14.2,
        portfolioGrowth: 1.2,
        monthlyIncome: 1245,
        projectedAnnual: 14940,
        activeStakes: 3,
        completedStakes: 0,
        totalFeesPaid: 65.94,
        feesSaved: 878.06
      },
      '3M': {
        totalStaked: 105500,
        totalEarned: 3735,
        averageAPY: 14.2,
        portfolioGrowth: 3.6,
        monthlyIncome: 1245,
        projectedAnnual: 14940,
        activeStakes: 3,
        completedStakes: 1,
        totalFeesPaid: 197.81,
        feesSaved: 2634.19
      },
      '6M': {
        totalStaked: 105500,
        totalEarned: 7470,
        averageAPY: 14.2,
        portfolioGrowth: 7.1,
        monthlyIncome: 1245,
        projectedAnnual: 14940,
        activeStakes: 3,
        completedStakes: 2,
        totalFeesPaid: 395.63,
        feesSaved: 5268.37
      },
      '12M': {
        totalStaked: 105500,
        totalEarned: 12450,
        averageAPY: 14.2,
        portfolioGrowth: 13.4,
        monthlyIncome: 1245,
        projectedAnnual: 14940,
        activeStakes: 3,
        completedStakes: 5,
        totalFeesPaid: 791.25,
        feesSaved: 10529.25
      },
      'All': {
        totalStaked: 105500,
        totalEarned: 15680,
        averageAPY: 14.2,
        portfolioGrowth: 16.8,
        monthlyIncome: 1245,
        projectedAnnual: 14940,
        activeStakes: 3,
        completedStakes: 8,
        totalFeesPaid: 1189.88,
        feesSaved: 15864.12
      }
    },
    portfolioPerformance: {
      '1M': [
        { period: 'W1', vonvault: 100, ftse: 100, sp500: 100, nikkei: 100 },
        { period: 'W2', vonvault: 100.3, ftse: 99.8, sp500: 101.2, nikkei: 100.8 },
        { period: 'W3', vonvault: 100.6, ftse: 100.5, sp500: 99.9, nikkei: 101.1 },
        { period: 'W4', vonvault: 101.2, ftse: 98.9, sp500: 102.1, nikkei: 102.3 }
      ],
      '3M': [
        { period: 'M1', vonvault: 100, ftse: 100, sp500: 100, nikkei: 100 },
        { period: 'M2', vonvault: 101.2, ftse: 98.5, sp500: 103.2, nikkei: 102.1 },
        { period: 'M3', vonvault: 103.6, ftse: 101.2, sp500: 105.8, nikkei: 104.7 }
      ],
      '6M': [
        { period: 'M1', vonvault: 100, ftse: 100, sp500: 100, nikkei: 100 },
        { period: 'M2', vonvault: 101.2, ftse: 98.5, sp500: 103.2, nikkei: 102.1 },
        { period: 'M3', vonvault: 103.6, ftse: 101.2, sp500: 105.8, nikkei: 104.7 },
        { period: 'M4', vonvault: 104.8, ftse: 99.7, sp500: 107.1, nikkei: 106.2 },
        { period: 'M5', vonvault: 106.2, ftse: 102.8, sp500: 104.9, nikkei: 108.1 },
        { period: 'M6', vonvault: 107.1, ftse: 103.5, sp500: 108.2, nikkei: 109.4 }
      ],
      '12M': [
        { period: 'Q1', vonvault: 100, ftse: 100, sp500: 100, nikkei: 100 },
        { period: 'Q2', vonvault: 103.6, ftse: 101.2, sp500: 105.8, nikkei: 104.7 },
        { period: 'Q3', vonvault: 107.1, ftse: 103.5, sp500: 108.2, nikkei: 109.4 },
        { period: 'Q4', vonvault: 113.4, ftse: 108.7, sp500: 112.9, nikkei: 119.2 }
      ],
      'All': [
        { period: '2023', vonvault: 100, ftse: 100, sp500: 100, nikkei: 100 },
        { period: '2024', vonvault: 113.4, ftse: 108.7, sp500: 112.9, nikkei: 119.2 },
        { period: '2025', vonvault: 116.8, ftse: 110.2, sp500: 118.5, nikkei: 125.1 }
      ]
    },
    stakeBreakdown: {
      active: { count: 3, value: 75500, percentage: 71.6 },
      matured: { count: 1, value: 15000, percentage: 14.2 },
      claimed: { count: 5, value: 15000, percentage: 14.2 }
    }
  };

  // Memoized calculations
  const currentData = useMemo(() => analyticsData.timeframes[timeframe], [timeframe]);
  const performanceData = useMemo(() => analyticsData.portfolioPerformance[timeframe], [timeframe]);

  const tierDistribution = [
    { tier: 'CLUB', amount: 15000, percentage: 14.2, apy: 8, color: '#10B981' },
    { tier: 'PREMIUM', amount: 25000, percentage: 23.7, apy: 12, color: '#3B82F6' },
    { tier: 'VIP', amount: 65500, percentage: 62.1, apy: 15, color: '#8B5CF6' }
  ];

  const timeframes = ['1M', '3M', '6M', '12M', 'All'];

  // Custom tooltip for better data display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-300 text-sm mb-2">{label}</p>
          {payload.map((entry) => (
            <p key={entry.dataKey} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value?.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
            aria-label="Go back"
          >
            <span className="text-xl">←</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <svg width="32" height="32" viewBox="0 0 200 200" className="flex-shrink-0" aria-hidden="true">
              <circle cx="100" cy="100" r="100" fill="#000000"/>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#8B5CF6" strokeWidth="8"/>
              <path d="M 65 65 L 100 135 L 135 65" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="16" 
                    strokeLinecap="square" 
                    strokeLinejoin="miter"/>
            </svg>
            <h1 className="text-xl font-bold text-white">Analytics</h1>
          </div>
          
          <button 
            className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-all"
            aria-label="Export analytics data"
          >
            <span className="mr-1">📊</span>
            Export
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 py-6">
        {/* Fee Transparency Section */}
        <div className="bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-400 text-xl mr-3" aria-hidden="true">📊</span>
              <div>
                <p className="text-blue-400 font-semibold text-lg">Platform Fees</p>
                <p className="text-sm text-gray-300">
                  Competitive 0.75% fee vs industry average ~2-3%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-400">${currentData.totalFeesPaid.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{timeframe} Total Fees</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-700/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Total Investment:</span>
              <span className="text-white font-medium">${(currentData.totalStaked + currentData.totalFeesPaid).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Working Capital:</span>
              <span className="text-blue-400 font-medium">${currentData.totalStaked.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Portfolio Performance</h2>
            <div className="flex gap-2" role="tablist" aria-label="Time period selection">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  role="tab"
                  aria-selected={timeframe === tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    timeframe === tf
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 text-xl" aria-hidden="true">💼</span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Working Capital</p>
              <p className="text-2xl font-bold text-white">${currentData.totalStaked.toLocaleString()}</p>
              <p className="text-xs text-green-400">+{currentData.portfolioGrowth}% performance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-green-400 text-xl" aria-hidden="true">💰</span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-green-400">+${currentData.totalEarned.toLocaleString()}</p>
              <p className="text-xs text-gray-400">${currentData.monthlyIncome}/month</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-400 text-xl" aria-hidden="true">📈</span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Average APY</p>
              <p className="text-2xl font-bold text-blue-400">{currentData.averageAPY}%</p>
              <p className="text-xs text-gray-400">Weighted average</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-600/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-amber-400 text-xl" aria-hidden="true">🚀</span>
              </div>
              <p className="text-sm text-gray-400 mb-1">Projected Annual</p>
              <p className="text-2xl font-bold text-amber-400">${currentData.projectedAnnual.toLocaleString()}</p>
              <p className="text-xs text-gray-400">Based on current APY</p>
            </div>
          </div>
        </div>

        {showSimpleMode ? (
          <div className="space-y-6">
            {/* Portfolio Performance vs Market */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Portfolio Performance vs Market</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-300">VonVault</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-300">FTSE 100</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-300">S&P 500</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-300">Nikkei 225</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{timeframe} Performance</span>
                </div>
              </div>
              
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="vonvault" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="VonVault"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ftse" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="FTSE 100"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sp500" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="S&P 500"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="nikkei" 
                      stroke="#F97316" 
                      strokeWidth={2}
                      name="Nikkei 225"
                      dot={{ fill: '#F97316', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="nikkei" 
                      stroke="#F97316" 
                      strokeWidth={2}
                      name="Nikkei 225"
                      dot={{ fill: '#F97316', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-purple-400 font-semibold">+{(performanceData[performanceData.length - 1].vonvault - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">VonVault</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-semibold">+{(performanceData[performanceData.length - 1].ftse - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">FTSE 100</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-semibold">+{(performanceData[performanceData.length - 1].sp500 - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">S&P 500</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-400 font-semibold">+{(performanceData[performanceData.length - 1].nikkei - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">Nikkei 225</p>
                </div>
              </div>
            </div>

            {/* Stake Breakdown */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-4">Stake Status Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mr-3" aria-hidden="true"></div>
                    <span className="text-white font-medium">Active Stakes</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{analyticsData.stakeBreakdown.active.count} stakes</p>
                    <p className="text-xs text-gray-400">${analyticsData.stakeBreakdown.active.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3" aria-hidden="true"></div>
                    <span className="text-white font-medium">Matured Stakes</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{analyticsData.stakeBreakdown.matured.count} stakes</p>
                    <p className="text-xs text-gray-400">${analyticsData.stakeBreakdown.matured.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-500 rounded-full mr-3" aria-hidden="true"></div>
                    <span className="text-white font-medium">Claimed Stakes</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{analyticsData.stakeBreakdown.claimed.count} stakes</p>
                    <p className="text-xs text-gray-400">${analyticsData.stakeBreakdown.claimed.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Detailed Analytics */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-white mb-6">Portfolio Performance vs Market</h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                    />
                    <YAxis 
                      stroke="#9CA3AF" 
                      fontSize={12}
                      tick={{ fill: '#9CA3AF' }}
                      domain={['dataMin - 1', 'dataMax + 1']}
                      label={{ value: 'Performance %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="vonvault" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="VonVault"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ftse" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="FTSE 100"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sp500" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="S&P 500"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-purple-400 font-semibold">+{(performanceData[performanceData.length - 1].vonvault - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">VonVault</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-semibold">+{(performanceData[performanceData.length - 1].ftse - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">FTSE 100</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-semibold">+{(performanceData[performanceData.length - 1].sp500 - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">S&P 500</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-400 font-semibold">+{(performanceData[performanceData.length - 1].nikkei - 100).toFixed(1)}%</p>
                  <p className="text-xs text-gray-400">Nikkei 225</p>
                </div>
              </div>
            </div>

            {/* Performance and Tier Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Performance Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Stakes</span>
                    <span className="text-green-400 font-semibold">{analyticsData.stakeBreakdown.active.count} stakes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Matured Stakes</span>
                    <span className="text-blue-400 font-semibold">{analyticsData.stakeBreakdown.matured.count} stakes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Claimed Stakes</span>
                    <span className="text-purple-400 font-semibold">{analyticsData.stakeBreakdown.claimed.count} stakes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Portfolio Growth</span>
                    <span className="text-green-400 font-semibold">+{currentData.portfolioGrowth}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="text-lg font-bold text-white mb-4">Tier Distribution</h3>
                <div className="space-y-4">
                  {tierDistribution.map((tier) => (
                    <div key={tier.tier} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: tier.color }}
                            aria-hidden="true"
                          ></div>
                          <span className="text-white font-medium">{tier.tier}</span>
                        </div>
                        <span className="text-gray-400">{tier.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${tier.percentage}%`,
                            backgroundColor: tier.color 
                          }}
                          role="progressbar"
                          aria-valuenow={tier.percentage}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${tier.tier} tier: ${tier.percentage}%`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">${tier.amount.toLocaleString()}</span>
                        <span className="text-gray-400">{tier.apy}% APY</span>
                      </div>
                    </div>
                  ))}
                </div>
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
                aria-label="Toggle between simple and detailed mode"
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

export default StakingAnalyticsScreen;
