import React, { useState, useRef, useEffect } from 'react';

const SMSVerificationScreen = ({ onBack, onNavigate }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef([]);

  // Mock phone number for display
  const phoneNumber = '+1 (555) 123-4567';

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedCode = text.replace(/\D/g, '').slice(0, 6).split('');
        const newCode = [...code];
        pastedCode.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);
        // Focus the next empty input or the last one
        const nextEmptyIndex = newCode.findIndex(digit => !digit);
        const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
      });
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setShowSuccess(true);
      
      // Navigate after showing success
      setTimeout(() => {
        onNavigate?.('dashboard');
      }, 2000);
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCode(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
  };

  const isCodeComplete = code.every(digit => digit !== '');

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-full p-8 mx-auto mb-6 animate-pulse">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Phone Verified!</h2>
          <p className="text-gray-300 mb-4">Your phone number has been confirmed</p>
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 text-sm font-medium mb-1">🛡️ Layer 3 of 7 Complete</p>
            <p className="text-green-300 text-xs">Continue building your security fortress</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-blue-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600/5 rounded-full blur-3xl"></div>
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
            Verify Phone
          </h1>
          <p className="text-gray-400 mb-2">
            Enter the 6-digit code sent to
          </p>
          <p className="text-green-400 font-medium mb-4">
            {phoneNumber}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
              SECURITY LAYER 3 OF 7
            </span>
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              PHONE VERIFICATION
            </span>
          </div>
        </div>

        {/* Layer Benefits */}
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-green-400 font-medium mb-3 flex items-center">
            <span className="mr-2">📱</span>
            Layer 3 Benefits Unlocked
          </h4>
          <div className="text-sm text-green-200 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>SMS-based 2FA protection</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Transaction alerts via SMS</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Higher staking limits unlocked</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400">✓</span>
              <span>Account recovery via phone</span>
            </div>
          </div>
        </div>

        {/* Verification Form Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Code Input Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                Verification Code
              </label>
              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 bg-gray-800 border border-gray-700 rounded-lg text-center text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    maxLength="1"
                    inputMode="numeric"
                    disabled={loading}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                💡 Tip: You can paste the full code into any field
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading || !isCodeComplete}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                'Verify Phone'
              )}
            </button>
          </div>
        </div>

        {/* Resend Section */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm mb-3">
            Didn't receive the code?
          </p>
          
          {countdown > 0 ? (
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">
                Resend in {countdown}s
              </span>
            </div>
          ) : (
            <button
              onClick={handleResend}
              className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
              disabled={loading}
            >
              Resend SMS Code
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-lg">📱</span>
            <div>
              <p className="text-blue-400 text-sm font-medium mb-1">
                SMS not arriving?
              </p>
              <div className="text-blue-300 text-xs space-y-1">
                <p>• Check your phone's message inbox</p>
                <p>• SMS delivery can take up to 2 minutes</p>
                <p>• Ensure your carrier allows SMS from our service</p>
                <p className="text-green-300 font-medium">
                  • Next: Complete Layer 3 to unlock enhanced 2FA options (Layer 4)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Phone Option */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs mb-2">
            Wrong phone number?
          </p>
          <button 
            onClick={() => console.log('Change phone number')}
            className="text-green-400 hover:text-green-300 text-xs font-medium transition-colors"
            disabled={loading}
          >
            Change Phone Number
          </button>
        </div>
      </div>
    </div>
  );
};

export default SMSVerificationScreen;
