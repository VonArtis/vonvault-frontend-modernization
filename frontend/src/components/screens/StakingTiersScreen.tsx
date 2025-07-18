import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  CheckIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { useApp } from '../../context/AppContext';
import type { ScreenProps } from '../../types';

// VIP Tier Configuration
const VIP_TIERS = [
  {
    name: 'BASIC',
    min_amount: 0,
    max_amount: 999,
    apy: 0,
    color: '#9CA3AF',
    gradient: 'from-gray-500 to-gray-600',
    staking_enabled: false,
    benefits: ['Wallet Connection', 'Platform Access', 'Basic Support']
  },
  {
    name: 'CLUB', 
    min_amount: 1000,
    max_amount: 9999,
    apy: 8,
    color: '#10B981',
    gradient: 'from-green-500 to-emerald-600',
    staking_enabled: true,
    benefits: ['8% APY', 'Monthly Interest', 'Community Access', 'Email Support']
  },
  {
    name: 'PREMIUM',
    min_amount: 10000,
    max_amount: 49999,
    apy: 12,
    color: '#3B82F6',
    gradient: 'from-blue-500 to-blue-600',
    staking_enabled: true,
    benefits: ['12% APY', 'Monthly Interest', 'Priority Support', 'Advanced Analytics']
  },
  {
    name: 'VIP',
    min_amount: 50000,
    max_amount: 199999,
    apy: 15,
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-purple-600',
    staking_enabled: true,
    benefits: ['15% APY', 'Monthly Interest', 'VIP Support', 'Exclusive Events', 'Fee Discounts']
  },
  {
    name: 'ELITE',
    min_amount: 200000,
    max_amount: 250000,
    apy: 20,
    color: '#F59E0B',
    gradient: 'from-yellow-500 to-orange-500',
    staking_enabled: true,
    benefits: ['20% APY', 'Monthly Interest', 'Personal Manager', 'Early Access', 'Premium Events']
  }
];

interface StakingTiersScreenProps extends ScreenProps {}

