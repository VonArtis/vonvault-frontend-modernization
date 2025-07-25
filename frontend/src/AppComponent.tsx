import React, { useState, useEffect } from 'react';
import type { ScreenType, User } from './types';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { notificationService } from './services/NotificationService';
import { biometricAuthService } from './services/BiometricAuthService';
import { useApp } from './context/AppContext';
import { useAuth } from './hooks/useAuth';
import { MobileLayoutWithTabs } from './components/layout/MobileLayoutWithTabs';

// Screen imports - NEW MODERNIZED SCREENS
import WelcomeScreen from './components/screens/WelcomeScreen.V10';
import LoginScreen from './components/screens/LoginScreen.V4';
import SignUpScreen from './components/screens/SignUpScreen.V2';
import SignUpOptionsScreen from './components/screens/SignUpOptionsScreen.V1';
import ConnectCryptoScreen from './components/screens/ConnectCryptoWalletScreen.V6';
import EmailVerificationScreen from './components/screens/EmailVerificationScreen.V4';
import SMSVerificationScreen from './components/screens/SmsVerificationScreen.V4';
import SMS2FASetupScreen from './components/screens/SMS2FASetupScreen.V2';
import BiometricSetupScreen from './components/screens/ProfileScreenEnhancedBiometrics.V6';
import AuthenticatorSetupScreen from './components/screens/AuthenticatorSetupScreen.V9';
import FortKnoxSetupScreen from './components/screens/FortKnoxLayer7SecurityScreen';
import CreateStakingScreen from './components/screens/CreateStakingScreen.V24';
import WalletManagementScreen from './components/screens/WalletManagementScreen.V7';
import StakingAnalyticsScreen from './components/screens/StakingAnalyticsScreen.V24';
import StakingHistoryScreen from './components/screens/StakingHistoryScreen.V17';
import StakingTiersScreen from './components/screens/StakingTiersScreen.V6';
import StakingFlowConvertScreen from './components/screens/StakingFlowConvertScreen.V3';
import StakingCompletionScreen from './components/screens/StakingCompletionScreen.V3';
import SecurityHubScreen from './components/screens/SecurityOnboardingScreen';
import StakingDashboardScreen from './components/screens/StakingDashboardScreen.V28';
import ProfileScreen from './components/screens/ProfileScreen.V42';
import { AdminPlansScreen } from './components/screens/AdminPlansScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { AdminStakingScreen } from './components/screens/AdminStakingScreen';
import { AdminUsersScreen } from './components/screens/AdminUsersScreen';
import { AdminUserDetailsScreen } from './components/screens/AdminUserDetailsScreen';
import { AdminCryptoScreen } from './components/screens/AdminCryptoScreen';
import { PrivacyPolicyScreen } from './components/screens/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './components/screens/TermsOfServiceScreen';
import UiCatalogScreen from './components/screens/UiCatalogScreen';

import './App.css';

