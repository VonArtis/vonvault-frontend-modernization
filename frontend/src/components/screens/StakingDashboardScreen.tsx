import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  PlusIcon,
  HomeIcon,
  TrendingUpIcon,
  CalendarIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import type { ScreenProps } from '../../types';

// VIP Tier Configuration
const VIP_TIERS = [
  {
    name: 'BASIC',
    min_amount: 0,
    max_amount: 999,
    apy: 0,
    color: '#9CA3AF',
    benefits: ['Wallet Connection', 'Platform Access', 'Basic Support'],
    staking_enabled: false
  },
  {
    name: 'CLUB', 
    min_amount: 1000,
    max_amount: 9999,
    apy: 8,
    color: '#10B981',
    benefits: ['8% APY', 'Monthly Interest', 'Community Access', 'Email Support'],
    staking_enabled: true
  },
  {
    name: 'PREMIUM',
    min_amount: 10000,
    max_amount: 49999,
    apy: 12,
    color: '#3B82F6',
    benefits: ['12% APY', 'Monthly Interest', 'Priority Support', 'Advanced Analytics'],
    staking_enabled: true
  },
  {
    name: 'VIP',
    min_amount: 50000,
    max_amount: 199999,
    apy: 15,
    color: '#8B5CF6',
    benefits: ['15% APY', 'Monthly Interest', 'VIP Support', 'Exclusive Events', 'Fee Discounts'],
    staking_enabled: true
  },
  {
    name: 'ELITE',
    min_amount: 200000,
    max_amount: 250000,
    apy: 20,
    color: '#F59E0B',
    benefits: ['20% APY', 'Monthly Interest', 'Personal Manager', 'Early Access', 'Premium Events'],
    staking_enabled: true
  }
];

interface StakingInvestment {
  id: string;
  user_id: string;
  amount: number;
  token: 'USDT' | 'USDC';
  apy: number;
  start_date: string;
  maturity_date: string;
  days_completed: number;
  days_remaining: number;
  accrued_interest: number;
  monthly_interest: number;
  status: 'Active' | 'Matured' | 'Claimed' | 'Pending';
  smart_contract_address?: string;
  transaction_hash?: string;
  created_at: string;
}

interface StakingPortfolio {
  total_staked: number;
  total_accrued: number;
  current_tier: string;
  current_apy: number;
  monthly_income: number;
  investments: StakingInvestment[];
  next_tier?: string;
  amount_to_next_tier?: number;
  tier_progress_percentage: number;
}

interface StakingDashboardScreenProps extends ScreenProps {}