export const StakingTiersScreen: React.FC<StakingTiersScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { t } = useTranslation(['common', 'staking']);
  const { user } = useApp();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  
  // Mock current investment data - replace with real data
  const currentTotalInvested = 75500; // This should come from your API
  const currentTier = VIP_TIERS.find(tier => 
    currentTotalInvested >= tier.min_amount && currentTotalInvested <= tier.max_amount
  ) || VIP_TIERS[0];

  const getUserTierStatus = (tier: typeof VIP_TIERS[0]) => {
    if (currentTotalInvested >= tier.min_amount) {
      return currentTier.name === tier.name ? 'current' : 'unlocked';
    }
    return 'locked';
  };

  const getAmountNeededForTier = (tier: typeof VIP_TIERS[0]) => {
    if (currentTotalInvested >= tier.min_amount) return 0;
    return tier.min_amount - currentTotalInvested;
  };

  const getTierIcon = (tier: typeof VIP_TIERS[0], status: string) => {
    if (status === 'current') {
      return <StarIcon className="w-6 h-6" />;
    } else if (status === 'unlocked') {
      return <CheckIcon className="w-6 h-6" />;
    }
    return <LockClosedIcon className="w-6 h-6" />;
  };

  return (
    <MobileLayoutWithTabs showTabs={true} currentScreen="staking-tiers">
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
                {t('staking:tiers.title', 'VIP Tier System')}
              </h1>
              <p className="text-gray-400 text-sm">
                {t('staking:tiers.subtitle', 'Higher investments unlock better APY rates')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">
              {t('staking:tiers.current', 'Current Tier')}
            </p>
            <div className="flex items-center">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium mr-3"
                style={{ 
                  backgroundColor: currentTier.color + '30',
                  color: currentTier.color 
                }}
              >
                {t(`staking:tiers.tierNames.${currentTier.name}`, currentTier.name)}
              </span>
              <span className="text-white font-semibold">{currentTier.apy}% APY</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Total Invested</p>
            <p className="text-white font-semibold">${currentTotalInvested.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tier Progression */}
      <div className="space-y-4 mb-6">
        {VIP_TIERS.map((tier, index) => {
          const status = getUserTierStatus(tier);
          const amountNeeded = getAmountNeededForTier(tier);
          const isSelected = selectedTier === tier.name;

          return (
            <div key={tier.name} className="relative">
              {/* Connecting Line */}
              {index < VIP_TIERS.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-700 z-0"></div>
              )}

              <div
                className={`bg-gray-900 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected ? 'border-purple-500' : 'border-gray-800 hover:border-gray-700'
                }`}
                onClick={() => setSelectedTier(isSelected ? null : tier.name)}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {/* Status Icon */}
                      <div 
                        className={`rounded-full p-2 mr-4 z-10 ${
                          status === 'current' 
                            ? `bg-gradient-to-r ${tier.gradient}` 
                            : status === 'unlocked'
                            ? 'bg-green-600 bg-opacity-20'
                            : 'bg-gray-700'
                        }`}
                      >
                        <div className={`${
                          status === 'current' ? 'text-white' :
                          status === 'unlocked' ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {getTierIcon(tier, status)}
                        </div>
                      </div>

                      {/* Tier Info */}
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="text-lg font-semibold text-white mr-2">
                            {t(`staking:tiers.tierNames.${tier.name}`, tier.name)}
                          </h3>
                          {status === 'current' && (
                            <span className="bg-green-600 bg-opacity-20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          ${tier.min_amount.toLocaleString()} - ${tier.max_amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* APY Badge */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        tier.staking_enabled ? 'text-white' : 'text-gray-500'
                      }`}>
                        {tier.apy}%
                      </div>
                      <p className="text-gray-400 text-xs">
                        {tier.staking_enabled ? 'APY' : 'No Staking'}
                      </p>
                    </div>
                  </div>

                  {/* Requirements */}
                  {status === 'locked' && amountNeeded > 0 && (
                    <div className="bg-gray-800 rounded-lg p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">
                          {t('staking:tiers.investMore', 'Invest ${{amount}} more to unlock', { amount: amountNeeded.toLocaleString() })}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate?.('create-staking');
                          }}
                          className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                          style={{ minHeight: '32px' }}
                        >
                          {t('staking:tiers.upgrade', 'Upgrade')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Benefits (Expandable) */}
                  {isSelected && (
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <h4 className="text-white font-medium mb-3">
                        {t('staking:tiers.benefits', 'Benefits')}:
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {tier.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckIcon className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-gray-300 text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier Benefits Explanation */}
      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <InformationCircleIcon className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">
              How VIP Tiers Work
            </h4>
            <div className="text-sm text-blue-300 space-y-1">
              <p>• Higher total investment unlocks better APY rates</p>
              <p>• Tiers are based on your combined staking + regular investments</p>
              <p>• Benefits apply to all your investments immediately</p>
              <p>• Tier status updates automatically when you invest more</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-6">
        <button
          onClick={() => onNavigate?.('create-staking')}
          className="w-full bg-purple-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          style={{ minHeight: '44px' }}
          disabled={!currentTier.staking_enabled && currentTier.name === 'BASIC'}
        >
          <ArrowUpIcon className="w-5 h-5 mr-2" />
          {currentTier.name === 'ELITE' 
            ? t('staking:tiers.investMore', 'Invest More')
            : t('staking:tiers.upgrade', 'Upgrade Tier')
          }
        </button>

        <button
          onClick={() => onNavigate?.('staking-dashboard')}
          className="w-full bg-gray-800 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
          style={{ minHeight: '44px' }}
        >
          {t('staking:common.back', 'Back to Dashboard')}
        </button>
      </div>
    </MobileLayoutWithTabs>
  );
};