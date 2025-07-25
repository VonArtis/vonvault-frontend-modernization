import React, { useState } from 'react';

const AuthenticatorSetupScreen = ({ onBack, onNavigate }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // QR Code configuration
  const QR_CODE_SIZE = '200x200';
  const QR_SERVICE_URL = 'https://chart.googleapis.com/chart';
  const DEMO_SECRET = 'JBSWY3DPEHPK3PXP';
  const qrCodeUrl = `${QR_SERVICE_URL}?chs=${QR_CODE_SIZE}&cht=qr&chl=otpauth://totp/VonVault:user@example.com?secret=${DEMO_SECRET}&issuer=VonVault`;

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      
      setTimeout(() => {
        onNavigate?.('security-progress');
      }, 2000);
    } catch (error) {
      setError('Verification failed. Please try again.');
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
          <h2 className="text-2xl font-bold text-white mb-2">Authenticator Setup Complete!</h2>
          <p className="text-gray-300 mb-4">Hardware-grade security activated</p>
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
            Authenticator Setup
          </h1>
          <p className="text-gray-400 mb-4">
            Scan QR code with your authenticator app
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-orange-600/30 text-orange-300 px-3 py-1 rounded-full text-xs font-medium">
              SECURITY LAYER 4 OF 7
            </span>
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              AUTHENTICATOR SETUP
            </span>
          </div>
        </div>

        {/* Layer Benefits */}
        <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-orange-400 font-medium mb-3 flex items-center">
            <span className="mr-2">🔐</span>
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
              <span>Premium security features</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-400">✓</span>
              <span>Priority customer support</span>
            </div>
          </div>
        </div>

        {/* Setup Form Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-lg inline-block">
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-sm font-medium">QR Code</div>
                  <div className="text-xs">Scan with authenticator app</div>
                  <div className="mt-2 text-xs bg-gray-200 px-2 py-1 rounded">
                    Secret: JBSWY3DPEHPK3PXP
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Or manually enter secret: <span className="font-mono">JBSWY3DPEHPK3PXP</span>
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-300 mb-3">
              Setup Instructions
            </h3>
            <ol className="text-sm text-gray-300 space-y-2">
              <li>1. Open your authenticator app (Google Authenticator, Authy, etc.)</li>
              <li>2. Scan the QR code above</li>
              <li>3. Enter the 6-digit code from your app below</li>
            </ol>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                disabled={loading}
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || code.length !== 6}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify & Complete Setup'
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-lg">📱</span>
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">
                Need an authenticator app?
              </p>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• Google Authenticator (recommended)</p>
                <p>• Authy - Multi-device sync</p>
                <p>• Microsoft Authenticator</p>
                <p className="text-orange-300 font-medium">
                  • Next: Complete Layer 4 to unlock biometric options (Layer 5)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Codes Notice */}
        <div className="mt-6 bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400 text-lg">⚠️</span>
            <div>
              <p className="text-yellow-400 text-sm font-medium mb-1">
                Important: Save backup codes
              </p>
              <p className="text-yellow-300 text-xs">
                After setup, save your backup codes in a secure location. These help recover access if you lose your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticatorSetupScreen;
