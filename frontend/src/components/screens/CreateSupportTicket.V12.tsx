import React, { useState } from 'react';

const CreateTicketScreen = ({ onBack, onNavigate }) => {
  const [formData, setFormData] = useState({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user data for support tier
  const userTier = 'ELITE'; // Would come from context

  const categories = [
    { value: 'account', label: 'Account Issues', description: 'Login, passwords, access problems' },
    { value: 'financial', label: 'Financial Questions', description: 'Deposits, withdrawals, transactions' },
    { value: 'technical', label: 'Technical Problems', description: 'App issues, bugs, performance' },
    { value: 'verification', label: 'Verification Issues', description: 'KYC, document verification' },
    { value: 'security', label: 'Security Concerns', description: 'Suspicious activity, security questions' },
    { value: 'other', label: 'Other', description: 'General inquiries and feedback' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-400', description: 'General questions' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', description: 'Standard issues' },
    { value: 'high', label: 'High', color: 'text-orange-400', description: 'Account problems' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400', description: 'Security concerns' }
  ];

  const supportTiers = {
    BASIC: { responseTime: '48-72 hours', priority: 'Standard' },
    CLUB: { responseTime: '24-48 hours', priority: 'Priority' },
    PREMIUM: { responseTime: '12-24 hours', priority: 'Premium' },
    VIP: { responseTime: '2-12 hours', priority: 'VIP' },
    ELITE: { responseTime: '1-4 hours', priority: 'Elite' }
  };

  const currentSupport = supportTiers[userTier] || supportTiers.BASIC;

  const handleSubmit = () => {
    setError('');

    if (!formData.category || !formData.subject || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const ticketId = 'VV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
      
      // Show success message
      alert(`Support ticket created successfully!\nTicket ID: ${ticketId}\n\nEstimated response: ${currentSupport.responseTime}`);
      
      setLoading(false);
      // Navigate to tickets list
      onNavigate?.('my-tickets');
    }, 2000);
  };

  const selectedCategory = categories.find(cat => cat.value === formData.category);
  const selectedPriority = priorities.find(pri => pri.value === formData.priority);

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
            Submit Support Ticket
          </h1>
          <p className="text-gray-400 mb-4">
            Get expert help from our support team
          </p>
          
          {/* Support Tier Badge */}
          <div className="flex items-center justify-center space-x-2">
            <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
              {currentSupport.priority} SUPPORT
            </span>
            <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
              {currentSupport.responseTime}
            </span>
          </div>
        </div>

        {/* Support Level Benefits */}
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 mb-6">
          <h4 className="text-purple-400 font-medium mb-3 flex items-center">
            <span className="mr-2">🎫</span>
            Your {userTier} Support Benefits
          </h4>
          <div className="text-sm text-purple-200 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">✓</span>
              <span>Estimated response: {currentSupport.responseTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">✓</span>
              <span>{currentSupport.priority} queue priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-400">✓</span>
              <span>Expert technical support team</span>
            </div>
            {userTier === 'VIP' || userTier === 'ELITE' ? (
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">✓</span>
                <span>Direct escalation to senior specialists</span>
              </div>
            ) : null}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Ticket Form Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 shadow-xl mb-6">
          <div className="space-y-6">
            {/* Category Selection */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                What can we help you with? *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-500"
                disabled={loading}
              >
                <option value="">Select a category...</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {selectedCategory && (
                <p className="text-xs text-gray-400 mt-2 animate-fadeIn">
                  {selectedCategory.description}
                </p>
              )}
            </div>

            {/* Priority Selection */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-500"
                disabled={loading}
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label} - {priority.description}
                  </option>
                ))}
              </select>
              {selectedPriority && (
                <p className={`text-xs mt-2 animate-fadeIn ${selectedPriority.color}`}>
                  {selectedPriority.label} priority: {selectedPriority.description}
                </p>
              )}
            </div>

            {/* Subject */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all hover:border-gray-500"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Detailed Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please provide as much detail as possible about your issue. Include any error messages, steps to reproduce, or relevant account information."
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32 resize-none transition-all hover:border-gray-500"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Characters: {formData.description.length}/1000
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Ticket...</span>
                </div>
              ) : (
                'Submit Support Ticket'
              )}
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <span className="text-blue-400 text-lg">💡</span>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">Tips for Faster Resolution</h4>
              <div className="text-blue-200 text-sm space-y-1">
                <p>• Include error messages or codes if available</p>
                <p>• Mention your browser/device for technical problems</p>
                <p>• Provide transaction IDs for financial inquiries</p>
                <p>• Be as detailed as possible for faster resolution</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {userTier === 'ELITE' ? (
          <div className="bg-amber-900/20 border border-amber-600/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-amber-400 text-lg">🚨</span>
              <div>
                <h4 className="text-amber-400 font-medium mb-1">Emergency Concierge Service</h4>
                <p className="text-amber-200 text-xs">
                  For urgent security issues or account compromises, ELITE members have access to our emergency hotline via Concierge Service in your account dashboard.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CreateTicketScreen;
