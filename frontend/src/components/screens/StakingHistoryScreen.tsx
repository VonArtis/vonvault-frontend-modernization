import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeftIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { MobileLayoutWithTabs } from '../layout/MobileLayoutWithTabs';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import type { ScreenProps } from '../../types';

interface StakingTransaction {
  id: string;
  type: 'stake' | 'claim' | 'interest';
  amount: number;
  token: 'USDC' | 'USDT';
  apy: number;
  tier: string;
  status: 'Active' | 'Matured' | 'Claimed' | 'Pending';
  created_date: string;
  maturity_date?: string;
  accrued_interest: number;
  days_remaining?: number;
  transaction_hash?: string;
}

type FilterType = 'all' | 'active' | 'matured' | 'claimed';
type SortType = 'newest' | 'oldest' | 'amount';

interface StakingHistoryScreenProps extends ScreenProps {}

export const StakingHistoryScreen: React.FC<StakingHistoryScreenProps> = ({
  onBack,
  onNavigate
}) => {
  const { t } = useTranslation(['common', 'staking']);
  const { user } = useApp();
  const [transactions, setTransactions] = useState<StakingTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<StakingTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [sortType, setSortType] = useState<SortType>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - replace with API call
  const mockTransactions: StakingTransaction[] = [
    {
      id: 'stake_001',
      type: 'stake',
      amount: 50000,
      token: 'USDC',
      apy: 15,
      tier: 'VIP',
      status: 'Active',
      created_date: '2024-07-01',
      maturity_date: '2025-07-01',
      accrued_interest: 5625,
      days_remaining: 187,
      transaction_hash: '0x1234...5678'
    },
    {
      id: 'stake_002',
      type: 'stake',
      amount: 25500,
      token: 'USDT',
      apy: 15,
      tier: 'VIP',
      status: 'Active',
      created_date: '2024-06-15',
      maturity_date: '2025-06-15',
      accrued_interest: 2615,
      days_remaining: 203,
      transaction_hash: '0x5678...9012'
    },
    {
      id: 'stake_003',
      type: 'stake',
      amount: 10000,
      token: 'USDC',
      apy: 12,
      tier: 'PREMIUM',
      status: 'Matured',
      created_date: '2023-06-01',
      maturity_date: '2024-06-01',
      accrued_interest: 1200,
      transaction_hash: '0x9012...3456'
    },
    {
      id: 'claim_001',
      type: 'claim',
      amount: 11200,
      token: 'USDC',
      apy: 12,
      tier: 'PREMIUM',
      status: 'Claimed',
      created_date: '2024-06-05',
      accrued_interest: 1200,
      transaction_hash: '0x3456...7890'
    }
  ];

  // Fetch staking history
  const fetchStakingHistory = async () => {
    if (!user?.token) return;

    setLoading(true);
    setError(null);

    try {
      // Use the new staking API endpoint
      const response = await apiService.getStakingHistory(user.token, {
        status: selectedFilter === 'all' ? undefined : selectedFilter,
        sort: sortOrder,
        page: 1,
        limit: 50
      });
      
      setTransactions(response.history || []);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to fetch staking history:', err);
      setError(err.message || 'Failed to load staking history');
      setLoading(false);
    }
  };

  // Filter and sort transactions
  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.tier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.token.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterType !== 'all') {
      filtered = filtered.filter(tx => {
        switch (filterType) {
          case 'active': return tx.status === 'Active';
          case 'matured': return tx.status === 'Matured';
          case 'claimed': return tx.status === 'Claimed';
          default: return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortType) {
        case 'newest':
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
        case 'oldest':
          return new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
        case 'amount':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, sortType]);

  useEffect(() => {
    fetchStakingHistory();
  }, [user?.token]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <ClockIcon className="w-4 h-4 text-blue-400" />;
      case 'Matured':
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      case 'Claimed':
        return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
      default:
        return <XCircleIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-900 text-blue-300';
      case 'Matured': return 'bg-green-900 text-green-300';
      case 'Claimed': return 'bg-gray-900 text-gray-300';
      default: return 'bg-gray-800 text-gray-400';
    }
  };

  const handleExportHistory = async () => {
    try {
      // Convert transactions to CSV
      const csvData = filteredTransactions.map(tx => ({
        ID: tx.id,
        Type: tx.type.toUpperCase(),
        Amount: tx.amount,
        Token: tx.token,
        APY: `${tx.apy}%`,
        Tier: tx.tier,
        Status: tx.status,
        Created: tx.created_date,
        Maturity: tx.maturity_date || 'N/A',
        Interest: tx.accrued_interest,
        'Days Remaining': tx.days_remaining || 'N/A',
        'Transaction Hash': tx.transaction_hash || 'N/A'
      }));

      // Simple CSV generation
      const headers = Object.keys(csvData[0]);
      const csv = [
        headers.join(','),
        ...csvData.map(row => headers.map(header => row[header as keyof typeof row]).join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vonvault-staking-history-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <MobileLayoutWithTabs showTabs={true} currentScreen="staking-history">
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
      <MobileLayoutWithTabs showTabs={true} currentScreen="staking-history">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={fetchStakingHistory}
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
    <MobileLayoutWithTabs showTabs={true} currentScreen="staking-history">
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
            
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white">
                {t('staking:history.title', 'Staking History')}
              </h1>
              <p className="text-gray-400 text-sm">
                {t('staking:history.subtitle', 'Complete record of your staking investments')}
              </p>
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <FunnelIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('staking:history.search', 'Search by ID, tier, or token...')}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Filters (Expandable) */}
        {showFilters && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 space-y-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('staking:history.filter.status', 'Status Filter')}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['all', 'active', 'matured', 'claimed'] as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      filterType === filter
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    {t(`staking:history.filter.${filter}`, filter.charAt(0).toUpperCase() + filter.slice(1))}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('staking:history.sort.label', 'Sort By')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['newest', 'oldest', 'amount'] as SortType[]).map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortType(sort)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
                      sortType === sort
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                    style={{ minHeight: '44px' }}
                  >
                    <ArrowsUpDownIcon className="w-4 h-4 mr-1" />
                    {t(`staking:history.sort.${sort}`, sort.charAt(0).toUpperCase() + sort.slice(1))}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            {filteredTransactions.length} {t('staking:history.results', 'results')}
            {searchTerm && ` for "${searchTerm}"`}
            {filterType !== 'all' && ` (${filterType})`}
          </p>
          
          {filteredTransactions.length > 0 && (
            <button
              onClick={handleExportHistory}
              className="flex items-center text-purple-400 text-sm hover:text-purple-300 transition-colors"
            >
              <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
              {t('staking:history.export', 'Export History')}
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 text-center">
          <div className="bg-gray-800 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <CalendarIcon className="w-8 h-8 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {searchTerm || filterType !== 'all' 
              ? t('staking:history.noResults', 'No results found')
              : t('staking:history.empty.title', 'No Staking History')
            }
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterType !== 'all'
              ? t('staking:history.tryDifferent', 'Try different search terms or filters')
              : t('staking:history.empty.description', 'You haven\'t created any staking investments yet')
            }
          </p>
          {!searchTerm && filterType === 'all' && (
            <button 
              onClick={() => onNavigate?.('create-staking')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium"
              style={{ minHeight: '44px' }}
            >
              {t('staking:history.empty.action', 'Create Your First Stake')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 pb-6">
          {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="p-4">
                {/* Transaction Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-purple-600 bg-opacity-20 rounded-full p-2 mr-3">
                      <CurrencyDollarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">
                        ${transaction.amount.toLocaleString()} {transaction.token}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {transaction.tier} • {transaction.apy}% APY
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      <span className="ml-1">{transaction.status}</span>
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(transaction.created_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t('staking:history.details.created', 'Created')}
                    </p>
                    <p className="text-sm text-white">
                      {new Date(transaction.created_date).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {transaction.maturity_date && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {t('staking:history.details.matures', 'Matures')}
                      </p>
                      <p className="text-sm text-white">
                        {new Date(transaction.maturity_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {t('staking:history.details.earned', 'Earned')}
                    </p>
                    <p className="text-sm text-green-400 font-semibold">
                      +${transaction.accrued_interest.toLocaleString()}
                    </p>
                  </div>
                  
                  {transaction.days_remaining !== undefined && transaction.days_remaining > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {t('staking:history.details.remaining', 'Remaining')}
                      </p>
                      <p className="text-sm text-blue-400 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {transaction.days_remaining} {t('staking:dashboard.days', 'days')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Bar for Active Stakes */}
                {transaction.status === 'Active' && transaction.days_remaining !== undefined && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{t('staking:dashboard.progress', 'Progress')}</span>
                      <span>{Math.round(((365 - transaction.days_remaining) / 365) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((365 - transaction.days_remaining) / 365) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Transaction Hash */}
                {transaction.transaction_hash && (
                  <div className="border-t border-gray-800 pt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
                        <p className="text-xs text-gray-300 font-mono">
                          {transaction.transaction_hash}
                        </p>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(transaction.transaction_hash || '')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {transaction.status === 'Matured' && (
                  <div className="border-t border-gray-800 pt-3 mt-3">
                    <button 
                      onClick={() => {/* Handle claim */}}
                      className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                      style={{ minHeight: '44px' }}
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      {t('staking:dashboard.claim', 'Claim')} ${(transaction.amount + transaction.accrued_interest).toLocaleString()}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MobileLayoutWithTabs>
  );
};