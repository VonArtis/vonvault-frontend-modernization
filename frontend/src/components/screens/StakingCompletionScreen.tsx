import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  CheckCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ShareIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import type { ScreenProps } from '../../types';

interface StakingCompletionScreenProps extends ScreenProps {
  investment?: {
    id: string;
    amount: number;
    token: 'USDC' | 'USDT';
    apy: number;
    tier: string;
  };
}

export const StakingCompletionScreen: React.FC<StakingCompletionScreenProps> = ({
  onBack,
  onNavigate,
  investment
}) => {
  const { t } = useTranslation(['common', 'staking']);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  // Default mock data if no investment passed
  const stakingData = investment || {
    id: 'stake_' + Date.now(),
    amount: 50000,
    token: 'USDC' as const,
    apy: 15,
    tier: 'VIP'
  };

  const monthlyInterest = (stakingData.amount * stakingData.apy) / (12 * 100);
  const totalReturn = monthlyInterest * 12;
  const maturityDate = new Date();
  maturityDate.setFullYear(maturityDate.getFullYear() + 1);

  // Hide confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyInvestmentId = async () => {
    try {
      await navigator.clipboard.writeText(stakingData.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'VonVault Staking Investment',
      text: `I just created a ${stakingData.tier} tier staking investment earning ${stakingData.apy}% APY!`,
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for desktop
        await navigator.clipboard.writeText(
          `${shareData.text} ${shareData.url}`
        );
        alert(t('staking:completion.shareText', 'Share text copied to clipboard!'));
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const getTierColor = (tier: string) => {
    const colors = {
      CLUB: '#10B981',
      PREMIUM: '#3B82F6', 
      VIP: '#8B5CF6',
      ELITE: '#F59E0B'
    };
    return colors[tier as keyof typeof colors] || '#8B5CF6';
  };

  return (
    <MobileLayoutWithTabs showTabs={true} currentScreen="staking-completion">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 overflow-hidden">
            {/* Simple CSS confetti effect */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{
                    left: `${(i - 10) * 20}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center py-8">
          <div className="bg-green-600 bg-opacity-20 rounded-full p-4 w-20 h-20 mx-auto mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('staking:completion.title', 'Staking Investment Created!')}
          </h1>
          
          <p className="text-gray-400 text-lg">
            {t('staking:completion.subtitle', 'Your funds are now earning guaranteed returns')}
          </p>
        </div>

        {/* Investment Summary Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              {t('staking:completion.summary.title', 'Investment Summary')}
            </h3>
            <span 
              className="px-3 py-1 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: getTierColor(stakingData.tier) + '30',
                color: getTierColor(stakingData.tier)
              }}
            >
              {stakingData.tier} {t('staking:completion.tier', 'Tier')}
            </span>
          </div>

          <div className="space-y-4">
            {/* Investment Amount */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-600 bg-opacity-20 rounded-full p-2 mr-3">
                  <CurrencyDollarIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    ${stakingData.amount.toLocaleString()} {stakingData.token}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('staking:completion.summary.principal', 'Principal Amount')}
                  </p>
                </div>
              </div>
            </div>

            {/* APY & Returns */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400 mb-1">
                  {stakingData.apy}%
                </p>
                <p className="text-gray-400 text-sm">
                  {t('staking:completion.summary.apy', 'Annual APY')}
                </p>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-400 mb-1">
                  ${monthlyInterest.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-gray-400 text-sm">
                  {t('staking:completion.summary.monthly', 'Monthly Interest')}
                </p>
              </div>
            </div>

            {/* Lock Period */}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center">
                <div className="bg-orange-600 bg-opacity-20 rounded-full p-2 mr-3">
                  <LockClosedIcon className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    {t('staking:completion.summary.lockPeriod', '12 Months')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('staking:completion.summary.until', 'Until')} {maturityDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Return */}
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-medium">
                  {t('staking:completion.summary.totalReturn', 'Total Return After 12 Months')}:
                </span>
                <span className="text-xl font-bold text-white">
                  ${(stakingData.amount + totalReturn).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="text-right mt-1">
                <span className="text-green-400 text-sm">
                  +${totalReturn.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {t('staking:completion.summary.profit', 'profit')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Investment ID */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">
                {t('staking:completion.investmentId', 'Investment ID')}
              </p>
              <p className="text-white font-mono text-sm">
                {stakingData.id}
              </p>
            </div>
            <button
              onClick={handleCopyInvestmentId}
              className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <DocumentDuplicateIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          {copied && (
            <p className="text-green-400 text-sm mt-2">
              {t('staking:completion.copied', 'Copied to clipboard!')}
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
          <h4 className="font-semibold text-blue-400 mb-3">
            {t('staking:completion.nextSteps.title', 'What happens next?')}
          </h4>
          <div className="text-sm text-blue-300 space-y-2">
            <p>• {t('staking:completion.nextSteps.treasury', 'Your funds are securely transferred to our treasury wallet')}</p>
            <p>• {t('staking:completion.nextSteps.conversion', 'Crypto is converted to FIAT for investment strategies')}</p>
            <p>• {t('staking:completion.nextSteps.interest', 'Interest accrues monthly and is visible in your dashboard')}</p>
            <p>• {t('staking:completion.nextSteps.maturity', 'After 12 months, claim your principal + interest')}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <button
            onClick={() => onNavigate?.('staking-dashboard')}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-medium text-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            style={{ minHeight: '44px' }}
          >
            {t('staking:completion.viewDashboard', 'View Staking Dashboard')}
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShare}
              className="bg-gray-800 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center border border-gray-700"
              style={{ minHeight: '44px' }}
            >
              <ShareIcon className="w-5 h-5 mr-2" />
              {t('staking:completion.share', 'Share')}
            </button>

            <button
              onClick={() => onNavigate?.('create-staking')}
              className="bg-gray-800 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center border border-gray-700"
              style={{ minHeight: '44px' }}
            >
              <CurrencyDollarIcon className="w-5 h-5 mr-2" />
              {t('staking:completion.createAnother', 'Stake More')}
            </button>
          </div>
        </div>
      </div>
    </MobileLayoutWithTabs>
  );
};