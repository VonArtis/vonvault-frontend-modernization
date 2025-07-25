import React, { useState, useEffect } from 'react';

const SMS2FASetupScreen = ({ onBack, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock phone number (would come from user context in real app)
  const phoneNumber = '+1 (555) 123-4567';

  const handleEnableSMS2FA = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate enabling SMS 2FA
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      
      setTimeout(() => {
        onNavigate?.('security-progress');
      }, 2000);
    } catch (error) {
      setError('Failed to enable SMS 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-full p-8 mx-auto mb-6 animate-pulse">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">SMS 2FA Setup Complete!</h2>
          <p className="text-gray-300 mb-4">Text message authentication activated</p>
          <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3">
            <p className="text-orange-400 text-sm font-medium mb-1">🛡️ Layer 4 of 7 Complete</p>
            <p className="text-orange-300 text-xs">Enhanced 2FA security activated</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 to-blue-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>

      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button 
          onClick={onBack}
          className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="w-full max-w-sm relative z-10 pt-16 pb-12">
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
            SMS 2FA Setup
          </h1>
          <p className="text-gray-400 mb-4">
            Enable Two Factor Authentication by Text Message
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
              SECURITY LAYER 4 OF 7
            </span>
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              SMS AUTHENTICATION
            </span>
          </div>
        </div>

        {/* Layer Benefits */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-orange-400 font-medium mb-3 flex items-center">
            <span className="mr-2">💬</span>
            Layer 4 Benefits Unlocked
          </h4>
          <div className="text-sm text-orange-200 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">✓</span>
              <span>Advanced login protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">✓</span>
              <span>Higher transaction limits</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">✓</span>
              <span>SMS-based 2FA for all devices</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">✓</span>
              <span>Priority customer support</span>
            </div>
          </div>
        </div>

        {/* Phone Number Display */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Verified Phone Number</h3>
            <p className="text-green-400 font-medium text-lg mb-2">{phoneNumber}</p>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-400">✓</span>
              <span className="text-sm text-green-300">Already verified in Layer 3</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleEnableSMS2FA}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enabling SMS 2FA...</span>
              </div>
            ) : (
              'Enable SMS 2FA'
            )}
          </button>
        </div>

        {/* How It Works */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-blue-400 font-medium mb-3 flex items-center">
            <span className="mr-2">📋</span>
            How SMS 2FA Works
          </h4>
          <div className="text-sm text-blue-200 space-y-2">
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 mt-0.5">1.</span>
              <span>When you log in, we'll send a 6-digit code to your phone</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 mt-0.5">2.</span>
              <span>Enter the code to complete your login securely</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 mt-0.5">3.</span>
              <span>Required for all transactions and sensitive actions</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400 mt-0.5">4.</span>
              <span>Works on any phone with SMS capability worldwide</span>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400 text-lg">💡</span>
            <div>
              <p className="text-yellow-400 text-sm font-medium mb-1">
                Security Tip
              </p>
              <p className="text-yellow-300 text-xs">
                SMS 2FA provides excellent security for most users. For maximum protection, consider setting up an authenticator app as a backup method after completing this setup.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-lg">ℹ️</span>
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">
                Need a different phone number?
              </p>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• You can update your phone number in Profile settings</p>
                <p>• The new number will need to be verified first</p>
                <p className="text-orange-300 font-medium">
                  • Next: Complete Layer 4 to unlock biometric options (Layer 5)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMS2FASetupScreen;
