import React, { useState } from 'react';

interface SecurityOnboardingHubProps {
  onNavigate?: (screen: string) => void;
  onSecurityComplete?: () => void; // New callback for security completion
  userType?: 'web2' | 'web3';
  initialProgress?: {
    walletConnected?: boolean;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  };
}

const SecurityOnboardingHub: React.FC<SecurityOnboardingHubProps> = ({ 
  onNavigate, 
  userType = 'web3',
  initialProgress = {} 
}) => {
  // Determine initial layer completion based on user type and progress
  const getInitialUserProgress = () => {
    const baseProgress = {
      layer1: { completed: false }, // Wallet Authentication
      layer2: { completed: false }, // Email Verification  
      layer3: { completed: false }, // Phone Verification
      layer4: { completed: false }, // SMS 2FA Setup
      layer5: { completed: false }, // Biometric Security
      layer6: { completed: false }, // Authenticator Setup
      layer7: { completed: false }, // Fort Knox (optional)
      isWeb3User: userType === 'web3'
    };

    // Web3 users: Wallet is complete when they reach Security Hub
    if (userType === 'web3') {
      baseProgress.layer1 = { completed: true, completedAt: new Date().toISOString().split('T')[0] };
    }
    
    // Web2 users: Email and Phone may be complete from signup flow
    if (userType === 'web2') {
      if (initialProgress.emailVerified) {
        baseProgress.layer2 = { completed: true, completedAt: new Date().toISOString().split('T')[0] };
      }
      if (initialProgress.phoneVerified) {
        baseProgress.layer3 = { completed: true, completedAt: new Date().toISOString().split('T')[0] };
      }
      if (initialProgress.walletConnected) {
        baseProgress.layer1 = { completed: true, completedAt: new Date().toISOString().split('T')[0] };
      }
    }

    return baseProgress;
  };

  const [userProgress, setUserProgress] = useState(getInitialUserProgress());

  const [biometricLoading, setBiometricLoading] = useState(false);
  const [showBiometricSuccess, setShowBiometricSuccess] = useState(false);

  const completedLayers = Object.values(userProgress).filter((layer, index) => {
    // Exclude isWeb3User from the count (it's not a layer)
    const keys = Object.keys(userProgress);
    return keys[index] !== 'isWeb3User' && layer.completed;
  }).length;
  const requiredLayers = 6; // Layers 1-6 are mandatory

  const layers = [
    {
      id: 'layer1',
      number: 1,
      title: 'Wallet Authentication',
      description: 'Connect your crypto wallet',
      icon: '🔗',
      color: 'purple',
      gradient: 'from-purple-600/20 to-purple-500/10',
      border: 'border-purple-500/30',
      required: true,
      route: 'connect-wallet'
    },
    {
      id: 'layer2',
      number: 2,
      title: 'Email Verification',
      description: 'Secure account recovery',
      icon: '📧',
      color: 'blue',
      gradient: 'from-blue-600/20 to-blue-500/10',
      border: 'border-blue-500/30',
      required: true,
      route: 'email-verification'
    },
    {
      id: 'layer3',
      number: 3,
      title: 'Phone Verification',
      description: 'SMS security & alerts',
      icon: '📱',
      color: 'green',
      gradient: 'from-green-600/20 to-green-500/10',
      border: 'border-green-500/30',
      required: true,
      route: 'phone-verification'
    },
    {
      id: 'layer4',
      number: 4,
      title: 'SMS 2FA Setup',
      description: 'Backup authentication method',
      icon: '💬',
      color: 'blue',
      gradient: 'from-blue-600/20 to-blue-500/10',
      border: 'border-blue-500/30',
      required: true,
      route: 'sms-2fa-setup'
    },
    {
      id: 'layer5',
      number: 5,
      title: 'Biometric Security',
      description: 'Face ID / Fingerprint authentication',
      icon: '👤',
      color: 'cyan',
      gradient: 'from-cyan-600/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      required: true,
      route: 'profile-settings'
    },
    {
      id: 'layer6',
      number: 6,
      title: 'Authenticator Setup',
      description: 'Hardware-grade security for transactions',
      icon: '🔐',
      color: 'orange',
      gradient: 'from-orange-600/20 to-orange-500/10',
      border: 'border-orange-500/30',
      required: true,
      route: 'authenticator-setup'
    },
    {
      id: 'layer7',
      number: 7,
      title: 'Fort Knox Encryption',
      description: 'Client-side data encryption (Optional)',
      icon: '🏰',
      color: 'amber',
      gradient: 'from-amber-600/20 to-amber-500/10',
      border: 'border-amber-500/30',
      required: false,
      route: 'fort-knox-encryption',
      web3Only: true
    }
  ];

  const getNextIncompleteLayer = () => {
    for (let i = 1; i <= 6; i++) {
      if (!userProgress[`layer${i}`]?.completed) {
        return layers.find(layer => layer.number === i);
      }
    }
    return null;
  };

  const nextLayer = getNextIncompleteLayer();

  const canAccessLayer = (layer) => {
    // Layer 1 is always accessible (wallet connection)
    if (layer.number === 1) return true;
    
    // For other layers, all previous layers must be complete
    for (let i = 1; i < layer.number; i++) {
      if (!userProgress[`layer${i}`]?.completed) {
        return false;
      }
    }
    return true;
  };

  const getStatusBadge = (layer) => {
    const isCompleted = userProgress[layer.id]?.completed;
    const canAccess = canAccessLayer(layer);
    const isAvailable = !layer.web3Only || userProgress.isWeb3User;

    if (!isAvailable) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-gray-700/50 text-gray-400 rounded-full">
          Web3 Exclusive
        </span>
      );
    }

    if (isCompleted) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-green-600/30 text-green-300 rounded-full">
          ✓ Complete
        </span>
      );
    }

    if (!canAccess) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-gray-600/30 text-gray-400 rounded-full">
          Locked
        </span>
      );
    }

    if (layer.required) {
      return (
        <span className="px-3 py-1 text-xs font-medium bg-red-600/30 text-red-300 rounded-full">
          Required
        </span>
      );
    }

    return (
      <span className="px-3 py-1 text-xs font-medium bg-blue-600/30 text-blue-300 rounded-full">
        Optional
      </span>
    );
  };

  const handleBiometricEnable = async () => {
    setBiometricLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserProgress(prev => ({
        ...prev,
        layer5: { completed: true, completedAt: new Date().toISOString() }
      }));
      
      setShowBiometricSuccess(true);
      setTimeout(() => setShowBiometricSuccess(false), 3000);
      
    } catch (error) {
      console.error('Biometric setup failed:', error);
    } finally {
      setBiometricLoading(false);
    }
  };

  const getActionButton = (layer) => {
    const isCompleted = userProgress[layer.id]?.completed;
    const canAccess = canAccessLayer(layer);
    const isAvailable = !layer.web3Only || userProgress.isWeb3User;

    if (!isAvailable) {
      return (
        <button
          disabled
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-700/30 text-gray-500 cursor-not-allowed"
        >
          Web3 Only Feature
        </button>
      );
    }

    if (isCompleted) {
      return (
        <button
          onClick={() => layer.id === 'layer5' ? handleBiometricEnable() : onNavigate?.(layer.route)}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-700/50 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {layer.id === 'layer5' ? 'Re-authenticate' : 'Review Settings'}
        </button>
      );
    }

    if (!canAccess) {
      return (
        <button
          disabled
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-gray-700/30 text-gray-500 cursor-not-allowed"
        >
          Complete Previous Layers First
        </button>
      );
    }

    // Special handling for Layer 5 (Biometrics)
    if (layer.id === 'layer5') {
      return (
        <button
          onClick={handleBiometricEnable}
          disabled={biometricLoading}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {biometricLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Enabling...</span>
            </div>
          ) : (
            'Enable Biometrics'
          )}
        </button>
      );
    }

    return (
      <button
        onClick={() => onNavigate?.(layer.route)}
        className="w-full py-2 px-4 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      >
        {layer.number === nextLayer?.number ? 'Continue Setup' : 'Complete Layer'}
      </button>
    );
  };

  const isSetupComplete = completedLayers >= requiredLayers;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="w-11"></div>
          
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
            <h1 className="text-xl font-bold text-white">Security Setup</h1>
          </div>
          
          <div className="w-11"></div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-700/50 rounded-xl p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Wallet Connected!</h2>
            <p className="text-purple-300 mb-4">
              Complete your 6-layer security setup to unlock full platform access
            </p>
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
              <p className="text-blue-300 text-sm font-medium">
                💡 Your wallet secures transactions, our layers secure your account
              </p>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-purple-900/30 to-amber-900/20 border border-purple-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Setup Progress</h2>
              <p className="text-purple-300 text-sm">
                {isSetupComplete ? 'Setup Complete! 🎉' : `${requiredLayers - completedLayers} layers remaining`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-400 mb-1">
                {completedLayers}/{requiredLayers}
              </div>
              <div className="text-sm text-purple-300">Required</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-purple-600 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedLayers / requiredLayers) * 100}%` }}
            ></div>
          </div>
          
          {!isSetupComplete && nextLayer && (
            <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{nextLayer.icon}</span>
                <div>
                  <p className="text-purple-300 font-medium text-sm">Next: {nextLayer.title}</p>
                  <p className="text-purple-400 text-xs">{nextLayer.description}</p>
                </div>
                <button
                  onClick={() => onNavigate?.(nextLayer.route)}
                  className="ml-auto bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {isSetupComplete && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-300 font-medium mb-2">🏆 Security Setup Complete!</p>
              <button
                onClick={() => onNavigate?.('staking-dashboard')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Enter VonVault Platform
              </button>
            </div>
          )}
        </div>

        {/* Required Layers (1-6) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Required Security Layers</h3>
          
          {layers.slice(0, 6).map((layer) => {
            const isCompleted = userProgress[layer.id]?.completed;
            const canAccess = canAccessLayer(layer);
            
            return (
              <div 
                key={layer.id}
                className={`bg-gradient-to-r ${layer.gradient} border ${layer.border} rounded-xl p-5 ${
                  !canAccess && !isCompleted ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full">
                      <span className="text-2xl">{layer.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h4 className="text-white font-semibold">
                          Layer {layer.number}: {layer.title}
                        </h4>
                        {isCompleted && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{layer.description}</p>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(layer)}
                        {!canAccess && !isCompleted && (
                          <span className="text-xs text-gray-400">
                            Complete previous layers to unlock
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    {getActionButton(layer)}
                  </div>
                  {isCompleted && userProgress[layer.id]?.completedAt && (
                    <div className="text-xs text-gray-400">
                      ✓ {new Date(userProgress[layer.id].completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Layer 7 */}
        {userProgress.isWeb3User && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Optional Premium Layer</h3>
            
            {layers.slice(6).map((layer) => {
              const isCompleted = userProgress[layer.id]?.completed;
              const canAccess = isSetupComplete; // Can only access Layer 7 after completing 1-6
              
              return (
                <div 
                  key={layer.id}
                  className={`bg-gradient-to-r ${layer.gradient} border ${layer.border} rounded-xl p-5 ${
                    !canAccess ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gray-900 rounded-full">
                        <span className="text-2xl">{layer.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-white font-semibold">
                            Layer {layer.number}: {layer.title}
                          </h4>
                          {isCompleted && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{layer.description}</p>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(layer)}
                          <span className="text-xs text-amber-400">
                            Elite feature • Only 8% of users
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <button
                        onClick={() => canAccess ? onNavigate?.(layer.route) : null}
                        disabled={!canAccess}
                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                          canAccess 
                            ? 'bg-amber-600 text-white hover:bg-amber-700' 
                            : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canAccess ? 'Unlock Elite Security' : 'Complete Required Layers First'}
                      </button>
                    </div>
                    {isCompleted && userProgress[layer.id]?.completedAt && (
                      <div className="text-xs text-gray-400">
                        ✓ {new Date(userProgress[layer.id].completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Security Benefits */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-6">
          <h4 className="text-blue-400 font-semibold mb-3 flex items-center">
            <span className="mr-2">🛡️</span>
            Why 6 Layers of Security?
          </h4>
          <div className="space-y-3 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">•</span>
              <span>Each layer protects against different attack vectors</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">•</span>
              <span>Redundant security prevents single points of failure</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">•</span>
              <span>Your crypto assets deserve bank-grade protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">•</span>
              <span>Complete setup unlocks full platform features</span>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Success Popup */}
      {showBiometricSuccess && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-full p-8 mx-auto mb-6 animate-pulse">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Biometric Security Enabled!</h2>
            <p className="text-gray-300 mb-4">Face ID / Fingerprint authentication activated</p>
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-3">
              <p className="text-cyan-400 text-sm font-medium mb-1">🛡️ Layer 5 of 6 Complete</p>
              <p className="text-cyan-300 text-xs">Advanced biometric security unlocked</p>
            </div>
          </div>
        </div>
      )}

      {/* Locked Bottom Navigation - Shows locked tabs during security onboarding */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-40">
        <div className="flex items-center justify-around h-16 px-4">
          {[
            { id: 'dashboard', label: 'Home', icon: '🏠', screen: 'dashboard' },
            { id: 'staking', label: 'Staking', icon: '💎', screen: 'staking-dashboard' },
            { id: 'wallets', label: 'Wallets', icon: '💳', screen: 'wallet-management' },
            { id: 'analytics', label: 'Portfolio', icon: '📊', screen: 'analytics' },
            { id: 'profile', label: 'Profile', icon: '👤', screen: 'profile' }
          ].map(tab => {
            const isLocked = tab.id !== 'profile'; // Only Profile accessible during onboarding
            const isActive = tab.id === 'profile'; // Profile is active on this screen
            
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isLocked) {
                    // Show lock message for locked tabs
                    console.log('Tab locked - security setup required');
                  } else {
                    onNavigate?.(tab.screen);
                  }
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 relative ${
                  isLocked
                    ? 'text-gray-600 cursor-not-allowed'
                    : isActive
                    ? 'text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
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
    </div>
  );
};

export default SecurityOnboardingHub;
