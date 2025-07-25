import React from 'react';
import { 
  HomeIcon,
  LockClosedIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

interface BottomTabsProps {
  onNavigate?: (screen: string) => void;
  currentScreen?: string;
}

export const BottomTabs: React.FC<BottomTabsProps> = ({ onNavigate, currentScreen }) => {
  const tabs = [
    {
      id: 'home',
      icon: HomeIcon,
      label: 'Home',
      screen: 'dashboard'
    },
    {
      id: 'staking',
      icon: LockClosedIcon,
      label: 'Staking',
      screen: 'staking-dashboard'
    },
    {
      id: 'wallets',
      icon: CreditCardIcon,
      label: 'Wallets',
      screen: 'wallet-management'  // Updated to new wallet management screen
    },
    {
      id: 'portfolio',
      icon: ChartBarIcon,
      label: 'Portfolio',
      screen: 'analytics'  // Routes to your StakingAnalyticsScreen
    },
    {
      id: 'profile',
      icon: UserIcon,
      label: 'Profile',
      screen: 'profile'
    }
  ];

  const handleTabPress = (tab: typeof tabs[0]) => {
    if (onNavigate) {
      onNavigate(tab.screen);
    }
  };

  const isActiveTab = (tab: typeof tabs[0]) => {
    // Handle exact screen matches and related screen mappings
    if (currentScreen === tab.screen) {
      return true;
    }
    
    // Handle related screen mappings for complex navigation flows
    switch (tab.screen) {
      case 'dashboard':
        // Dashboard tab active for home-related screens
        return ['dashboard', 'admin-dashboard'].includes(currentScreen || '');
      
      case 'staking-dashboard':
        // Staking tab active for all staking-related screens  
        return [
          'staking-dashboard', 
          'create-staking', 
          'staking-completion',
          'staking-tiers',
          'staking-history',
          // Legacy investment screens during transition
          'investments', 
          'make-investment', 
          'investment-details', 
          'new-investment',
          'investment-completion',
          'admin-plans'
        ].includes(currentScreen || '');
      
      case 'wallet-management':
        // Wallets tab active for all wallet-related screens
        return [
          'wallet-management',
          'connect-wallet',
          'crypto', 
          'connect-crypto', 
          'crypto-deposit',
          'test-wallet-connections'
        ].includes(currentScreen || '');

      case 'analytics':
        // Portfolio tab active for analytics and performance screens
        return [
          'analytics',
          'staking-analytics',
          'performance',
          'portfolio-overview'
        ].includes(currentScreen || '');
      
      case 'profile':
        // Profile tab active for user-related screens
        return [
          'profile', 
          'edit-profile',
          'membership-status',
          'verification', 
          'verification-success', 
          '2fa-setup', 
          '2fa-sms-setup',
          'create-ticket',
          'my-tickets'
        ].includes(currentScreen || '');
      
      default:
        return false;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = isActiveTab(tab);
          const IconComponent = tab.icon;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabPress(tab)}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all duration-200 ${
                isActive
                  ? 'text-purple-400'  // VonVault purple branding
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={{ minHeight: '44px' }}  // Ensure proper touch targets
            >
              <div className={`mb-1 transition-all duration-200 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <IconComponent 
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive 
                      ? 'text-purple-400 stroke-2' 
                      : 'text-gray-500 stroke-1.5'
                  }`} 
                />
              </div>
              <div className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'text-purple-400' : 'text-gray-500'
              }`}>
                {tab.label}
              </div>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-b-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