const AppRouter: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [userDetailsParams, setUserDetailsParams] = useState<any>(null);
  const [securityProgress, setSecurityProgress] = useState({
    completedLayers: 0,
    isComplete: false
  });
  const [userJourney, setUserJourney] = useState({
    userType: 'web3' as 'web2' | 'web3',
    signupMethod: null as string | null,
    verificationProgress: {
      emailVerified: false,
      phoneVerified: false,
      walletConnected: false
    }
  });
  const { user: contextUser } = useApp(); // Access user from context for debugging

  // Initialize security services on app startup
  useEffect(() => {
    const initializeSecurityServices = async () => {
      try {
        console.log('Initializing security services...');
        
        // Initialize notification service
        await notificationService.init();
        console.log('Notification service initialized');
        
        // Initialize biometric service
        await biometricAuthService.init();
        console.log('Biometric service initialized');
        
        // Check for existing login and require biometric if enabled
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const status = biometricAuthService.getStatus();
          if (status.isEnabled && status.isSetup) {
            try {
              console.log('Requiring biometric authentication for app access...');
              await biometricAuthService.authenticateBiometric();
              console.log('Biometric authentication successful');
            } catch (error) {
              console.error('Biometric authentication failed:', error);
              // Fallback to login screen
              setScreen('login');
              return;
            }
          }
          // If user exists and biometric passed (or not required), go to dashboard
          setScreen('dashboard');
        }
      } catch (error) {
        console.error('Failed to initialize security services:', error);
      }
    };

    initializeSecurityServices();
  }, []);

  // Update document title based on current screen
  useEffect(() => {
    const titles = {
      'welcome': 'VonVault - DeFi Investment Platform',
      'signup': 'Sign Up - VonVault',
      'login': 'Sign In - VonVault', 
      'email-verification': 'Verify Email - VonVault',
      'sms-verification': 'Verify Phone - VonVault',
      '2fa-setup': 'Setup 2FA - VonVault',
      '2fa-authenticator-setup': 'Setup Authenticator - VonVault',
      'enhanced-2fa-setup': 'Enhanced 2FA Setup - VonVault',
      '2fa-sms-setup': 'Setup SMS 2FA - VonVault',
      'verification-success': 'Verification Complete - VonVault',
      'dashboard': 'Dashboard - VonVault',
      'profile': 'Profile - VonVault',
      'connect-bank': 'Connect Bank - VonVault',
      'connect-crypto': 'Connect Wallet - VonVault',
      'investments': 'Investments - VonVault',
      'crypto-wallet': 'Crypto Wallet - VonVault',
      'crypto-deposit': 'Crypto Deposit - VonVault',
      'wallet-manager': 'Wallet Manager - VonVault',
      'available-funds': 'Available Funds - VonVault',
      'membership-status': 'Membership - VonVault',
      'admin-plans': 'Investment Plans - VonVault',
      'admin-dashboard': 'Admin Dashboard - VonVault',
      'admin-users': 'User Management - VonVault',
      'admin-user-details': 'User Details - VonVault',
      'admin-investments': 'Investment Analytics - VonVault',
      'admin-crypto': 'Crypto Analytics - VonVault',
      'privacy-policy': 'Privacy Policy - VonVault',
      'terms-of-service': 'Terms of Service - VonVault',
      'edit-profile': 'Edit Profile - VonVault'
    };
    
    document.title = titles[screen] || 'VonVault - DeFi Investment Platform';
  }, [screen]);
  const { authenticateBank, authenticateCrypto } = useAuth();

  // Helper function to check if user is a hardcoded admin
  const isAdminUser = (email: string): boolean => {
    const adminEmails = ['admin@vonartis.com', 'security@vonartis.com'];
    return adminEmails.includes(email);
  };

  // Type-safe navigation helper
  const navigateToScreen = (screen: string) => {
    setScreen(screen as ScreenType);
  };

  // Handle successful authentication - differentiate between signup and login
  const handleSignup = (userData: User) => {
    // Save user data for verification tracking
    localStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('Signup completed, user data saved:', userData);
    console.log('Context user after signup:', contextUser);
    
    // Track that this is a Web2.0 user journey
    setUserJourney(prev => ({
      ...prev,
      userType: 'web2',
      signupMethod: 'email-password'
    }));
    
    // IMPORTANT: Also update the AppContext user state immediately
    // This ensures user data is available in profile screen even if verification is skipped
    console.log('Setting user data in context after signup:', userData);
    
    // Trigger account creation notification
    notificationService.notifyAccountVerification('pending');
    
    // Admin bypass - Skip verification for hardcoded admins
    if (isAdminUser(userData.email || '')) {
      console.log('Admin user detected during signup, bypassing verification');
      setScreen('dashboard');
      return;
    }
    
    // New enhanced flow: User can choose verification path
    // Since user is now authenticated immediately, they can access dashboard
    // Default to verification flow but allow skipping
    setScreen('email-verification');
  };

  const handleSkipVerification = () => {
    // User chooses to skip verification and go directly to dashboard
    console.log('User skipped verification flow');
    console.log('Context user state:', contextUser);
    
    // Ensure user data is still available in context
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        console.log('User data available after skip:', userData);
      } catch (error) {
        console.error('Error parsing user data after skip:', error);
      }
    } else {
      console.warn('No user data found in localStorage after skip');
    }
    
    setScreen('dashboard');
  };

  const handleLogin = (userData: User) => {
    // Save user data for verification tracking
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Trigger login notification
    notificationService.notifyLoginAttempt('Current Location', 'This Device');
    
    // Admin bypass - Skip verification for hardcoded admins
    if (isAdminUser(userData.email || '')) {
      console.log('Admin user detected, bypassing verification');
      setScreen('dashboard');
      return;
    }
    
    // Check if user is already verified (stored in localStorage for demo)
    const verificationStatus = localStorage.getItem(`verification_${userData.email}`);
    
    if (verificationStatus === 'completed') {
      // User is already verified, go directly to dashboard
      setScreen('dashboard');
    } else {
      // User not verified yet, send through verification flow
      setScreen('email-verification');
    }
  };

  // Handle successful authentication - differentiate between signup and login
  const handleVerificationComplete = () => {
    // Mark verification as completed for this user
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        localStorage.setItem(`verification_${userData.email}`, 'completed');
        
        // Notify successful verification
        notificationService.notifyAccountVerification('approved');
        
        console.log('Verification marked as completed for user:', userData.email);
        console.log('User data available after verification:', userData);
      } catch (error) {
        console.error('Error parsing user data during verification completion:', error);
      }
    } else {
      console.warn('No user data found in localStorage during verification');
    }
    
    setScreen('dashboard');
  };

  // Helper function to handle navigation with proper typing
  const handleNavigation = (screen: string) => {
    setScreen(screen as ScreenType);
  };

  // Helper function for onNavigate callbacks
  const handleNavigateCallback = (screen: string) => {
    setScreen(screen as ScreenType);
  };

  // Handle bank connection
  const handleBankConnect = async () => {
    try {
      // Require biometric authentication for financial connections
      const biometricRequired = await biometricAuthService.requireBiometricForOperation('bank-connection');
      if (!biometricRequired) {
        alert('Biometric authentication required for bank connections');
        return;
      }
      
      await authenticateBank();
      
      // Notify successful connection
      await notificationService.notifyTransaction('deposit', 0, 'Bank Connected');
      
      setScreen('verification-success');
    } catch (error) {
      console.error('Bank connection failed:', error);
    }
  };

  // Handle crypto connection
  const handleCryptoConnect = async () => {
    try {
      // Require biometric authentication for crypto wallet connections
      const biometricRequired = await biometricAuthService.requireBiometricForOperation('crypto-connection');
      if (!biometricRequired) {
        alert('Biometric authentication required for crypto wallet connections');
        return;
      }
      
      await authenticateCrypto();
      
      // Track that this is a Web3.0 user journey with wallet connected
      setUserJourney(prev => ({
        ...prev,
        userType: 'web3',
        signupMethod: 'wallet-connect',
        verificationProgress: {
          ...prev.verificationProgress,
          walletConnected: true
        }
      }));
      
      // Notify successful crypto connection
      await notificationService.notifyTransaction('trade', 0, 'Crypto Wallet Connected');
      
      // Web3.0 users go directly to Security Hub after wallet connection
      setScreen('security-hub');
    } catch (error) {
      console.error('Crypto connection failed:', error);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onSignIn={() => setScreen('connect-crypto')} 
            onCreateAccount={() => setScreen('signup-options')} 
            onNavigate={handleNavigateCallback}
          />
        );
      case 'signup-options':
        return (
          <SignUpOptionsScreen 
            onBack={() => setScreen('welcome')}
            onConnectWallet={() => setScreen('connect-crypto')}
            onEmailSignUp={() => setScreen('signup')}
            onSignIn={() => setScreen('login')}
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onLogin={handleLogin}
            onCreateAccount={() => setScreen('signup')}
            onBack={() => setScreen('welcome')}
          />
        );
      case 'signup':
        return (
          <SignUpScreen 
            onBack={() => setScreen('signup-options')}
            onSignUp={handleSignup}
            onGoToLogin={() => setScreen('login')}
          />
        );
      case 'sms-verification':
        return (
          <SMSVerificationScreen 
            onBack={() => setScreen('email-verification')}
            onNavigate={(screen) => {
              if (screen === 'verification-success') {
                setScreen('2fa-setup'); // Go to 2FA setup instead
              } else {
                setScreen(screen);
              }
            }}
          />
        );
      case '2fa-setup':
        return (
          <SMS2FASetupScreen 
            onBack={() => setScreen('sms-verification')}
            onNavigate={navigateToScreen}
          />
        );
      case '2fa-authenticator-setup':
        return (
          <AuthenticatorSetupScreen 
            onBack={() => setScreen('2fa-setup')}
            onNavigate={navigateToScreen}
          />
        );
      case 'enhanced-2fa-setup':
        return (
          <BiometricSetupScreen 
            onNavigate={navigateToScreen}
          />
        );
      case '2fa-sms-setup':
        return (
          <SMS2FASetupScreen 
            onBack={() => setScreen('2fa-setup')}
            onNavigate={navigateToScreen}
          />
        );
      case 'verification-success':
        return (
          <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Verification Complete!</h2>
              <button
                onClick={() => {
                  handleVerificationComplete();
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg"
              >
                Continue to Dashboard
              </button>
            </div>
          </div>
        );
      case 'connect-bank':
        return (
          <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Connect Bank Account</h2>
              <button
                onClick={handleBankConnect}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg mr-4"
              >
                Connect Bank
              </button>
              <button
                onClick={() => setScreen('dashboard')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg"
              >
                Skip
              </button>
            </div>
          </div>
        );
      case 'connect-crypto':
        return (
          <ConnectCryptoScreen 
            onBack={() => setScreen('welcome')} // Go back to welcome for both flows
            onNavigate={handleNavigateCallback}
            onConnect={handleCryptoConnect} 
          />
        );
      case 'security-hub':
        return (
          <SecurityHubScreen 
            onNavigate={navigateToScreen}
            onSecurityComplete={() => setSecurityProgress({
              completedLayers: 6,
              isComplete: true
            })}
            userType={userJourney.userType}
            initialProgress={userJourney.verificationProgress}
          />
        );
      case 'email-verification':
        return (
          <EmailVerificationScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
          />
        );
      case 'phone-verification':
        return (
          <SMSVerificationScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
          />
        );
      case 'sms-2fa-setup':
        return (
          <SMS2FASetupScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
          />
        );
      case 'biometric-setup':
        return (
          <BiometricSetupScreen 
            onNavigate={navigateToScreen}
          />
        );
      case 'authenticator-setup':
        return (
          <AuthenticatorSetupScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
          />
        );
      case 'fort-knox-setup':
        return (
          <FortKnoxSetupScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
          />
        );
      case 'security-progress':
        return (
          <SecurityHubScreen 
            onNavigate={handleNavigateCallback}
            userType={userJourney.userType}
            initialProgress={userJourney.verificationProgress}
          />
        );
      case 'staking-dashboard':
        return (
          <StakingDashboardScreen 
            onNavigate={handleNavigateCallback} 
          />
        );
      case 'staking-flow-convert':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="staking-flow-convert"
            showTabs={true}
            securityComplete={securityProgress.isComplete}
          >
            <StakingFlowConvertScreen 
              onNavigate={navigateToScreen} 
            />
          </MobileLayoutWithTabs>
        );
      case 'staking-completion':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="staking-completion"
            showTabs={true}
            securityComplete={securityProgress.isComplete}
          >
            <StakingCompletionScreen />
          </MobileLayoutWithTabs>
        );
      case 'staking-history':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="staking-history"
            showTabs={true}
            securityComplete={securityProgress.isComplete}
          >
            <StakingHistoryScreen />
          </MobileLayoutWithTabs>
        );
      case 'staking-analytics':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="staking-analytics"
            showTabs={true}
            securityComplete={securityProgress.isComplete}
          >
            <StakingAnalyticsScreen 
              onBack={() => setScreen('dashboard')}
              onNavigate={navigateToScreen}
            />
          </MobileLayoutWithTabs>
        );
      case 'profile-settings':
        return (
          <BiometricSetupScreen 
            onNavigate={navigateToScreen}
          />
        );
      case 'fort-knox-encryption':
        return (
          <FortKnoxSetupScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
          />
        );
      case 'connect-wallet':
        return (
          <ConnectCryptoScreen 
            onBack={() => setScreen('security-hub')}
            onNavigate={navigateToScreen}
            onConnect={handleCryptoConnect} 
          />
        );
      case 'dashboard':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="dashboard"
            showTabs={true}
            securityComplete={securityProgress.isComplete}
          >
            <StakingDashboardScreen 
              onNavigate={navigateToScreen} 
            />
          </MobileLayoutWithTabs>
        );
      // Add direct access to connect-crypto for testing
      case 'test-wallet-connections':
        return (
          <ConnectCryptoScreen 
            onBack={() => setScreen('dashboard')}
            onConnect={handleCryptoConnect} 
          />
        );
      case 'investments':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="investments"
            showTabs={true}
          >
            <StakingDashboardScreen 
              onNavigate={navigateToScreen} 
            />
          </MobileLayoutWithTabs>
        );
      case 'new-investment':
        return (
          <CreateStakingScreen 
            onBack={() => setScreen('investments')}
            onNavigate={navigateToScreen}
          />
        );
      case 'crypto':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="crypto"
            showTabs={true}
          >
            <ConnectCryptoScreen 
              onBack={() => setScreen('dashboard')}
              onNavigate={navigateToScreen}
              onConnect={handleCryptoConnect}
            />
          </MobileLayoutWithTabs>
        );
      case 'crypto-deposit':
        return (
          <CreateStakingScreen 
            onBack={() => setScreen('crypto')}
            onNavigate={navigateToScreen}
          />
        );
      case 'wallet-manager':
        return (
          <WalletManagementScreen 
            onBack={() => setScreen('crypto')}
            onNavigate={navigateToScreen}
          />
        );
      case 'funds':
        return (
          <StakingAnalyticsScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={navigateToScreen}
          />
        );
      case 'profile':
        return (
          <MobileLayoutWithTabs 
            onNavigate={handleNavigation} 
            currentScreen="profile"
            showTabs={true}
          >
            <ProfileScreen 
              onBack={() => setScreen('dashboard')}
              onNavigate={navigateToScreen}
            />
          </MobileLayoutWithTabs>
        );
      case 'ui-catalog':
        return (
          <UiCatalogScreen 
            onBack={() => setScreen('dashboard')} 
          />
        );
      case 'admin-plans':
        return (
          <AdminPlansScreen 
            onBack={() => setScreen('admin-dashboard')} 
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboardScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={navigateToScreen}
          />
        );
      case 'admin-users':
        return (
          <AdminUsersScreen 
            onBack={() => setScreen('admin-dashboard')}
            onNavigate={(screen, params) => {
              if (screen === 'admin-user-details' && params?.userId) {
                setUserDetailsParams(params);
              }
              setScreen(screen);
            }}
          />
        );
      case 'admin-user-details':
        return (
          <AdminUserDetailsScreen 
            onBack={() => setScreen('admin-users')}
            onNavigate={navigateToScreen}
            userId={userDetailsParams?.userId}
          />
        );
      case 'admin-investments':
        return (
          <AdminStakingScreen 
            onBack={() => setScreen('admin-dashboard')}
            onNavigate={navigateToScreen}
          />
        );
      case 'admin-crypto':
        return (
          <AdminCryptoScreen 
            onBack={() => setScreen('admin-dashboard')}
          />
        );
      case 'membership-status':
        return (
          <StakingTiersScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={navigateToScreen}
          />
        );
      case 'privacy-policy':
        return (
          <PrivacyPolicyScreen onBack={() => setScreen('welcome')} />
        );
      case 'terms-of-service':
        return (
          <TermsOfServiceScreen onBack={() => setScreen('welcome')} />
        );
      case 'edit-profile':
        return (
          <ProfileScreen 
            onBack={() => setScreen('profile')}
            onNavigate={navigateToScreen}
          />
        );
      default:
        return (
          <WelcomeScreen 
            onSignIn={() => setScreen('login')} 
            onCreateAccount={() => setScreen('signup')} 
            onNavigate={(screen) => setScreen(screen)}
          />
        );
    }
  };

  // Screens that should show bottom tabs (main app screens)
  const tabScreens = ['dashboard', 'investments', 'crypto', 'profile', 'admin-dashboard', 'admin-users', 'admin-investments', 'admin-crypto', 'admin-plans'];
  const showTabs = tabScreens.includes(screen);

  // Handle bottom tab navigation
  const handleTabNavigation = (tabScreen: string) => {
    switch (tabScreen) {
      case 'dashboard':
        setScreen('dashboard');
        break;
      case 'investments':
        setScreen('investments');
        break;
      case 'crypto':
        setScreen('crypto');
        break;
      case 'profile':
        setScreen('profile');
        break;
      default:
        setScreen('dashboard');
    }
  };

  const authScreens = ['welcome', 'login', 'signup', 'terms-of-service', 'privacy-policy'];
  const isAuthScreen = authScreens.includes(screen);

  // For authentication screens, render directly without MobileLayoutWithTabs wrapper
  if (isAuthScreen) {
    return renderScreen();
  }

  // For app screens, wrap with MobileLayoutWithTabs
  return (
    <MobileLayoutWithTabs 
      showTabs={showTabs}
      onNavigate={handleTabNavigation}
      currentScreen={screen}
    >
      {renderScreen()}
    </MobileLayoutWithTabs>
  );
};

// Root App Component with Context Provider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;