import React, { useState } from 'react';

const FAQScreen = ({ onBack }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      color: 'blue',
      items: [
        {
          question: 'How do I create a VonVault account?',
          answer: 'You can sign up using either traditional email/password or by connecting your Web3 wallet. Web3 users get access to exclusive features like Fort Knox encryption.'
        },
        {
          question: 'What is the difference between Web2 and Web3 signup?',
          answer: 'Web2 signup uses email and password with optional security layers. Web3 signup connects your crypto wallet and gives access to all 7 security layers including Fort Knox encryption.'
        },
        {
          question: 'What are the 7 layers of security?',
          answer: 'Layer 1: Wallet Authentication, Layer 2: Email Verification, Layer 3: SMS Verification, Layer 4: Enhanced 2FA/OTP, Layer 5: Biometric Security, Layer 6: Authenticator Device, Layer 7: Fort Knox Encryption (Web3 exclusive).'
        }
      ]
    },
    {
      title: 'Account Security',
      icon: '🔒',
      color: 'purple',
      items: [
        {
          question: 'How secure is my account?',
          answer: 'VonVault offers up to 7 layers of security. Each layer adds additional protection, and you can see your security level in the Security Hub.'
        },
        {
          question: 'What is Fort Knox encryption?',
          answer: 'Fort Knox is our client-side end-to-end encryption exclusive to Web3 users. Your personal data is encrypted on your device - even we cannot access it.'
        },
        {
          question: 'I lost access to my 2FA device. What do I do?',
          answer: 'Contact our support team immediately. If you have backup authentication methods set up, you can use those to regain access. This is why we recommend multiple security layers.'
        },
        {
          question: 'Can I change my security settings?',
          answer: 'Yes! Visit Profile → Security Hub to see all your security layers and upgrade them at any time. Higher security levels unlock better features.'
        }
      ]
    },
    {
      title: 'Investments & Staking',
      icon: '💰',
      color: 'green',
      items: [
        {
          question: 'What currencies can I stake?',
          answer: 'VonVault treasury accepts USDC and USDT for staking. Other cryptocurrencies must be swapped to stablecoins first using DEXs like Uniswap.'
        },
        {
          question: 'How does the staking process work?',
          answer: 'When you stake, funds transfer from your wallet to VonVault\'s secure treasury for institutional-grade management. You maintain visibility of your investment performance.'
        },
        {
          question: 'What happens to my crypto after I stake?',
          answer: 'Your crypto is converted to fiat and placed in bank deposit accounts for collateral. This provides institutional-grade security and insurance coverage.'
        },
        {
          question: 'When do I need authenticator confirmation?',
          answer: 'Authenticator confirmation (Layer 6) is required for high-value actions like staking. SMS 2FA (Layer 4) is used for login authentication.'
        }
      ]
    },
    {
      title: 'Verification & KYC',
      icon: '✅',
      color: 'orange',
      items: [
        {
          question: 'Why do I need to verify my email and phone?',
          answer: 'Email and phone verification (Layers 2-3) are required for Web2 users and recommended for Web3 users for account recovery and security alerts.'
        },
        {
          question: 'My verification is taking too long. What should I do?',
          answer: 'Email verification is usually instant. SMS can take up to 2 minutes. If you don\'t receive codes, check spam folders and ensure your carrier allows our messages.'
        },
        {
          question: 'Can I use VonVault without full verification?',
          answer: 'Web3 users can start with just wallet connection, but additional verification layers provide account recovery options and unlock higher features.'
        }
      ]
    },
    {
      title: 'Membership Tiers',
      icon: '⭐',
      color: 'amber',
      items: [
        {
          question: 'What are the different membership tiers?',
          answer: 'VonVault offers BASIC, CLUB, PREMIUM, VIP, and ELITE tiers. Higher tiers get faster support response times, higher limits, and exclusive features.'
        },
        {
          question: 'How do I upgrade my membership tier?',
          answer: 'Membership tiers are typically based on your investment amount and account activity. Contact our team for specific upgrade requirements.'
        },
        {
          question: 'What is the Elite Concierge Service?',
          answer: 'ELITE members get access to emergency hotline support via our Concierge Service for urgent security issues or account compromises.'
        }
      ]
    },
    {
      title: 'Technical Issues',
      icon: '⚙️',
      color: 'gray',
      items: [
        {
          question: 'The app is not loading properly. What should I do?',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. Ensure you have a stable internet connection.'
        },
        {
          question: 'My transaction is not showing up.',
          answer: 'Blockchain transactions can take 10-30 minutes to confirm depending on network congestion. Check the transaction hash on a blockchain explorer.'
        },
        {
          question: 'I can\'t connect my wallet.',
          answer: 'Ensure your wallet is unlocked and you\'re on the correct network. We support Ethereum, Polygon, and BNB Chain. Try refreshing and reconnecting.'
        }
      ]
    }
  ];

  const toggleExpanded = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
      purple: 'bg-purple-900/20 border-purple-500/30 text-purple-400',
      green: 'bg-green-900/20 border-green-500/30 text-green-400',
      orange: 'bg-orange-900/20 border-orange-500/30 text-orange-400',
      amber: 'bg-amber-900/20 border-amber-500/30 text-amber-400',
      gray: 'bg-gray-900/20 border-gray-500/30 text-gray-400'
    };
    return colors[color] || colors.gray;
  };

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
          
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FAQ
          </h1>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-2xl font-bold text-purple-400">7</div>
            <div className="text-xs text-gray-400">Security Layers</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-2xl font-bold text-green-400">24/7</div>
            <div className="text-xs text-gray-400">Support</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 text-center">
            <div className="text-2xl font-bold text-blue-400">50+</div>
            <div className="text-xs text-gray-400">Answers</div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-4 mb-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className={`p-4 ${getColorClasses(category.color)}`}>
                <h3 className="text-lg font-bold flex items-center">
                  <span className="mr-3 text-2xl">{category.icon}</span>
                  {category.title}
                  <span className="ml-auto text-sm opacity-70">
                    {category.items.length} questions
                  </span>
                </h3>
              </div>
              
              <div className="divide-y divide-gray-800">
                {category.items.map((item, itemIndex) => {
                  const isExpanded = expandedItems[`${categoryIndex}-${itemIndex}`];
                  return (
                    <div key={itemIndex} className="p-4 hover:bg-gray-800/30 transition-colors">
                      <button
                        onClick={() => toggleExpanded(categoryIndex, itemIndex)}
                        className="w-full text-left flex items-center justify-between"
                      >
                        <span className="text-white font-medium pr-4">{item.question}</span>
                        <span className={`text-gray-400 transform transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}>
                          ▼
                        </span>
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-700">
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-700/50 rounded-xl p-6">
          <div className="text-center">
            <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
            <p className="text-gray-300 text-sm mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => onBack?.('create-ticket')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-all"
              >
                Create Support Ticket
              </button>
              <button 
                onClick={() => onBack?.('my-tickets')}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
              >
                My Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info for VIP/Elite */}
        <div className="mt-4 bg-amber-900/20 border border-amber-600/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <span className="text-amber-400 text-lg">👑</span>
            <div>
              <h4 className="text-amber-400 font-medium mb-1">VIP & Elite Support</h4>
              <p className="text-amber-200 text-xs">
                VIP members get priority support. ELITE members have access to emergency Concierge Service for urgent issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQScreen;
