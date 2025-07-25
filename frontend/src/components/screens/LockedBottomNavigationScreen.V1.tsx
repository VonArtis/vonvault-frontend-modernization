import React, { useState } from 'react';

// Enhanced Bottom Navigation with Security Lock
const BottomTabs = ({ onNavigate, currentScreen, securityComplete = false }) => {
  const [showLockMessage, setShowLockMessage] = useState(false);
  
  const tabs = [
    {
      id: 'home',
      icon: '🏠',
      label: 'Home',
      screen: 'dashboard',
      requiresSecurity: true
    },
    {
      id: 'staking',
      icon: '🔒',
      label: 'Staking',
      screen: 'staking-dashboard',
      requiresSecurity: true
    },
    {
      id: 'wallets',
      icon: '💳',
      label: 'Wallets',
      screen: 'wallet-management',
      requiresSecurity: true
    },
    {
      id: 'portfolio',
      icon: '📊',
      label: 'Portfolio',
      screen: 'analytics',
      requiresSecurity: true
    },
    {
      id: 'profile',
      icon: '👤',
      label: 'Profile',
      screen: 'profile',
      requiresSecurity: false // Always accessible
    }
  ];

  const handleTabPress = (tab) => {
    // Check if tab is locked
    if (tab.requiresSecurity && !securityComplete) {
      // Show lock message
      setShowLockMessage(true);
      setTimeout(() => setShowLockMessage(false), 3000);
      return;
    }

    if (onNavigate) {
      onNavigate(tab.screen);
    }
  };

  const isActiveTab = (tab) => {
    if (currentScreen === tab.screen) {
      return true;
    }
    
    switch (tab.screen) {
      case 'dashboard':
        return ['dashboard', 'admin-dashboard'].includes(currentScreen || '');
      
      case 'staking-dashboard':
        return [
          'staking-dashboard', 
          'staking-flow-convert',
          'staking-completion',
          'staking-tiers',
          'staking-history', 
          'staking-analytics',
          'create-staking', 
          'investments', 
          'make-investment', 
          'investment-details', 
          'new-investment',
          'investment-completion',
          'admin-plans'
        ].includes(currentScreen || '');
      
      case 'wallet-management':
        return [
          'wallet-management',
          'connect-wallet',
          'crypto', 
          'connect-crypto', 
          'crypto-deposit',
          'test-wallet-connections'
        ].includes(currentScreen || '');

      case 'analytics':
        return [
          'analytics',
          'staking-analytics',
          'performance',
          'portfolio-overview'
        ].includes(currentScreen || '');
      
      case 'profile':
        return [
          'profile', 
          'profile-enhanced',
          'edit-profile',
          'membership-status',
          'verification', 
          'verification-success', 
          '2fa-setup', 
          '2fa-sms-setup',
          'create-ticket',
          'my-tickets',
          'security-hub',
          'security-onboarding-hub',
          'email-verification',
          'phone-verification',
          'sms-2fa-setup',
          'biometric-setup',
          'authenticator-setup',
          'fort-knox-encryption'
        ].includes(currentScreen || '');
      
      default:
        return false;
    }
  };

  const isTabLocked = (tab) => {
    return tab.requiresSecurity && !securityComplete;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => {
            const isActive = isActiveTab(tab);
            const isLocked = isTabLocked(tab);
            
            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab)}
                className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-all duration-200 relative ${
                  isLocked
                    ? 'text-gray-600 cursor-not-allowed'
                    : isActive
                    ? 'text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
                style={{ minHeight: '44px' }}
                disabled={isLocked}
              >
                <div className={`mb-1 transition-all duration-200 relative ${
                  isActive && !isLocked ? 'scale-110' : 'scale-100'
                }`}>
                  <span className={`text-2xl transition-all duration-200 ${
                    isLocked
                      ? 'text-gray-600'
                      : isActive 
                      ? 'text-purple-400' 
                      : 'text-gray-500'
                  }`}>
                    {tab.icon}
                  </span>
                  {isLocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-400">🔒</span>
                    </div>
                  )}
                </div>
                <div className={`text-xs font-medium transition-all duration-200 ${
                  isLocked
                    ? 'text-gray-600'
                    : isActive 
                    ? 'text-purple-400' 
                    : 'text-gray-500'
                }`}>
                  {tab.label}
                </div>
                {isActive && !isLocked && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-b-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lock Message Popup */}
      {showLockMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-50">
          <div className="bg-gray-900 border border-red-500/50 rounded-xl p-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-lg">🔒</span>
              </div>
              <div className="flex-1">
                <h4 className="text-red-400 font-medium text-sm">Security Setup Required</h4>
                <p className="text-red-300 text-xs">Complete your 6-layer security setup to unlock platform features</p>
              </div>
              <button
                onClick={() => setShowLockMessage(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Demo App Layout with Security States
const SecurityLockedNavDemo = () => {
  const [currentScreen, setCurrentScreen] = useState('profile');
  const [securityComplete, setSecurityComplete] = useState(false);
  const [completedLayers, setCompletedLayers] = useState(1); // Wallet connected

  // Screen content mapping
  const screenContent = {
    'dashboard': {
      title: 'VonVault Dashboard',
      subtitle: 'Welcome to your staking journey',
      icon: '🏠',
      content: 'Your main dashboard with portfolio overview, quick actions, and recent activity.'
    },
    'staking-dashboard': {
      title: 'Staking Dashboard',
      subtitle: 'Manage your active investments',
      icon: '🔒',
      content: 'View and manage all your active stakes, create new stakes, and track performance.'
    },
    'wallet-management': {
      title: 'Wallet Management',
      subtitle: 'Connect and manage your wallets',
      icon: '💳',
      content: 'Primary/Reserve wallet setup, connection management, and wallet switching.'
    },
    'analytics': {
      title: 'Portfolio Analytics',
      subtitle: 'Track your performance',
      icon: '📊',
      content: 'Comprehensive analytics, charts, and performance tracking for your portfolio.'
    },
    'profile': {
      title: 'Profile Settings',
      subtitle: 'Account and security setup',
      icon: '👤',
      content: 'User profile, security settings, tier status, and account management.'
    },
    'security-hub': {
      title: 'Security Hub',
      subtitle: 'Complete your security setup',
      icon: '🛡️',
      content: 'Progress through the mandatory 6-layer security setup to unlock platform access.'
    }
  };

  const current = screenContent[currentScreen] || screenContent['profile'];

  const handleCompleteLayer = () => {
    const newCompletedLayers = Math.min(completedLayers + 1, 6);
    setCompletedLayers(newCompletedLayers);
    
    if (newCompletedLayers >= 6) {
      setSecurityComplete(true);
    }
  };

  const handleResetSecurity = () => {
    setCompletedLayers(1);
    setSecurityComplete(false);
    setCurrentScreen('profile');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <span className="text-xl">←</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <svg width="32" height="32" viewBox="0 0 200 200" className="flex-shrink-0">
              <circle cx="100" cy="100" r="100" fill="#000000"/>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#8B5CF6" strokeWidth="8"/>
              <path d="M 65 65 L 100 135 L 135 65" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="16" 
                    strokeLinecap="square" 
                    strokeLinejoin="miter"/>
            </svg>
            <h1 className="text-xl font-bold text-white">{current.title}</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {securityComplete ? (
              <div className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                ✓ Unlocked
              </div>
            ) : (
              <div className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                🔒 Locked
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - with bottom padding for navigation */}
      <div className="px-6 py-6 pb-24 min-h-screen">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{current.icon}</div>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {current.title}
          </h2>
          <p className="text-gray-400 mb-6">{current.subtitle}</p>
        </div>

        {/* Security Status */}
        <div className={`rounded-xl p-6 border mb-6 ${
          securityComplete 
            ? 'bg-green-900/20 border-green-500/30' 
            : 'bg-red-900/20 border-red-500/30'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-semibold text-lg ${
                securityComplete ? 'text-green-400' : 'text-red-400'
              }`}>
                {securityComplete ? '🎉 Security Complete!' : '🔒 Security Setup Required'}
              </h3>
              <p className={`text-sm ${
                securityComplete ? 'text-green-300' : 'text-red-300'
              }`}>
                {securityComplete 
                  ? 'All platform features unlocked'
                  : `Complete ${6 - completedLayers} more security layers to unlock features`
                }
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                securityComplete ? 'text-green-400' : 'text-red-400'
              }`}>
                {completedLayers}/6
              </div>
              <div className={`text-xs ${
                securityComplete ? 'text-green-400' : 'text-red-400'
              }`}>
                Layers
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                securityComplete 
                  ? 'bg-gradient-to-r from-green-600 to-green-400'
                  : 'bg-gradient-to-r from-red-600 to-red-400'
              }`}
              style={{ width: `${(completedLayers / 6) * 100}%` }}
            ></div>
          </div>
          
          {/* Demo Controls */}
          <div className="flex space-x-3">
            {!securityComplete && (
              <button
                onClick={handleCompleteLayer}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all"
              >
                Complete Next Layer ({completedLayers + 1}/6)
              </button>
            )}
            <button
              onClick={handleResetSecurity}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-all"
            >
              Reset Demo
            </button>
            {currentScreen !== 'security-hub' && (
              <button
                onClick={() => setCurrentScreen('security-hub')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all"
              >
                Go to Security Hub
              </button>
            )}
          </div>
        </div>

        {/* Screen Content */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Screen Content</h3>
          <p className="text-gray-300">{current.content}</p>
          
          {!securityComplete && currentScreen !== 'profile' && currentScreen !== 'security-hub' && (
            <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">
                🔒 This feature is locked until security setup is complete
              </p>
            </div>
          )}
        </div>

        {/* Navigation Lock Status */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-purple-400 font-semibold mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Navigation Lock Demo
          </h4>
          <div className="space-y-2 text-sm">
            <p className="text-purple-200">
              <strong>Security Status:</strong> {securityComplete ? 'Complete ✅' : `${completedLayers}/6 layers complete`}
            </p>
            <p className="text-purple-200">
              <strong>Accessible Tabs:</strong> {securityComplete ? 'All tabs unlocked' : 'Profile only'}
            </p>
            <p className="text-purple-200">
              <strong>Locked Tabs:</strong> {securityComplete ? 'None' : 'Home, Staking, Wallets, Portfolio'}
            </p>
          </div>
        </div>

        {/* Tab Structure Reference */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Navigation Status</h3>
          <div className="space-y-3">
            {[
              { id: 'home', icon: '🏠', label: 'Home', screen: 'dashboard', requiresSecurity: true },
              { id: 'staking', icon: '🔒', label: 'Staking', screen: 'staking-dashboard', requiresSecurity: true },
              { id: 'wallets', icon: '💳', label: 'Wallets', screen: 'wallet-management', requiresSecurity: true },
              { id: 'portfolio', icon: '📊', label: 'Portfolio', screen: 'analytics', requiresSecurity: true },
              { id: 'profile', icon: '👤', label: 'Profile', screen: 'profile', requiresSecurity: false }
            ].map((tab, index) => {
              const isLocked = tab.requiresSecurity && !securityComplete;
              const isCurrentScreen = currentScreen === tab.screen;
              
              return (
                <div key={tab.id} className={`flex items-center justify-between p-3 rounded-lg ${
                  isCurrentScreen ? 'bg-purple-800/30' : 'bg-gray-800'
                }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-purple-400 font-medium">{index + 1}.</span>
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-white font-medium">{tab.label}</span>
                    {isCurrentScreen && (
                      <span className="text-purple-400 text-xs">← Current</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm font-mono">{tab.screen}</span>
                    {isLocked ? (
                      <span className="bg-red-600/20 text-red-400 px-2 py-1 rounded-full text-xs">
                        🔒 Locked
                      </span>
                    ) : (
                      <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded-full text-xs">
                        ✓ Available
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Navigation with Security Lock */}
      <BottomTabs 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen}
        securityComplete={securityComplete}
      />
    </div>
  );
};

export default SecurityLockedNavDemo;
