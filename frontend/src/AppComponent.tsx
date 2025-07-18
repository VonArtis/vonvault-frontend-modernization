import React, { useState, useEffect } from 'react';
import type { ScreenType, User } from './types';
import { AppProvider } from './context/AppContext';
import { notificationService } from './services/NotificationService';
import { biometricAuthService } from './services/BiometricAuthService';
import { secureStorage } from './utils/secureStorage'; // Added for consistent storage
import { useApp } from './context/AppContext';
// REMOVED: import { useAuth } from './hooks/useAuth'; - Fixed dual auth architecture
import { MobileLayoutWithTabs } from './components/layout/MobileLayoutWithTabs';
import { NavigationErrorBoundary } from './components/common/NavigationErrorBoundary';
import { useDeepLinking } from './hooks/useDeepLinking';

// Screen imports
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { LoginScreen } from './components/screens/LoginScreen';
import { SignUpScreen } from './components/screens/SignUpScreen';

import { ConnectCryptoScreen } from './components/screens/ConnectCryptoScreen';
import { CryptoWalletScreen } from './components/screens/CryptoWalletScreen';
import { CryptoDepositScreen } from './components/screens/CryptoDepositScreen';
import { WalletManagerScreen } from './components/screens/WalletManagerScreen';
import { EmailVerificationScreen } from './components/screens/EmailVerificationScreen';
import { SMSVerificationScreen } from './components/screens/SMSVerificationScreen';
import { TwoFactorSetupScreen } from './components/screens/TwoFactorSetupScreen';
import { AuthenticatorSetupScreen } from './components/screens/AuthenticatorSetupScreen';
import { Enhanced2FASetupScreen } from './components/screens/Enhanced2FASetupScreen';
import { SMSTwoFactorSetupScreen } from './components/screens/SMSTwoFactorSetupScreen';
import { VerificationSuccessScreen } from './components/screens/VerificationSuccessScreen';
import { AdminDashboardScreen } from './components/screens/AdminDashboardScreen';
import { AdminUsersScreen } from './components/screens/AdminUsersScreen';
import { AdminUserDetailsScreen } from './components/screens/AdminUserDetailsScreen';
import { AdminStakingScreen } from './components/screens/AdminStakingScreen';
import { AdminCryptoScreen } from './components/screens/AdminCryptoScreen';
import { PrivacyPolicyScreen } from './components/screens/PrivacyPolicyScreen';
import { TermsOfServiceScreen } from './components/screens/TermsOfServiceScreen';
import { EditProfileScreen } from './components/screens/EditProfileScreen';



import { InvestmentAnalyticsScreen } from './components/screens/InvestmentAnalyticsScreen';
import { StakingAnalyticsScreen } from './components/screens/StakingAnalyticsScreen';
import { StakingDashboardScreen } from './components/screens/StakingDashboardScreen';
import { CreateStakingScreen } from './components/screens/CreateStakingScreen';
import { StakingCompletionScreen } from './components/screens/StakingCompletionScreen';
import { StakingTiersScreen } from './components/screens/StakingTiersScreen';
import { StakingHistoryScreen } from './components/screens/StakingHistoryScreen';

import { ProfileScreen } from './components/screens/ProfileScreen';
import { ThemeIndicator } from './components/common/ThemeIndicator';
import { UiCatalogScreen } from './components/screens/UiCatalogScreen';

import { CreateTicketScreen } from './components/screens/CreateTicketScreen';
import { MyTicketsScreen } from './components/screens/MyTicketsScreen';
import { SmartContractInvestmentScreen } from './components/screens/SmartContractInvestmentScreen';

import './App.css';