export const StakingDashboardScreen: React.FC<StakingDashboardScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { t } = useTranslation(['common', 'dashboard', 'staking']);
  const { user, loading: authLoading } = useApp();
  const [stakingPortfolio, setStakingPortfolio] = useState<StakingPortfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate user tier based on total invested
  const calculateUserTier = (totalInvested: number) => {
    for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
      const tier = VIP_TIERS[i];
      if (totalInvested >= tier.min_amount) {
        return tier;
      }
    }
    return VIP_TIERS[0]; // BASIC tier
  };

  // Calculate days remaining for investment
  const calculateDaysRemaining = (maturityDate: string): number => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Fetch staking portfolio data
  const fetchStakingPortfolio = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    try {
      // NOTE: These API endpoints need to be implemented in your backend
      const response = await apiService.makeRequest('GET', '/staking/portfolio', undefined, user.token);
      
      if (response?.data) {
        setStakingPortfolio(response.data);
      } else {
        // Mock data for demonstration - remove when API is ready
        const mockData: StakingPortfolio = {
          total_staked: 75500,
          total_accrued: 8240,
          current_tier: 'VIP',
          current_apy: 15,
          monthly_income: 945,
          tier_progress_percentage: 38,
          amount_to_next_tier: 124500,
          investments: [
            {
              id: '1',
              user_id: user.id || '',
              amount: 50000,
              token: 'USDC',
              apy: 15,
              start_date: '2024-07-01',
              maturity_date: '2025-07-01',
              days_completed: 178,
              days_remaining: 187,
              accrued_interest: 5625,
              monthly_interest: 625,
              status: 'Active',
              created_at: '2024-07-01'
            },
            {
              id: '2',
              user_id: user.id || '',
              amount: 25500,
              token: 'USDT',
              apy: 15,
              start_date: '2024-06-15',
              maturity_date: '2025-06-15',
              days_completed: 162,
              days_remaining: 203,
              accrued_interest: 2615,
              monthly_interest: 320,
              status: 'Active',
              created_at: '2024-06-15'
            }
          ]
        };
        setStakingPortfolio(mockData);
      }
    } catch (err: any) {
      console.error('Failed to fetch staking portfolio:', err);
      setError(err.message || 'Failed to load staking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStakingPortfolio();
  }, [user?.token]);

  const currentTier = VIP_TIERS.find(tier => tier.name === stakingPortfolio?.current_tier) || VIP_TIERS[0];

  if (authLoading || loading) {
    return (
      <MobileLayoutWithTabs showTabs={true} currentScreen="staking-dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">{t('common:loading', 'Loading...')}</p>
          </div>
        </div>
      </MobileLayoutWithTabs>
    );
  }

  if (error) {
    return (
      <MobileLayoutWithTabs showTabs={true} currentScreen="staking-dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchStakingPortfolio}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
              {t('common:retry', 'Retry')}
            </button>
          </div>
        </div>
      </MobileLayoutWithTabs>
    );
  }

  return (
    <MobileLayoutWithTabs showTabs={true} currentScreen="staking-dashboard">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 rounded-t-lg mb-4">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <h1 className="text-xl font-semibold text-white">
              {t('staking:dashboard.title', 'Staking Dashboard')}
            </h1>
            
            <button 
              onClick={() => onNavigate?.('create-staking')}
              className="flex items-center justify-center bg-purple-600 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-purple-700 transition-all duration-200"
              style={{ minHeight: '44px' }}
              disabled={!currentTier.staking_enabled}
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              {t('staking:dashboard.createStake', 'Stake')}
            </button>
          </div>
        </div>
      </div>

      {/* VIP Tier Status Card */}
      <div 
        className="rounded-xl p-6 text-white mb-6 relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${currentTier.color}dd 0%, #4B365E 100%)` 
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center mb-2">
              <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                <LockClosedIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold">
                {stakingPortfolio?.current_tier} {t('staking:dashboard.tier', 'Tier')}
              </h3>
            </div>
            <p className="text-sm opacity-90 mb-1">
              {t('staking:dashboard.totalInvested', 'Total Invested')}: ${stakingPortfolio?.total_staked.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{stakingPortfolio?.current_apy}%</p>
            <p className="text-xs opacity-75">{t('staking:dashboard.apy', 'APY')}</p>
          </div>
        </div>

        {/* Progress to Next Tier */}
        {stakingPortfolio?.amount_to_next_tier && stakingPortfolio.amount_to_next_tier > 0 && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex justify-between text-sm mb-2">
              <span>{t('staking:dashboard.progressToNext', 'Progress to Next Tier')}</span>
              <span>${stakingPortfolio.amount_to_next_tier.toLocaleString()} {t('staking:dashboard.toGo', 'to go')}</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${stakingPortfolio.tier_progress_percentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-600 bg-opacity-20 rounded-full p-2">
              <CurrencyDollarIcon className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            ${stakingPortfolio?.total_staked.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">{t('staking:dashboard.totalStaked', 'Total Staked')}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-600 bg-opacity-20 rounded-full p-2">
              <TrendingUpIcon className="w-5 h-5 text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-400 mb-1">
            ${stakingPortfolio?.total_accrued.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">{t('staking:dashboard.interestEarned', 'Interest Earned')}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-600 bg-opacity-20 rounded-full p-2">
              <CalendarIcon className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400 mb-1">
            ${stakingPortfolio?.monthly_income.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">{t('staking:dashboard.monthlyIncome', 'Monthly Income')}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-gray-600 bg-opacity-20 rounded-full p-2">
              <LockClosedIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {stakingPortfolio?.investments.length || 0}
          </p>
          <p className="text-sm text-gray-400">{t('staking:dashboard.activeStakes', 'Active Stakes')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          {t('staking:dashboard.quickActions', 'Quick Actions')}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate?.('create-staking')}
            className="bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-all duration-200 flex items-center justify-center"
            style={{ minHeight: '44px' }}
            disabled={!currentTier.staking_enabled}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            {t('staking:dashboard.newStake', 'New Stake')}
          </button>
          
          <button 
            onClick={() => onNavigate?.('staking-tiers')}
            className="bg-gray-800 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 flex items-center justify-center border border-gray-700"
            style={{ minHeight: '44px' }}
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            {t('staking:dashboard.viewTiers', 'View Tiers')}
          </button>
        </div>
      </div>

      {/* Active Stakes */}
      {stakingPortfolio?.investments && stakingPortfolio.investments.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t('staking:dashboard.activeStakes', 'Active Stakes')}
            </h3>
            <button 
              onClick={() => onNavigate?.('staking-history')}
              className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
            >
              {t('common:viewAll', 'View All')}
            </button>
          </div>
          
          <div className="space-y-4">
            {stakingPortfolio.investments.slice(0, 3).map((investment) => (
              <div key={investment.id} className="border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <div className="bg-purple-600 bg-opacity-20 rounded-full p-2 mr-3">
                      <CurrencyDollarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        ${investment.amount.toLocaleString()} {investment.token}
                      </p>
                      <p className="text-sm text-gray-400">
                        {currentTier.name} {t('staking:dashboard.tier', 'Tier')} • {investment.apy}% {t('staking:dashboard.apy', 'APY')}
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    investment.status === 'Active' ? 'bg-green-900 text-green-300' :
                    investment.status === 'Matured' ? 'bg-blue-900 text-blue-300' :
                    'bg-gray-800 text-gray-300'
                  }`}>
                    {investment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t('staking:dashboard.interestEarned', 'Interest Earned')}
                    </p>
                    <p className="font-semibold text-green-400">
                      +${investment.accrued_interest.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t('staking:dashboard.daysRemaining', 'Days Remaining')}
                    </p>
                    <p className="font-semibold text-blue-400 flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {investment.days_remaining} {t('staking:dashboard.days', 'days')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('staking:dashboard.progress', 'Progress')}</span>
                    <span className="text-gray-300">
                      {investment.days_completed}/{365} {t('staking:dashboard.days', 'days')}
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(investment.days_completed / 365) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {investment.status === 'Matured' && (
                  <button 
                    onClick={() => {/* Handle claim */}}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                    style={{ minHeight: '44px' }}
                  >
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                    {t('staking:dashboard.claim', 'Claim')} ${(investment.amount + investment.accrued_interest).toLocaleString()}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!stakingPortfolio?.investments || stakingPortfolio.investments.length === 0) && (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
          <div className="bg-purple-600 bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <LockClosedIcon className="w-8 h-8 text-purple-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {currentTier.staking_enabled 
              ? t('staking:dashboard.startStaking', 'Start Staking Today')
              : t('staking:dashboard.upgradeToStake', 'Upgrade to Start Staking')
            }
          </h3>
          <p className="text-gray-400 mb-6">
            {currentTier.staking_enabled 
              ? t('staking:dashboard.earnUpTo', `Earn ${currentTier.apy}% APY with 12-month locked staking`)
              : t('staking:dashboard.investMinimum', 'Invest at least $1,000 to unlock staking features')
            }
          </p>
          <button 
            onClick={() => onNavigate?.(currentTier.staking_enabled ? 'create-staking' : 'investments')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentTier.staking_enabled
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
            }`}
            style={{ minHeight: '44px' }}
          >
            {currentTier.staking_enabled 
              ? t('staking:dashboard.createFirstStake', 'Create First Stake')
              : t('staking:dashboard.viewInvestments', 'View Investments')
            }
          </button>
        </div>
      )}
    </MobileLayoutWithTabs>
  );
};