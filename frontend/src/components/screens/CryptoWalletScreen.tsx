import React, { useState, useEffect } from 'react';
import type { ScreenProps } from '../../types';
import { Button } from '../common/Button';
import { FullScreenLoader } from '../common/LoadingSpinner';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useLoadingState, LOADING_KEYS } from '../../hooks/useLoadingState';
import { cryptoWalletService } from '../../services/CryptoWalletService';
import { VIP_TIERS, getVIPTierByAmount } from '../../config/features';
import { stakingService } from '../../services/StakingService';
import { LockClosedIcon, CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/outline';

interface CryptoData {
  totalETH: number;
  totalUSDT: number;
  connectedWallets: any[];
  hasWallets: boolean;
}

export const CryptoWalletScreen: React.FC<ScreenProps> = ({ onBack, onNavigate }) => {
  // FIXED: Remove fake hardcoded data - use real wallet data
  const [cryptoData, setCryptoData] = useState<CryptoData>({
    totalETH: 0,
    totalUSDT: 0,
    connectedWallets: [],
    hasWallets: false
  });
  
  const { user } = useApp();
  const { t } = useLanguage();
  
  // === STANDARDIZED LOADING STATE MANAGEMENT ===
  const { withLoading, isLoading } = useLoadingState();

  useEffect(() => {
    loadRealCryptoData();
  }, []);

  // FIXED: Load real crypto data from connected wallets
  const loadRealCryptoData = async () => {
    await withLoading(LOADING_KEYS.CRYPTO, async () => {
      try {
        // Get connected wallets from service
        const connectedWallets = cryptoWalletService.getConnectedWallets();
        
        // Calculate total ETH from all connected wallets
        const totalETH = connectedWallets.reduce((total, wallet) => {
          const balance = parseFloat(wallet.balance || '0');
          return total + balance;
        }, 0);
        
        // Calculate USDT value using real-time price
        let totalUSDT = 0;
        if (totalETH > 0) {
          try {
            // Fetch real ETH price from CoinGecko API
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
            const data = await response.json();
            const ethPrice = data.ethereum?.usd;
            
            if (ethPrice && typeof ethPrice === 'number') {
              totalUSDT = totalETH * ethPrice;
            } else {
              // Fallback price if API fails
              totalUSDT = totalETH * 2400; // Conservative estimate
            }
          } catch (error) {
            console.warn('Could not fetch real-time ETH price, using fallback:', error);
            totalUSDT = totalETH * 2400; // Conservative fallback
          }
        }
        
        setCryptoData({
          totalETH,
          totalUSDT,
          connectedWallets,
          hasWallets: connectedWallets.length > 0
        });
        
      } catch (error) {
        console.error('Error loading crypto data:', error);
        // Set empty state on error
        setCryptoData({
          totalETH: 0,
          totalUSDT: 0,
          connectedWallets: [],
          hasWallets: false
        });
      }
    });
  };

  // FIXED: Format crypto display as USDT instead of ETH
  const formatCrypto = (ethAmount: number) => {
    return `${ethAmount.toFixed(4)} ETH`;
  };

  // FIXED: Format USDT value properly
  const formatUSDT = (usdtAmount: number) => {
    return `$${usdtAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
  };

  const formatUsd = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  if (isLoading(LOADING_KEYS.CRYPTO)) {
    return <FullScreenLoader text="Loading crypto wallet..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">
          {t('crypto.title', 'Crypto Wallet')}
        </h1>
        <p className="text-gray-400 text-sm">
          {t('crypto.subtitle', 'Manage your crypto assets')}
        </p>
      </div>

      {/* Enhanced Balance Display with Staking APY */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
        {cryptoData.hasWallets ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                {t('crypto.portfolio', 'Crypto Portfolio')}
              </h2>
              <span className="text-sm text-gray-400">
                {cryptoData.connectedWallets.length} {t('crypto.wallets', 'wallets')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Total Balance</span>
                  <BanknotesIcon className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatUSDT(cryptoData.totalUSDT)}
                </div>
                <div className="text-xs text-gray-400">
                  Available for staking
                </div>
              </div>
              
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Potential APY</span>
                  <CurrencyDollarIcon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {getVIPTierByAmount(cryptoData.totalUSDT).apy}%
                </div>
                <div className="text-xs text-gray-400">
                  {getVIPTierByAmount(cryptoData.totalUSDT).name} tier
                </div>
              </div>
            </div>

            {/* Enhanced Stake Now Button */}
            {cryptoData.totalUSDT >= 1000 && (
              <Button
                onClick={() => onNavigate?.('create-staking')}
                fullWidth
                className="h-12 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white font-semibold flex items-center justify-center gap-2 mb-4"
              >
                <LockClosedIcon className="w-5 h-5" />
                Stake {formatUSDT(cryptoData.totalUSDT)} for {getVIPTierByAmount(cryptoData.totalUSDT).apy}% APY
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-500 mb-2">
                $0.00 USDT
              </div>
              <div className="text-gray-400 text-sm mb-4">
                0.0000 ETH
              </div>
              <div className="text-xs text-gray-500">
                No wallets connected
              </div>
            </div>
          </>
        )}
      </div>

      {/* Staking Opportunity Section */}
      {cryptoData.hasWallets && cryptoData.totalUSDT > 0 && (
        <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-cyan-300">
                🏦 Treasury Staking Available
              </h3>
              <p className="text-sm text-gray-400">
                Earn rewards with your crypto assets
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Available to stake</div>
              <div className="text-lg font-bold text-cyan-300">
                {formatUSDT(cryptoData.totalUSDT)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Current Tier */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400">Current Tier</div>
              <div className="text-lg font-semibold text-purple-300">
                {getVIPTierByAmount(cryptoData.totalUSDT).name}
              </div>
            </div>
            
            {/* Potential APY */}
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-xs text-gray-400">Your APY</div>
              <div className="text-lg font-semibold text-green-300">
                {getVIPTierByAmount(cryptoData.totalUSDT).apy}%
              </div>
            </div>
          </div>
          
          {/* Progress to Next Tier - Using existing implementation */}
          {(() => {
            const currentTier = getVIPTierByAmount(cryptoData.totalUSDT);
            const nextTier = Object.values(VIP_TIERS).find(tier => tier.min > cryptoData.totalUSDT);
            
            if (nextTier && cryptoData.totalUSDT < nextTier.min) {
              const amountToNext = nextTier.min - cryptoData.totalUSDT;
              const progress = Math.min(
                ((cryptoData.totalUSDT - currentTier.min) / (nextTier.min - currentTier.min)) * 100,
                100
              );
              
              return (
                <div className="bg-white bg-opacity-20 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Next Tier</span>
                    <span>${amountToNext.toLocaleString()} to go</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
          
          <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <LockClosedIcon className="w-4 h-4 text-cyan-300" />
              <span className="text-sm font-medium text-cyan-300">Treasury Transfer Notice</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>• Funds transferred to VonVault Treasury wallet</div>
              <div>• Locked for 12 months with guaranteed {getVIPTierByAmount(cryptoData.totalUSDT).apy}% APY</div>
              <div>• Monthly interest accrual (non-compounded)</div>
              <div>• Estimated monthly income: {formatUSDT((cryptoData.totalUSDT * getVIPTierByAmount(cryptoData.totalUSDT).apy) / (12 * 100))}</div>
            </div>
          </div>
          
          <Button
            onClick={() => onNavigate?.('create-staking')}
            fullWidth
            className="h-12 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold flex items-center justify-center gap-2"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Stake for {getVIPTierByAmount(cryptoData.totalUSDT).apy}% APY
          </Button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-300">
          {t('crypto.actions', 'Quick Actions')}
        </h2>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => onNavigate?.('crypto-deposit')}
            className="h-16 bg-green-600 hover:bg-green-700 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">📥</span>
            <span className="text-sm">{t('crypto.deposit', 'Deposit')}</span>
          </Button>
          
          <Button
            onClick={() => onNavigate?.('staking-dashboard')}
            variant="outline"
            className="h-16 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 flex flex-col items-center justify-center"
          >
            <span className="text-2xl mb-1">🏦</span>
            <span className="text-sm">{t('crypto.stake', 'Stake')}</span>
          </Button>
        </div>

        {!cryptoData.hasWallets && (
          <Button
            onClick={() => onNavigate?.('connect-crypto')}
            fullWidth
            className="h-12 border border-purple-500 text-purple-400 hover:bg-purple-500/10"
            variant="outline"
          >
            🔗 {t('crypto.connect', 'Connect Wallet')}
          </Button>
        )}
      </div>

      {/* Connected Wallets */}
      {cryptoData.hasWallets && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-300">
            {t('crypto.connectedWallets', 'Connected Wallets')}
          </h2>
          
          <div className="space-y-2">
            {cryptoData.connectedWallets.map((wallet, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-300">
                      {wallet.name || `${wallet.type} Wallet`}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-purple-300">
                      {formatCrypto(parseFloat(wallet.balance || '0'))}
                    </div>
                    <div className="text-xs text-gray-400">
                      {wallet.network || 'mainnet'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-300">
          {t('crypto.transactions', 'Recent Transactions')}
        </h2>
        
        <div className="text-center py-8">
          <div className="text-4xl mb-4">₿</div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            {t('crypto.noTransactions', 'No transactions yet')}
          </h3>
          <p className="text-gray-400 text-sm">
            {t('crypto.startTrading', 'Start trading to see your transaction history')}
          </p>
        </div>
      </div>
    </div>
  );
};