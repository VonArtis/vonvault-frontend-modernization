import React, { useState, useEffect } from 'react';

const SMS2FALoginScreen = ({ onBack, onNavigate, userPhone = "+1 (555) 123-4567" }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30); // Start with timer since SMS auto-sent
  const [showSuccess, setShowSuccess] = useState(false);
  const [autoSent, setAutoSent] = useState(true);

  // Mask phone number for privacy
  const maskedPhone = userPhone.replace(/(\d{3})\d{3}(\d{4})/, '$1•••$2');

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    document.getElementById('code-0')?.focus();
  }, []);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all fields filled
    if (index === 5 && value) {
      const fullCode = [...newCode].join('');
      if (fullCode.length === 6) {
        setTimeout(() => handleVerify([...newCode]), 100);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      setTimeout(() => handleVerify(newCode), 100);
    }
  };

  const handleVerify = async (codeToVerify = code) => {
    const fullCode = codeToVerify.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      
      setTimeout(() => {
        onNavigate?.('biometric-setup'); // Next layer
      }, 2000);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      setCode(['', '', '', '', '', '']);
      document.getElementById('code-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendTimer(30);
      setCode(['', '', '', '', '', '']);
      setAutoSent(false);
      document.getElementById('code-0')?.focus();
    } catch (error) {
      setError('Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-full p-8 mx-auto mb-6 animate-pulse">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">SMS Verification Complete!</h2>
          <p className="text-gray-300 mb-4">Proceeding to next security layer</p>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 text-sm font-medium mb-1">🛡️ Layer 4 of 7 Complete</p>
            <p className="text-blue-300 text-xs">SMS authentication verified</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl"></div>

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
            SMS Verification
          </h1>
          <p className="text-gray-400 mb-4">
            Enter the verification code to continue
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              SECURITY LAYER 4 OF 7
            </span>
            <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
              SMS VERIFICATION
            </span>
          </div>
        </div>

        {/* Security Progress */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-blue-400 font-medium mb-3 flex items-center">
            <span className="mr-2">🔐</span>
            Multi-Layer Security Active
          </h4>
          <div className="text-sm text-blue-200 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Wallet Connected</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Email Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Phone Verified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400">⏳</span>
              <span>SMS Code Verification</span>
            </div>
          </div>
        </div>

        {/* Verification Form Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
          {/* Phone Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">📱</span>
              <span className="text-gray-400 text-sm">
                {autoSent ? 'Code sent to:' : 'Code resent to:'}
              </span>
            </div>
            <p className="text-white font-medium text-lg">{maskedPhone}</p>
            <p className="text-gray-500 text-xs mt-1">Check your messages</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3 text-center">
                Enter 6-Digit Verification Code
              </label>
              <div className="flex justify-center space-x-2 mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    maxLength={1}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabled={loading}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center">
                Tip: Code will auto-submit when complete
              </p>
            </div>

            {/* Resend Section */}
            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? (
                  <span className="flex items-center justify-center space-x-1">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="31.416" strokeDashoffset="31.416" className="opacity-25">
                        <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                    <span>Resend in {resendTimer}s</span>
                  </span>
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>

            {/* Manual Verify Button (fallback) */}
            <button
              onClick={() => handleVerify()}
              disabled={loading || code.join('').length !== 6}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Code'
              )}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-lg">🔒</span>
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">
                Security Checkpoint
              </p>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• Code expires in 10 minutes</p>
                <p>• 3 remaining security layers after this</p>
                <p>• Your DeFi assets remain protected</p>
                <p className="text-purple-300 font-medium">
                  • Next: Biometric authentication (Layer 5)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-yellow-400 text-lg">💡</span>
            <div>
              <p className="text-yellow-400 text-sm font-medium mb-1">
                Need Help?
              </p>
              <p className="text-yellow-300 text-xs">
                If you're not receiving SMS codes, check your signal strength or try resending. Contact support if issues persist.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMS2FALoginScreen;
