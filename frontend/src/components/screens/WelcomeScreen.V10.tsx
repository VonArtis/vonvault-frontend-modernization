import React, { useState } from 'react';

interface WelcomeScreenProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
  onNavigate?: (screen: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignIn, onCreateAccount, onNavigate }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 
    'Hindi', 'Turkish', 'Polish'
  ];

  const handleSignIn = () => {
    onSignIn();
  };

  const handleCreateAccount = () => {
    onCreateAccount();
  };

  const handleNavigate = (page: string) => {
    onNavigate?.(page);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-blue-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-6 relative z-10 pt-16 pb-12">
        {/* Logo */}
        <div className="mb-4">
          <div className="relative">
            <svg width="80" height="80" viewBox="0 0 200 200" className="mx-auto">
              {/* Outer glow effect */}
              <circle cx="100" cy="100" r="100" fill="url(#logoGlow)" opacity="0.3" />
              
              <defs>
                <radialGradient id="logoGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              
              {/* Main logo */}
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
            
            {/* Subtle animation */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse"></div>
          </div>
        </div>
        
        {/* Title and subtitle */}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            VonVault
          </h1>
          <p className="text-lg text-gray-400 font-medium">
            World's Most Secure DeFi Platform
          </p>
          <p className="text-sm text-gray-500 max-w-xs">
            Built for WEB 3.0
          </p>
        </div>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 w-full py-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-400 text-xl">🛡️</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Bank Grade</p>
            <p className="text-xs text-gray-400">Encryption</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-green-400 text-xl">💰</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Lowest Fees</p>
            <p className="text-xs text-gray-400">In Industry</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-400 text-xl">👛</span>
            </div>
            <p className="text-xs text-gray-400 font-medium">Connect 600+</p>
            <p className="text-xs text-gray-400">Wallets</p>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="w-full space-y-4 pt-4 flex flex-col items-center">
          <button 
            onClick={handleSignIn}
            className="w-64 bg-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </button>
          <button 
            onClick={handleCreateAccount}
            className="w-64 border border-gray-700 text-gray-300 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-800 hover:border-gray-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Create Account
          </button>
        </div>

        {/* Global platform messaging */}
        <div className="text-center py-2">
          <p className="text-lg text-gray-300 font-semibold flex items-center justify-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span>Global Platform Supports 15 Languages</span>
          </p>
        </div>
        
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-all px-3 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <span className="text-lg">🇬🇧</span>
            <span className="text-sm">{selectedLanguage}</span>
            <span className="text-xs">▼</span>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition-all first:rounded-t-xl last:rounded-b-xl ${
                    selectedLanguage === lang ? 'text-purple-400 bg-gray-800' : 'text-gray-300'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Terms and Privacy */}
        <div className="text-center space-y-2">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs">
            <button 
              onClick={() => handleNavigate('terms-of-service')}
              className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2"
            >
              Terms of Service
            </button>
            <span className="text-gray-600">•</span>
            <button 
              onClick={() => handleNavigate('privacy-policy')}
              className="text-purple-400 hover:text-purple-300 transition-colors underline underline-offset-2"
            >
              Privacy Policy
            </button>
          </div>
        </div>

        {/* Version indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-gray-600">v2.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
