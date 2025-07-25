import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { secureStorage } from '../utils/secureStorage';
import { FEATURES } from '../config/features';
import type { 
  Investment, 
  StakingInvestment, 
  StakingPortfolio, 
  StakingAnalytics 
} from '../types';

export interface UnifiedPortfolioData {
  // Investment data
  investments: Investment[];
  totalInvestments: number;
  totalInvestmentValue: number;
  
  // Staking data
  stakingInvestments: StakingInvestment[];
  totalStaked: number;
  totalEarned: number;
  currentTier: string;
  nextTier: string | null;
  tierProgress: number;
  
  // Combined totals
  totalPortfolioValue: number;
  totalROI: number;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

export const useUnifiedPortfolio = () => {
  const [data, setData] = useState<UnifiedPortfolioData>({
    investments: [],
    totalInvestments: 0,
    totalInvestmentValue: 0,
    stakingInvestments: [],
    totalStaked: 0,
    totalEarned: 0,
    currentTier: 'BASIC',
    nextTier: null,
    tierProgress: 0,
    totalPortfolioValue: 0,
    totalROI: 0,
    isLoading: true,
    error: null
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchUnifiedPortfolio = async () => {
    try {
      setData(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = secureStorage.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch both investment and staking data in parallel
      const promises = [
        apiService.getInvestments(token),
        FEATURES.STAKING_ENABLED ? apiService.getStakingPortfolio(token) : null
      ];

      const [investmentResponse, stakingResponse] = await Promise.all(promises);

      // Process investment data
      const investments = investmentResponse?.investments || [];
      const totalInvestments = investments.length;
      const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.amount, 0);

      // Process staking data
      let stakingData: StakingPortfolio = {
        total_staked: 0,
        total_earned: 0,
        active_stakes: 0,
        matured_stakes: 0,
        current_tier: 'BASIC',
        next_tier: null,
        tier_progress: 0,
        investments: []
      };

      if (stakingResponse && FEATURES.STAKING_ENABLED) {
        stakingData = stakingResponse;
      }

      // Calculate combined totals
      const totalPortfolioValue = totalInvestmentValue + stakingData.total_staked + stakingData.total_earned;
      const totalROI = totalPortfolioValue > 0 ? 
        ((stakingData.total_earned) / (totalInvestmentValue + stakingData.total_staked)) * 100 : 0;

      setData({
        investments,
        totalInvestments,
        totalInvestmentValue,
        stakingInvestments: stakingData.investments,
        totalStaked: stakingData.total_staked,
        totalEarned: stakingData.total_earned,
        currentTier: stakingData.current_tier,
        nextTier: stakingData.next_tier,
        tierProgress: stakingData.tier_progress,
        totalPortfolioValue,
        totalROI,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching unified portfolio:', error);
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch portfolio data'
      }));
    }
  };

  useEffect(() => {
    fetchUnifiedPortfolio();
  }, [refreshTrigger]);

  const refresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Helper functions
  const getPortfolioBreakdown = () => {
    if (data.totalPortfolioValue === 0) return [];
    
    const breakdown = [];
    
    if (data.totalInvestmentValue > 0) {
      breakdown.push({
        type: 'Traditional Investments',
        value: data.totalInvestmentValue,
        percentage: (data.totalInvestmentValue / data.totalPortfolioValue) * 100,
        color: '#8b5cf6'
      });
    }
    
    if (data.totalStaked > 0) {
      breakdown.push({
        type: 'Staking Principal',
        value: data.totalStaked,
        percentage: (data.totalStaked / data.totalPortfolioValue) * 100,
        color: '#06b6d4'
      });
    }
    
    if (data.totalEarned > 0) {
      breakdown.push({
        type: 'Staking Rewards',
        value: data.totalEarned,
        percentage: (data.totalEarned / data.totalPortfolioValue) * 100,
        color: '#22c55e'
      });
    }
    
    return breakdown;
  };

  const getPerformanceMetrics = () => {
    return {
      totalValue: data.totalPortfolioValue,
      totalROI: data.totalROI,
      activeInvestments: data.totalInvestments,
      activeStakes: data.stakingInvestments.filter(s => s.status === 'active').length,
      maturedStakes: data.stakingInvestments.filter(s => s.status === 'matured').length,
      currentTier: data.currentTier,
      nextTier: data.nextTier,
      tierProgress: data.tierProgress
    };
  };

  const getRecentActivity = () => {
    const activities = [];
    
    // Add investment activities
    data.investments.forEach(inv => {
      activities.push({
        id: inv.id,
        type: 'investment',
        action: 'Created',
        amount: inv.amount,
        date: inv.created_at,
        status: inv.status
      });
    });
    
    // Add staking activities
    data.stakingInvestments.forEach(stake => {
      activities.push({
        id: stake.id,
        type: 'staking',
        action: 'Staked',
        amount: stake.amount,
        date: stake.created_at,
        status: stake.status
      });
      
      if (stake.total_earned > 0) {
        activities.push({
          id: `${stake.id}_reward`,
          type: 'reward',
          action: 'Earned',
          amount: stake.total_earned,
          date: stake.updated_at,
          status: 'completed'
        });
      }
    });
    
    // Sort by date (most recent first)
    return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return {
    ...data,
    refresh,
    getPortfolioBreakdown,
    getPerformanceMetrics,
    getRecentActivity,
    
    // Utility functions
    formatCurrency: (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    },
    
    formatPercentage: (value: number, decimals: number = 2) => {
      return `${value.toFixed(decimals)}%`;
    }
  };
};