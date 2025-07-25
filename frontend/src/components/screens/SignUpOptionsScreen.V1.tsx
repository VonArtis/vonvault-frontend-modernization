import React from 'react';

interface SignUpOptionsScreenProps {
  onBack: () => void;
  onConnectWallet: () => void;
  onEmailSignUp: () => void;
  onSignIn: () => void;
}

const SignUpOptionsScreen: React.FC<SignUpOptionsScreenProps> = ({ 
  onBack, 
  onConnectWallet, 
  onEmailSignUp, 
  onSignIn 
}) => {
  const handleConnectWallet = () => {
    onConnectWallet();
  };

  const handleEmailSignUp = () => {
    onEmailSignUp();
  };

  const handleBack = () => {
    onBack();
  };

  const handleSignIn = () => {
    onSignIn();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={handleBack}
          className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-md relative z-10 pt-16 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 200 200" className="mx-auto">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="100" fill="#000000"/>
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                fill="none" 
                stroke="url(#logoGradient)" 
                strokeWidth="8"
              />
              <path 
                d="M 65 65 L 100 135 L 135 65" 
                fill="none" 
                stroke="url(#logoGradient)" 
                strokeWidth="16" 
                strokeLinecap="square" 
                strokeLinejoin="miter"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Your Method
          </h1>
          <p className="text-gray-400 mb-2">
            Select how you'd like to create your account
          </p>
          <p className="text-sm text-gray-500">
            Both methods provide full access to VonVault
          </p>
        </div>

        {/* Choice Cards */}
        <div className="space-y-4 mb-6">
          
          {/* Web3.0 Wallet Option */}
          <button
            onClick={handleConnectWallet}
            className="w-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-2 border-purple-500/30 rounded-xl p-6 text-left hover:border-purple-500/50 hover:from-purple-600/20 hover:to-blue-600/20 transition-all transform hover:scale-[1.02] group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center group-hover:bg-purple-600/30 transition-all">
                <span className="text-2xl">👛</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-white">Connect Wallet</h3>
                  <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-xs font-medium">
                    WEB3.0
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Use your crypto wallet as your identity. No passwords needed - your wallet signature confirms ownership.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Truly decentralized experience</span>
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Maximum security with self-custody</span>
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <span className="mr-2">✓</span>
                    <span>No personal data required</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Web2.0 Email Option */}
          <button
            onClick={handleEmailSignUp}
            className="w-full bg-gradient-to-r from-blue-600/10 to-gray-600/10 border-2 border-blue-500/30 rounded-xl p-6 text-left hover:border-blue-500/50 hover:from-blue-600/20 hover:to-gray-600/20 transition-all transform hover:scale-[1.02] group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600/30 transition-all">
                <span className="text-2xl">📧</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-bold text-white">Email & Password</h3>
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                    TRADITIONAL
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  Traditional signup method you're familiar with. Create an account with email and password.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Familiar signup process</span>
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Easy account recovery options</span>
                  </div>
                  <div className="flex items-center text-xs text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Direct support communication</span>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Support Notice */}
        <div className="bg-amber-900/20 border border-amber-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-amber-400 text-lg">💡</span>
            <div>
              <p className="text-amber-400 text-sm font-medium mb-1">
                Customer Support Notice
              </p>
              <p className="text-amber-300 text-xs">
                To receive support ticket updates and platform communications, an email address will be required. Wallet users can add this later when needed.
              </p>
            </div>
          </div>
        </div>

        {/* Security Assurance */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-purple-400 text-lg">🛡️</span>
            <div>
              <p className="text-purple-400 text-sm font-medium">
                Bank-Grade Security for Both Methods
              </p>
              <p className="text-gray-400 text-xs">
                Your funds and data are protected with the same enterprise-level encryption regardless of signup method.
              </p>
            </div>
          </div>
        </div>

        {/* Already Have Account */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button 
              onClick={handleSignIn}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpOptionsScreen;