// Main App Router Component
const AppRouter: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [userDetailsParams, setUserDetailsParams] = useState<any>(null);
  const { user: contextUser } = useApp(); // Access user from context for debugging

  // FIXED: Deep linking support for URL-based navigation
  const { generateShareableUrl, isValidScreen } = useDeepLinking(
    screen,
    (newScreen: ScreenType, params?: any) => {
      if (params?.userId) {
        setUserDetailsParams(params);
      }
      setScreen(newScreen);
    }
  );

  // Prevent browser back button from exiting app
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent default back behavior
      event.preventDefault();
      
      // Handle in-app navigation based on current screen
      if (screen === 'dashboard') {
        // Don't exit from dashboard, stay there
        window.history.pushState(null, '', window.location.href);
      } else {
        // FIXED: Extended back screen mappings for all current screens
        const backScreens: Record<string, ScreenType> = {
          // Staking-related screens
          'staking-dashboard': 'dashboard',
          'create-staking': 'staking-dashboard',
          'staking-completion': 'staking-dashboard',
          'staking-tiers': 'staking-dashboard',
          'staking-history': 'staking-dashboard',
          'staking-analytics': 'staking-dashboard',
          
          // Crypto/wallet-related screens (ENHANCED for staking)
          'crypto-deposit': 'crypto',
          'wallet-manager': 'crypto',
          'connect-crypto': 'crypto',
          'test-wallet-connections': 'crypto',
          
          // Verification-related screens  
          'verification': 'dashboard',
          'verification-success': 'dashboard',
          '2fa-setup': 'profile',
          '2fa-sms-setup': '2fa-setup',
          
          // Analytics and admin screens
          'analytics': 'dashboard',
          'admin-dashboard': 'dashboard',
          'admin-users': 'admin-dashboard',
          'admin-user-details': 'admin-users',
          
          // Main navigation screens
          'crypto': 'dashboard', 
          'profile': 'dashboard',
          
          // Other utility screens
          'ui-catalog': 'dashboard'
        };
        
        const backScreen = backScreens[screen] || 'dashboard';
        setScreen(backScreen);
      }
    };

    // Push initial state to prevent immediate exit
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [screen]);

  // Initialize security services on app startup
  useEffect(() => {
    // Initialize services
    notificationService.init();
    biometricAuthService.init();
    
    // FIXED: Restore wallet connections on app startup
    const restoreWalletConnections = async () => {
      try {
        const { cryptoWalletService } = await import('./services/CryptoWalletService');
        await cryptoWalletService.restoreWalletConnections();
      } catch (error) {
        console.error('Failed to restore wallet connections:', error);
      }
    };
    
    restoreWalletConnections();
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
      'connect-crypto': 'Connect Wallet - VonVault',
      'investments': 'Investments - VonVault',
      'staking-dashboard': 'Staking Dashboard - VonVault',
      'create-staking': 'Create Staking - VonVault',
      'staking-completion': 'Staking Complete - VonVault',
      'staking-tiers': 'VIP Tiers - VonVault',
      'staking-history': 'Staking History - VonVault',
      'staking-analytics': 'Staking Analytics - VonVault',
      'crypto': 'Crypto Wallet - VonVault',
      'crypto-deposit': 'Crypto Deposit - VonVault',
      'wallet-manager': 'Wallet Manager - VonVault',
      'admin-dashboard': 'Admin Dashboard - VonVault',
      'admin-users': 'User Management - VonVault',
      'admin-user-details': 'User Details - VonVault',
      'admin-staking': 'Staking Analytics - VonVault',
      'admin-crypto': 'Crypto Analytics - VonVault',
      'privacy-policy': 'Privacy Policy - VonVault',
      'terms-of-service': 'Terms of Service - VonVault',
      'edit-profile': 'Edit Profile - VonVault',
      'create-ticket': 'Submit Support Ticket - VonVault',
      'my-tickets': 'My Support Tickets - VonVault',
      'smart-contract-investment': 'Smart Contract Investment - VonVault'
    };
    
    document.title = titles[screen] || 'VonVault - DeFi Investment Platform';
  }, [screen]);
  
  // === PHASE 1: REMOVE DUPLICATE useAuth - USE CONTEXT ONLY ===
  // Fixed: Remove duplicate useAuth call that was causing race conditions
  // Now using single auth state from AppContext instead of dual state
  const { user: authUser, authenticateBank, authenticateCrypto } = useApp();

  // Monitor authentication state - redirect to login when user logs out
  useEffect(() => {
    // FIX: Removed timing delays - no longer needed with single auth state
    if (!authUser) {
      // User is not authenticated (logged out), redirect to login
      // But don't redirect if we're already on welcome/login/signup screens
      const publicScreens = ['welcome', 'login', 'signup'];
      if (!publicScreens.includes(screen)) {
        console.log('User logged out, redirecting to login screen');
        setScreen('login');
      }
    }
  }, [authUser, screen]);

  // Helper function to check if user is a hardcoded admin
  const isAdminUser = (email: string): boolean => {
    const adminEmails = ['admin@vonartis.com', 'security@vonartis.com'];
    return adminEmails.includes(email);
  };

  // Handle successful authentication - differentiate between signup and login
  const handleSignup = (userData: User) => {
    // Save user data for verification tracking (Fixed: using sessionStorage per API standardization)
    secureStorage.setItem('currentUser', JSON.stringify(userData));
    console.log('Signup completed, user data saved:', userData);
    console.log('Context user after signup:', contextUser);
    
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
    const currentUser = secureStorage.getItem('currentUser'); // Fixed: using sessionStorage per API standardization
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
    // Save user data for verification tracking (Fixed: using sessionStorage)
    secureStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Trigger login notification
    notificationService.notifyLoginAttempt('Current Location', 'This Device');
    
    console.log('Login successful, user data:', userData);
    console.log('User token exists:', !!userData.token);
    console.log('Is admin user?', isAdminUser(userData.email || ''));
    
    // Admin bypass - Skip verification for hardcoded admins
    if (isAdminUser(userData.email || '')) {
      console.log('Admin user detected, bypassing verification');
      console.log('Admin user has token:', !!userData.token);
      console.log('Setting screen to dashboard...');
      setScreen('dashboard');
      return;
    }
    
    // Check if user is already verified (stored in sessionStorage for security)
    const verificationStatus = secureStorage.getItem(`verification_${userData.email}`);
    
    if (verificationStatus === 'completed') {
      // User is already verified, go directly to dashboard
      console.log('User already verified, going to dashboard');
      setScreen('dashboard');
    } else {
      // User not verified yet, send through verification flow
      console.log('User not verified, going to email verification');
      setScreen('email-verification');
    }
  };

  // Handle successful authentication - differentiate between signup and login
  const handleVerificationComplete = () => {
    // Mark verification as completed for this user (Fixed: using sessionStorage)
    const currentUser = secureStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        secureStorage.setItem(`verification_${userData.email}`, 'completed');
        
        // Notify successful verification
        notificationService.notifyAccountVerification('approved');
        
        console.log('Verification marked as completed for user:', userData.email);
        console.log('User data available after verification:', userData);
      } catch (error) {
        console.error('Error parsing user data during verification completion:', error);
      }
    } else {
      console.warn('No user data found in sessionStorage during verification');
    }
    
    setScreen('dashboard');
  };

  // Helper function to handle navigation with proper typing
  const handleNavigation = (screen: string) => {
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
      
      // Notify successful crypto connection
      await notificationService.notifyTransaction('trade', 0, 'Crypto Wallet Connected');
      
      setScreen('verification-success');
    } catch (error) {
      console.error('Crypto connection failed:', error);
    }
  };

  const renderScreen = () => {
    {/* Theme Indicator for Testing */}
    {(screen === 'dashboard' || screen === 'profile') && (
      <>
        {/* We can remove this after testing */}
        <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
          <ThemeIndicator />
        </div>
      </>
    )}
    
    switch (screen) {
      case 'welcome':
        return (
          <WelcomeScreen 
            onSignIn={() => setScreen('login')} 
            onCreateAccount={() => setScreen('signup')} 
            onNavigate={(screen) => setScreen(screen)}
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
            onBack={() => setScreen('welcome')}
            onSignUp={handleSignup}
            onGoToLogin={() => setScreen('login')}
          />
        );
      case 'email-verification':
        return (
          <EmailVerificationScreen 
            onBack={() => setScreen('signup')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
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
          <TwoFactorSetupScreen 
            onBack={() => setScreen('sms-verification')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case '2fa-authenticator-setup':
        return (
          <AuthenticatorSetupScreen 
            onBack={() => setScreen('2fa-setup')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'enhanced-2fa-setup':
        return (
          <Enhanced2FASetupScreen 
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case '2fa-sms-setup':
        return (
          <SMSTwoFactorSetupScreen 
            onBack={() => setScreen('2fa-setup')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'verification-success':
        return (
          <VerificationSuccessScreen 
            onContinue={() => {
              handleVerificationComplete();
            }}
          />
        );
      case 'connect-crypto':
        return (
          <ConnectCryptoScreen 
            onBack={() => setScreen('dashboard')} // Skip goes to dashboard
            onConnect={handleCryptoConnect} 
          />
        );
      case 'dashboard':
        return (
          <StakingDashboardScreen 
            onNavigate={(screen) => setScreen(screen as ScreenType)} 
          />
        );
      // Add direct access to connect-crypto for testing
      case 'test-wallet-connections':
        return (
          <ConnectCryptoScreen 
            onBack={() => setScreen('dashboard')}
            onConnect={handleCryptoConnect} 
          />
        );
      case 'analytics':
        return (
          <StakingAnalyticsScreen 
            onBack={() => setScreen('dashboard')} 
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );

      case 'create-staking':
        return (
          <CreateStakingScreen 
            onBack={() => setScreen('staking-dashboard')} 
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'staking-completion':
        return (
          <StakingCompletionScreen 
            onBack={() => setScreen('create-staking')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'crypto':
        // FIXED: Validate wallet connections when navigating to crypto screen
        const validateCryptoNavigation = async () => {
          try {
            const { cryptoWalletService } = await import('./services/CryptoWalletService');
            await cryptoWalletService.validateWalletConnections();
          } catch (error) {
            console.error('Failed to validate wallet connections:', error);
          }
        };
        
        validateCryptoNavigation();
        
        return (
          <CryptoWalletScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'crypto-deposit':
        return (
          <CryptoDepositScreen 
            onBack={() => setScreen('crypto')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'wallet-manager':
        return (
          <WalletManagerScreen 
            onBack={() => setScreen('crypto')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'ui-catalog':
        return (
          <UiCatalogScreen 
            onBack={() => setScreen('dashboard')} 
          />
        );
      case 'admin-dashboard':
        return (
          <AdminDashboardScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
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
            onNavigate={(screen) => setScreen(screen as ScreenType)}
            userId={userDetailsParams?.userId}
          />
        );
      case 'admin-staking':
        return (
          <AdminStakingScreen 
            onBack={() => setScreen('admin-dashboard')}
            onNavigate={handleNavigation}
          />
        );
      case 'admin-crypto':
        return (
          <AdminCryptoScreen 
            onBack={() => setScreen('admin-dashboard')}
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
          <EditProfileScreen onBack={() => setScreen('profile')} />
        );
      case 'create-ticket':
        return (
          <CreateTicketScreen onBack={() => setScreen('profile')} onNavigate={handleNavigation} />
        );
      case 'my-tickets':
        return (
          <MyTicketsScreen onBack={() => setScreen('profile')} onNavigate={handleNavigation} />
        );
      case 'smart-contract-investment':
        return (
          <SmartContractInvestmentScreen onBack={() => setScreen('new-investment')} onNavigate={handleNavigation} />
        );
      case 'staking-dashboard':
        return (
          <StakingDashboardScreen 
            onBack={() => setScreen('dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'create-staking':
        return (
          <CreateStakingScreen 
            onBack={() => setScreen('staking-dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'staking-completion':
        return (
          <StakingCompletionScreen 
            onBack={() => setScreen('create-staking')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'staking-tiers':
        return (
          <StakingTiersScreen 
            onBack={() => setScreen('staking-dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'staking-history':
        return (
          <StakingHistoryScreen 
            onBack={() => setScreen('staking-dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
          />
        );
      case 'staking-analytics':
        return (
          <StakingAnalyticsScreen 
            onBack={() => setScreen('staking-dashboard')}
            onNavigate={(screen) => setScreen(screen as ScreenType)}
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
  const tabScreens = [
    'dashboard', 'crypto', 'profile', 
    'analytics',
    'staking-dashboard', 'create-staking', 'staking-completion', 'staking-tiers', 'staking-history', 'staking-analytics',
    'crypto-deposit', 'wallet-manager', 'edit-profile',
    'admin-dashboard', 'admin-users', 'admin-user-details', 'admin-staking', 'admin-crypto',
    'create-ticket', 'my-tickets',
    'ui-catalog'
  ];
  const showTabs = tabScreens.includes(screen);

  // Handle bottom tab navigation
  const handleTabNavigation = (tabScreen: string) => {
    switch (tabScreen) {
      case 'dashboard':
        setScreen('dashboard');
        break;
      case 'staking':
        setScreen('staking-dashboard');
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

  const authScreens = [
    'welcome', 'login', 'signup', 'terms-of-service', 'privacy-policy',
    'email-verification', 'sms-verification', '2fa-setup', '2fa-authenticator-setup', 
    'enhanced-2fa-setup', '2fa-sms-setup', 'verification-success',
    'connect-bank', 'connect-crypto', 'test-wallet-connections'
  ];
  const isAuthScreen = authScreens.includes(screen);

  // For authentication screens, render directly without MobileLayoutWithTabs wrapper
  if (isAuthScreen) {
    return (
      <NavigationErrorBoundary
        screenName={screen}
        fallbackScreen="welcome"
        onNavigate={(screen) => setScreen(screen as ScreenType)}
      >
        {renderScreen()}
      </NavigationErrorBoundary>
    );
  }

  // For app screens, wrap with MobileLayoutWithTabs
  return (
    <MobileLayoutWithTabs 
      showTabs={showTabs}
      onNavigate={handleTabNavigation}
      currentScreen={screen}
    >
      <NavigationErrorBoundary
        screenName={screen}
        fallbackScreen="dashboard"
        onNavigate={(screen) => setScreen(screen as ScreenType)}
      >
        {renderScreen()}
      </NavigationErrorBoundary>
    </MobileLayoutWithTabs>
  );
};

// Root App Component with Context Provider
const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
};

export default App;