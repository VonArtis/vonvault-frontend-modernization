import React, { useState, useEffect } from 'react';

interface SignUpScreenProps {
  onBack?: () => void;
  onSignUp?: (userData: any) => void;
  onGoToLogin?: () => void;
  onNavigate?: (screen: string) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBack, onSignUp, onGoToLogin, onNavigate }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showProgress, setShowProgress] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [capsLockWarning, setCapsLockWarning] = useState(false);
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [success, setSuccess] = useState(false);
  const [shakeField, setShakeField] = useState(null);

  // Mock countries for phone selector
  const countries = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+81', name: 'Japan', flag: '🇯🇵' },
    { code: '+86', name: 'China', flag: '🇨🇳' }
  ];

  // Real-time Email Availability Checking
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) {
      setEmailAvailable(null);
      return;
    }

    setEmailChecking(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const isAdminEmail = ['admin@vonvault.com', 'security@vonvault.com', 'test@test.com'].includes(email.toLowerCase());
      setEmailAvailable(!isAdminEmail);
    } catch (error) {
      setEmailAvailable(null);
    } finally {
      setEmailChecking(false);
    }
  };

  // Debounced email checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (form.email && form.email.includes('@')) {
        checkEmailAvailability(form.email);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [form.email]);

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completedSteps = 0;
    const totalSteps = 6;

    if (form.firstName.trim() && form.lastName.trim()) completedSteps++;
    if (form.email && /\S+@\S+\.\S+/.test(form.email) && emailAvailable === true) completedSteps++;
    if (form.phone && form.phone.length >= 10) completedSteps++;
    if (form.password && form.password.length >= 8) completedSteps++;
    if (form.confirmPassword && form.password === form.confirmPassword) completedSteps++;
    if (completedSteps === 5) completedSteps++;

    return (completedSteps / totalSteps) * 100;
  };

  // Clear errors when form changes
  useEffect(() => {
    setErrors({});
    setShowProgress(Object.values(form).some(field => field.trim() !== ''));
  }, [form]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      setShakeField('firstName');
    }
    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      setShakeField('lastName');
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
      setShakeField('email');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
      setShakeField('email');
    } else if (emailAvailable === false) {
      newErrors.email = 'This email is already taken';
      setShakeField('email');
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      setShakeField('phone');
    }
    if (!form.password.trim()) {
      newErrors.password = 'Password is required';
      setShakeField('password');
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      setShakeField('password');
    }
    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
      setShakeField('confirmPassword');
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      setShakeField('confirmPassword');
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => setShakeField(null), 500);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => {
        console.log('Account created successfully - navigating to email verification');
        // Web2.0 users need to verify email first, then phone, then security hub
        onNavigate?.('email-verification');
      }, 1500);
    } catch (error) {
      setErrors({ general: 'Failed to create account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    const capsLock = e.getModifierState && e.getModifierState('CapsLock');
    setCapsLockWarning(capsLock);
  };

  const handleBack = () => {
    console.log('Navigate back to Welcome');
  };

  const handleGoToLogin = () => {
    console.log('Navigate to Login Screen');
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

      <div className="w-full max-w-sm relative z-10 pt-8 pb-12">
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <div className="mb-4">
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
            VonVault
          </h1>
          <p className="text-gray-400 mb-4">
            Create your account to start investing
          </p>
          
          {/* Security Progress Indicator */}
          {showProgress && (
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Security Setup Progress</span>
                <span>{Math.round(calculateCompletion())}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${calculateCompletion()}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 text-center mt-2">
                {calculateCompletion() === 100 
                  ? '🔒 Account security setup complete!'
                  : '🛡️ Securing your account...'
                }
              </div>
            </div>
          )}
        </div>

        {/* Sign Up Form Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm text-center">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.firstName ? 'border-red-500' : 'border-gray-700'
                  } ${shakeField === 'firstName' ? 'animate-pulse' : ''}`}
                  placeholder="First name"
                  disabled={loading}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.lastName ? 'border-red-500' : 'border-gray-700'
                  } ${shakeField === 'lastName' ? 'animate-pulse' : ''}`}
                  placeholder="Last name"
                  disabled={loading}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setEmailAvailable(null);
                }}
                className={`w-full bg-gray-800 border rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } ${shakeField === 'email' ? 'animate-pulse' : ''}`}
                placeholder="Enter your email address"
                disabled={loading}
              />
              
              {/* Email Availability Indicator */}
              <div className="absolute right-3 top-9 flex items-center">
                {emailChecking && (
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                )}
                {!emailChecking && emailAvailable === true && (
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {!emailChecking && emailAvailable === false && (
                  <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
              
              {/* Email Availability Message */}
              {emailAvailable === true && (
                <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email is available!
                </p>
              )}
              {emailAvailable === false && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Email is already taken
                </p>
              )}
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div className="flex gap-2">
                <select
                  value={form.countryCode}
                  onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={loading}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`flex-1 bg-gray-800 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-700'
                  } ${shakeField === 'phone' ? 'animate-pulse' : ''}`}
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-700'
                  } ${shakeField === 'password' ? 'animate-pulse' : ''}`}
                  placeholder="Create a secure password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Caps Lock Warning */}
            {capsLockWarning && (
              <div className="flex items-center gap-2 p-2 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L4.168 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-yellow-400 text-xs">Caps Lock is on</span>
              </div>
            )}

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className={`w-full bg-gray-800 border rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                  } ${shakeField === 'confirmPassword' ? 'animate-pulse' : ''}`}
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button 
              onClick={handleGoToLogin}
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Terms Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Success Animation Overlay */}
      {success && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-full p-8 mx-auto mb-6 animate-pulse">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-gray-300">Setting up your secure account...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpScreen;
