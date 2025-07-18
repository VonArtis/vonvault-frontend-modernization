import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  ChartBarIcon,
  TrendingUpIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import type { ScreenProps } from '../../types';

interface AnalyticsData {
  portfolio_metrics: {
    total_portfolio_value: number;
    total_principal: number;
    total_earnings: number;
    average_apy: number;
    monthly_income: number;
    time_to_avg_maturity: number;
    monthly_growth_rate: number;
    annualized_return: number;
  };
  performance_chart: Array<{
    month: string;
    principal: number;
    earnings: number;
    total_value: number;
    monthly_income: number;
  }>;
  tier_distribution: Array<{
    tier: string;
    amount: number;
    count: number;
    apy: number;
    color: string;
  }>;
  monthly_projections: Array<{
    month: string;
    projected_income: number;
    cumulative_earnings: number;
  }>;
  comparison_data: {
    vs_traditional_savings: number;
    vs_stock_market: number;
    vs_crypto_yield: number;
  };
}

interface StakingAnalyticsScreenProps extends ScreenProps {}

export const StakingAnalyticsScreen: React.FC<StakingAnalyticsScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { t } = useTranslation(['common', 'staking']);
  const { user } = useApp();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'3m' | '6m' | '1y' | 'all'>('1y');

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    portfolio_metrics: {
      total_portfolio_value: 158400,
      total_principal: 150000,
      total_earnings: 8400,
      average_apy: 15.2,
      monthly_income: 1875,
      time_to_avg_maturity: 187,
      monthly_growth_rate: 1.27,
      annualized_return: 15.6
    },
    performance_chart: [
      { month: 'Jan', principal: 50000, earnings: 0, total_value: 50000, monthly_income: 0 },
      { month: 'Feb', principal: 50000, earnings: 625, total_value: 50625, monthly_income: 625 },
      { month: 'Mar', principal: 75000, earnings: 1250, total_value: 76250, monthly_income: 937 },
      { month: 'Apr', principal: 75000, earnings: 2187, total_value: 77187, monthly_income: 937 },
      { month: 'May', principal: 100000, earnings: 3124, total_value: 103124, monthly_income: 1250 },
      { month: 'Jun', principal: 150000, earnings: 4999, total_value: 154999, monthly_income: 1875 },
      { month: 'Jul', principal: 150000, earnings: 6874, total_value: 156874, monthly_income: 1875 },
      { month: 'Aug', principal: 150000, earnings: 8749, total_value: 158749, monthly_income: 1875 }
    ],
    tier_distribution: [
      { tier: 'VIP', amount: 100000, count: 2, apy: 15, color: '#8B5CF6' },
      { tier: 'PREMIUM', amount: 30000, count: 1, apy: 12, color: '#3B82F6' },
      { tier: 'CLUB', amount: 20000, count: 2, apy: 8, color: '#10B981' }
    ],
    monthly_projections: [
      { month: 'Sep', projected_income: 1875, cumulative_earnings: 10624 },
      { month: 'Oct', projected_income: 1875, cumulative_earnings: 12499 },
      { month: 'Nov', projected_income: 1875, cumulative_earnings: 14374 },
      { month: 'Dec', projected_income: 1875, cumulative_earnings: 16249 },
      { month: 'Jan+1', projected_income: 1875, cumulative_earnings: 18124 },
      { month: 'Feb+1', projected_income: 1875, cumulative_earnings: 19999 }
    ],
    comparison_data: {
      vs_traditional_savings: 14.7, // 15.2% - 0.5% savings rate
      vs_stock_market: 5.2,        // 15.2% - 10% stock market
      vs_crypto_yield: -2.8        // 15.2% - 18% crypto yield
    }
  };

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    try {
      // NOTE: Replace with actual API call
      // const response = await apiService.makeRequest('GET', '/staking/analytics', undefined, user.token);
      
      // For now, use mock data
      setTimeout(() => {
        setAnalyticsData(mockAnalyticsData);
        setLoading(false);
      }, 1000);
    } catch (err: any) {
      console.error('Failed to fetch analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [user?.token, selectedTimeframe]);

  const formatCurrency = (value: number, compact = false) => {
    if (compact && value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (compact && value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <MobileLayoutWithTabs showTabs={true} currentScreen="staking-analytics">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('common:loading', 'Loading...')}</p>
          </div>
        </div>
      </MobileLayoutWithTabs>
    );
  }

  if (error || !analyticsData) {
    return (
      <MobileLayoutWithTabs showTabs={true} currentScreen="staking-analytics">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchAnalyticsData}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              {t('common:retry', 'Retry')}
            </button>
          </div>
        </div>
      </MobileLayoutWithTabs>
    );
  }

  const metrics = analyticsData.portfolio_metrics;

  return (
    <MobileLayoutWithTabs showTabs={true} currentScreen="staking-analytics">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 rounded-t-lg mb-4">
        <div className="px-4 py-4">
          <div className="flex items-center">
            <button 
              onClick={onBack}
              className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 mr-4"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div>
              <h1 className="text-xl font-semibold text-white">
                {t('staking:analytics.title', 'Staking Analytics')}
              </h1>
              <p className="text-gray-400 text-sm">
                {t('staking:analytics.subtitle', 'Detailed performance metrics and insights')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-green-600 bg-opacity-20 rounded-full p-2">
                <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-right">
                <ArrowUpIcon className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatCurrency(metrics.total_portfolio_value, true)}
            </p>
            <p className="text-sm text-gray-400">
              {t('staking:analytics.metrics.totalValue', 'Total Portfolio Value')}
            </p>
            <p className="text-xs text-green-400 mt-1">
              +{formatCurrency(metrics.total_earnings, true)} earnings
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-purple-600 bg-opacity-20 rounded-full p-2">
                <TrendingUpIcon className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-400 mb-1">
              {metrics.average_apy.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-400">
              {t('staking:analytics.metrics.averageAPY', 'Average APY')}
            </p>
            <p className="text-xs text-purple-400 mt-1">
              vs {metrics.annualized_return.toFixed(1)}% realized
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-600 bg-opacity-20 rounded-full p-2">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-400 mb-1">
              {formatCurrency(metrics.monthly_income, true)}
            </p>
            <p className="text-sm text-gray-400">
              {t('staking:analytics.metrics.monthlyIncome', 'Monthly Income')}
            </p>
            <p className="text-xs text-blue-400 mt-1">
              +{metrics.monthly_growth_rate.toFixed(2)}% monthly growth
            </p>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-orange-600 bg-opacity-20 rounded-full p-2">
                <ClockIcon className="w-5 h-5 text-orange-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-400 mb-1">
              {metrics.time_to_avg_maturity}
            </p>
            <p className="text-sm text-gray-400">
              {t('staking:analytics.metrics.timeToMaturity', 'Avg. Days to Maturity')}
            </p>
            <p className="text-xs text-orange-400 mt-1">
              across all active stakes
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('staking:analytics.charts.portfolioGrowth', 'Portfolio Growth Over Time')}
          </h3>
          
          <div className="flex space-x-2 mb-4">
            {(['3m', '6m', '1y', 'all'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
                style={{ minHeight: '32px' }}
              >
                {timeframe.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Portfolio Growth Chart */}
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.performance_chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="totalValueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6B7280" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="principal"
                  stackId="1"
                  stroke="#6B7280"
                  fill="url(#principalGradient)"
                  name="Principal"
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stackId="1"
                  stroke="#8B5CF6"
                  fill="url(#totalValueGradient)"
                  name="Earnings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tier Distribution */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('staking:analytics.charts.earningsBreakdown', 'Earnings Breakdown by Tier')}
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pie Chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.tier_distribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="amount"
                    label={false}
                  >
                    {analyticsData.tier_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tier Details */}
            <div className="space-y-3">
              {analyticsData.tier_distribution.map((tier) => (
                <div key={tier.tier} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: tier.color }}
                    ></div>
                    <div>
                      <p className="text-white font-medium text-sm">{tier.tier}</p>
                      <p className="text-gray-400 text-xs">{tier.apy}% APY • {tier.count} stakes</p>
                    </div>
                  </div>
                  <p className="text-white font-semibold text-sm">
                    {formatCurrency(tier.amount, true)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Income Projection */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('staking:analytics.charts.monthlyIncome', 'Monthly Income Projection')}
          </h3>
          
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.monthly_projections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(value, true)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="projected_income" 
                  fill="#3B82F6" 
                  name="Monthly Income"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            Performance vs Traditional Investments
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-green-600 bg-opacity-20 rounded-full p-2 mr-3">
                  <TrendingUpIcon className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">vs Traditional Savings</p>
                  <p className="text-gray-400 text-xs">0.5% average savings rate</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-semibold">
                  +{analyticsData.comparison_data.vs_traditional_savings.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">better</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-blue-600 bg-opacity-20 rounded-full p-2 mr-3">
                  <ChartBarIcon className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">vs Stock Market</p>
                  <p className="text-gray-400 text-xs">~10% average annual return</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-semibold">
                  +{analyticsData.comparison_data.vs_stock_market.toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">better</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-orange-600 bg-opacity-20 rounded-full p-2 mr-3">
                  <CurrencyDollarIcon className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">vs Crypto Yield Farming</p>
                  <p className="text-gray-400 text-xs">~18% average but high risk</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-orange-400 font-semibold">
                  {Math.abs(analyticsData.comparison_data.vs_crypto_yield).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-400">lower risk</p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk vs Return Analysis */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">
                Portfolio Analysis Insights
              </h4>
              <div className="text-sm text-blue-300 space-y-2">
                <p>• Your portfolio shows consistent {metrics.monthly_growth_rate.toFixed(2)}% monthly growth</p>
                <p>• {metrics.average_apy.toFixed(1)}% average APY outperforms traditional savings by {analyticsData.comparison_data.vs_traditional_savings.toFixed(1)}%</p>
                <p>• Diversified across {analyticsData.tier_distribution.length} VIP tiers reduces risk</p>
                <p>• 12-month lock period provides guaranteed returns regardless of market volatility</p>
                <p>• Expected total earnings: {formatCurrency(metrics.total_earnings + (metrics.monthly_income * (metrics.time_to_avg_maturity / 30)))} over next 12 months</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate?.('create-staking')}
            className="bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
            style={{ minHeight: '44px' }}
          >
            <ArrowUpIcon className="w-5 h-5 mr-2" />
            Increase Investment
          </button>

          <button
            onClick={() => onNavigate?.('staking-dashboard')}
            className="bg-gray-800 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
            style={{ minHeight: '44px' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </MobileLayoutWithTabs>
  );
};