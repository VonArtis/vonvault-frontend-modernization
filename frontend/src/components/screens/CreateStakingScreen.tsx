import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { stakingService } from '../../services/StakingService';
import { SMART_CONTRACTS, STAKING_CONFIG } from '../../config/features';
import type { ScreenProps } from '../../types';

// VIP Tier Configuration (same as dashboard)
const VIP_TIERS = [
  { name: 'BASIC', min_amount: 0, max_amount: 999, apy: 0, color: '#9CA3AF', staking_enabled: false },
  { name: 'CLUB', min_amount: 1000, max_amount: 9999, apy: 8, color: '#10B981', staking_enabled: true },
  { name: 'PREMIUM', min_amount: 10000, max_amount: 49999, apy: 12, color: '#3B82F6', staking_enabled: true },
  { name: 'VIP', min_amount: 50000, max_amount: 199999, apy: 15, color: '#8B5CF6', staking_enabled: true },
  { name: 'ELITE', min_amount: 200000, max_amount: 250000, apy: 20, color: '#F59E0B', staking_enabled: true }
];

interface CreateStakingScreenProps extends ScreenProps {}

export const CreateStakingScreen: React.FC<CreateStakingScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { t } = useTranslation(['common', 'staking']);
  const { user, primary_wallet, connectWallet } = useApp(); // Enhanced with wallet context
  const [amount, setAmount] = useState<string>('');
  const [token, setToken] = useState<'USDC' | 'USDT'>('USDC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [currentTotalInvested, setCurrentTotalInvested] = useState(0);
  const [walletBalances, setWalletBalances] = useState<{USDC: string, USDT: string}>({USDC: '0', USDT: '0'});

  // Enhanced wallet balance fetching
  useEffect(() => {
    const fetchWalletBalances = async () => {
      if (!primary_wallet?.address || !user?.token) return;
      
      try {
        // Initialize staking service with provider
        if (primary_wallet.provider) {
          await stakingService.initialize(primary_wallet.provider);
          
          // Get real-time balances from blockchain
          const usdcBalance = await stakingService.getUSDCBalance(primary_wallet.address);
          const usdtBalance = await stakingService.getUSDTBalance(primary_wallet.address);
          
          setWalletBalances({
            USDC: usdcBalance,
            USDT: usdtBalance
          });
        }
      } catch (error) {
        console.error('Failed to fetch wallet balances:', error);
        // Fallback to existing balance display
        setWalletBalances({
          USDC: primary_wallet.balance?.USDC || '0',
          USDT: primary_wallet.balance?.USDT || '0'
        });
      }
    };

    fetchWalletBalances();
  }, [primary_wallet, user?.token]);

  // Calculate what tier user will have after this investment
  const calculateTierAfterInvestment = (investmentAmount: number) => {
    const newTotal = currentTotalInvested + investmentAmount;
    for (let i = VIP_TIERS.length - 1; i >= 0; i--) {
      const tier = VIP_TIERS[i];
      if (newTotal >= tier.min_amount) {
        return tier;
      }
    }
    return VIP_TIERS[0];
  };

  // Get current user's total invested amount
  useEffect(() => {
    const fetchCurrentInvestment = async () => {
      if (!user?.token) return;
      
      try {
        // Use the new staking API endpoint to get current portfolio
        const response = await apiService.getStakingPortfolio(user.token);
        setCurrentTotalInvested(response.total_staked || 0);
      } catch (error) {
        console.error('Failed to fetch current investment:', error);
        // Fallback to 0 if API call fails
        setCurrentTotalInvested(0);
      }
    };

    fetchCurrentInvestment();
  }, [user?.token]);

  const numericAmount = parseFloat(amount) || 0;
  const tierAfterInvestment = calculateTierAfterInvestment(numericAmount);
  const monthlyInterest = numericAmount > 0 ? (numericAmount * tierAfterInvestment.apy) / (12 * 100) : 0;
  const totalAfter12Months = numericAmount + (monthlyInterest * 12);

  // Validation
  const isValidAmount = numericAmount >= 1000 && numericAmount <= 250000;
  const hasWallet = !!primary_wallet;
  const canProceed = isValidAmount && hasWallet && acceptedTerms && !loading;

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal points
    const sanitized = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      return;
    }
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setAmount(sanitized);
    setError(null);
  };

  const handleCreateStaking = async () => {
    if (!canProceed) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Validate with backend
      const stakingData = {
        amount: numericAmount,
        token,
        network: 'Ethereum', // Default network
        wallet_address: primary_wallet?.address || '',
        apy: tierAfterInvestment.apy,
        tier: tierAfterInvestment.name
      };

      // Use the new staking API endpoint
      const response = await apiService.createStakingInvestment(stakingData, user?.token || '');

      if (response?.investment) {
        // Step 2: Handle blockchain transaction through Reown AppKit
        // This would integrate with your existing crypto wallet service
        
        // For now, simulate success and navigate to completion
        setTimeout(() => {
          onNavigate?.('staking-completion', {
            investment: {
              id: response.investment.id,
              amount: numericAmount,
              token,
              apy: tierAfterInvestment.apy,
              tier: tierAfterInvestment.name
            }
          });
        }, 2000);
      }
    } catch (err: any) {
      console.error('Failed to create staking investment:', err);
      setError(err.message || t('staking:create.error.failed', 'Failed to create staking investment'));
    } finally {
      setLoading(false);
    }
  };

  const getAmountInputStyle = () => {
    if (!amount) return 'border-gray-700';
    if (numericAmount < 1000) return 'border-red-500';
    if (numericAmount > 250000) return 'border-red-500';
    return 'border-green-500';
  };

  return (
    <MobileLayoutWithTabs showTabs={true} currentScreen="create-staking">
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
            
            <h1 className="text-xl font-semibold text-white">
              {t('staking:create.title', 'Create Staking Investment')}
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Wallet Connection Status */}
        {!hasWallet && (
          <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
              <div>
                <p className="text-red-400 font-medium">
                  {t('staking:create.noWallet.title', 'Wallet Required')}
                </p>
                <p className="text-red-300 text-sm mt-1">
                  {t('staking:create.noWallet.description', 'Connect a crypto wallet to create staking investments')}
                </p>
              </div>
            </div>
            <button 
              onClick={() => onNavigate?.('crypto')}
              className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              style={{ minHeight: '44px' }}
            >
              {t('staking:create.connectWallet', 'Connect Wallet')}
            </button>
          </div>
        )}

        {/* Amount Input */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('staking:create.amount.title', 'Investment Amount')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('staking:create.amount.label', 'Amount (USD)')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder={t('staking:create.amount.placeholder', '1,000 - 250,000')}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border ${getAmountInputStyle()} focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors`}
                  style={{ minHeight: '44px' }}
                />
              </div>
              
              {/* Amount Validation Messages */}
              {amount && numericAmount < 1000 && (
                <p className="text-red-400 text-sm mt-2">
                  {t('staking:create.amount.validation.minimum', 'Minimum investment is $1,000')}
                </p>
              )}
              {amount && numericAmount > 250000 && (
                <p className="text-red-400 text-sm mt-2">
                  {t('staking:create.amount.validation.maximum', 'Maximum investment is $250,000')}
                </p>
              )}
              {isValidAmount && (
                <p className="text-green-400 text-sm mt-2 flex items-center">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  {t('staking:create.amount.validation.valid', 'Valid investment amount')}
                </p>
              )}
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[1000, 5000, 10000, 50000].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="bg-gray-800 text-gray-300 py-2 px-3 rounded-lg text-sm hover:bg-gray-700 transition-colors border border-gray-700"
                  style={{ minHeight: '44px' }}
                >
                  ${quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Token Selection */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('staking:create.token.title', 'Payment Token')}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {(['USDC', 'USDT'] as const).map((tokenOption) => (
              <button
                key={tokenOption}
                onClick={() => setToken(tokenOption)}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  token === tokenOption
                    ? 'border-purple-500 bg-purple-900 bg-opacity-50'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
                style={{ minHeight: '44px' }}
              >
                <div className="flex items-center justify-center">
                  <BanknotesIcon className="w-5 h-5 mr-2 text-gray-300" />
                  <span className="text-white font-medium">{tokenOption}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Investment Preview */}
        {isValidAmount && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('staking:create.preview.title', 'Investment Preview')}
            </h3>
            
            {/* Tier After Investment */}
            <div 
              className="rounded-lg p-4 mb-4"
              style={{ 
                background: `linear-gradient(135deg, ${tierAfterInvestment.color}20 0%, ${tierAfterInvestment.color}10 100%)`,
                border: `1px solid ${tierAfterInvestment.color}40`
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">
                  {t('staking:create.preview.tierAfter', 'Your Tier After Investment')}:
                </span>
                <span 
                  className="font-semibold px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: tierAfterInvestment.color + '30',
                    color: tierAfterInvestment.color
                  }}
                >
                  {tierAfterInvestment.name} ({tierAfterInvestment.apy}% APY)
                </span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {t('staking:create.preview.monthlyInterest', 'Monthly Interest')}:
                </span>
                <span className="font-semibold text-green-400">
                  ${monthlyInterest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {t('staking:create.preview.lockPeriod', 'Lock Period')}:
                </span>
                <span className="font-semibold text-white">
                  {t('staking:create.preview.twelveMonths', '12 months')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {t('staking:create.preview.totalReturn', 'Total Return')}:
                </span>
                <span className="font-semibold text-purple-400">
                  ${(monthlyInterest * 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              
              <div className="border-t border-gray-700 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">
                    {t('staking:create.preview.totalAfter', 'Total After 12 Months')}:
                  </span>
                  <span className="font-bold text-white text-lg">
                    ${totalAfter12Months.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treasury Wallet Disclosure */}
        {isValidAmount && (
          <div className="bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-start">
              <InformationCircleIcon className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-400 mb-2">
                  {t('staking:create.custody.title', 'Important: Custody Transfer')}
                </h4>
                <div className="text-sm text-yellow-300 space-y-2">
                  <p>• {t('staking:create.custody.transfer', 'Your USDC/USDT will be transferred to VonVault\'s treasury wallet')}</p>
                  <p>• {t('staking:create.custody.duration', 'We will custody your funds for the 12-month staking period')}</p>
                  <p>• {t('staking:create.custody.conversion', 'Your crypto will be converted to FIAT for investment strategies')}</p>
                  <p>• {t('staking:create.custody.guarantee', 'You\'ll receive guaranteed APY returns regardless of market conditions')}</p>
                  <p>• {t('staking:create.custody.return', 'Principal + interest returned after 12 months in original token')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Terms Acceptance */}
        {isValidAmount && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mt-0.5 mr-3"
              />
              <span className="text-sm text-gray-300">
                {t('staking:create.terms.prefix', 'I understand and accept the')}{' '}
                <button 
                  onClick={() => onNavigate?.('terms-of-service')}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {t('staking:create.terms.custody', 'custody terms')}
                </button>
                {' '}{t('staking:create.terms.and', 'and')}{' '}
                <button 
                  onClick={() => onNavigate?.('terms-of-service')}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  {t('staking:create.terms.staking', 'staking conditions')}
                </button>
              </span>
            </label>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-700 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Create Button */}
        <div className="pb-6">
          <button
            onClick={handleCreateStaking}
            disabled={!canProceed}
            className={`w-full py-4 rounded-lg font-medium text-lg transition-all duration-200 flex items-center justify-center ${
              canProceed
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed'
            }`}
            style={{ minHeight: '44px' }}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                {t('staking:create.button.creating', 'Creating Investment...')}
              </>
            ) : (
              <>
                <ShieldCheckIcon className="w-5 h-5 mr-3" />
                {t('staking:create.button.create', 'Create Staking Investment')}
              </>
            )}
          </button>
        </div>
      </div>
    </MobileLayoutWithTabs>
  );
};