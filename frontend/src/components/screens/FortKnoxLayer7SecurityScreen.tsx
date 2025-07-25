import React, { useState } from 'react';

interface FortKnoxEncryptionScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const FortKnoxEncryptionScreen: React.FC<FortKnoxEncryptionScreenProps> = ({ onBack, onNavigate }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvancedDetails, setShowAdvancedDetails] = useState(false);

  const handleEnableEncryption = async () => {
    setLoading(true);
    try {
      // Simulate encryption setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Fort Knox encryption enabled');
      // Navigate back to security hub after completion
      onNavigate?.('security-hub');
    } catch (error) {
      console.error('Encryption setup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    console.log('Skip encryption, proceed to dashboard');
    onNavigate?.('dashboard'); // Skip to dashboard (6/6 complete)
  };

  const handleBack = () => {
    onBack?.();
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

      <div className="w-full max-w-lg relative z-10 pt-16 pb-12">
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
            Fort Knox Data Security
          </h1>
          <p className="text-gray-400 mb-2">
            Secure your personal data with military-grade encryption
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
              WEB3 EXCLUSIVE
            </span>
            <span className="bg-amber-600/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium">
              LAYER 7
            </span>
          </div>
        </div>

        {/* Fort Knox Encryption Option */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-600/30 to-yellow-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <span className="text-4xl">🏰</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Fort Knox Mode</h2>
            <p className="text-gray-400 text-sm">
              Client-side end-to-end encryption for your personal data
            </p>
          </div>

          {/* What Gets Encrypted */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-green-400 font-semibold mb-3 flex items-center">
              <span className="mr-2">🔐</span>
              What Gets Fort Knox Protection
            </h3>
            <div className="space-y-2 text-sm text-green-200">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Personal information (name, email, phone)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Account preferences and settings</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Private notes and portfolio labels</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-400">✓</span>
                <span>Communication and support history</span>
              </div>
            </div>
          </div>

          {/* Technical Details Toggle */}
          <div className="mb-6">
            <button
              onClick={() => setShowAdvancedDetails(!showAdvancedDetails)}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all"
            >
              <span className="text-sm text-gray-300">Technical Details</span>
              <span className={`text-gray-400 transform transition-transform ${showAdvancedDetails ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {showAdvancedDetails && (
              <div className="mt-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="space-y-3 text-xs text-gray-400">
                  <div>
                    <span className="text-purple-400 font-medium">Encryption Method:</span>
                    <span className="ml-2">AES-256-GCM with wallet-derived keys</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium">Key Management:</span>
                    <span className="ml-2">Client-side key derivation from your wallet</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium">Zero Knowledge:</span>
                    <span className="ml-2">VonVault cannot decrypt your personal data</span>
                  </div>
                  <div>
                    <span className="text-purple-400 font-medium">Recovery:</span>
                    <span className="ml-2">Only accessible with your connected wallet</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* What Stays Visible */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h3 className="text-blue-400 font-semibold mb-3 flex items-center">
              <span className="mr-2">👁️</span>
              What Remains Operational
            </h3>
            <div className="space-y-2 text-sm text-blue-200">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Investment amounts and staking data</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Transaction history and performance metrics</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Tier status and reward calculations</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">•</span>
                <span>Wallet address (pseudonymous)</span>
              </div>
            </div>
            <p className="text-xs text-blue-300 mt-3">
              💡 Business operations continue normally while your privacy is protected
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleEnableEncryption}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-black py-4 px-6 rounded-xl font-bold hover:from-amber-500 hover:to-yellow-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span>Activating Fort Knox...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🏰</span>
                  <span>Activate Fort Knox Protection</span>
                </div>
              )}
            </button>
            
            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full bg-gray-700 text-gray-300 py-3 px-6 rounded-xl font-medium hover:bg-gray-600 transition-all disabled:opacity-50"
            >
              Maybe Later
            </button>
          </div>
        </div>

        {/* Security Layer Badge */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-700/50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-purple-400 text-xl mr-3">🛡️</span>
              <div>
                <p className="text-purple-400 font-semibold">Security Layer 7 of 7</p>
                <p className="text-sm text-gray-300">
                  The final frontier of data protection
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-400">9.95</p>
              <p className="text-xs text-gray-400">Security Rating</p>
            </div>
          </div>
        </div>

        {/* Bottom Marketing */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-2">
            🐦 Carrier pigeons still under budget review
          </p>
          <p className="text-xs text-gray-600">
            VonVault: The world's most secure DeFi platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default FortKnoxEncryptionScreen;
