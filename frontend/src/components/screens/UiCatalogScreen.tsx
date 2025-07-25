import React, { useState } from 'react';

// Tooltip Component for Interactive Examples
const TooltipTab = ({ icon, title, tooltip, size = "default" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const sizeClasses = size === "large" 
    ? "p-4 text-center" 
    : "p-3 text-center";

  return (
    <div className="relative">
      <div
        className={`bg-gray-800/50 border border-gray-700 rounded-lg ${sizeClasses} cursor-help hover:bg-gray-700/50 transition-all`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="text-2xl mb-2">{icon}</div>
        <p className="text-xs text-gray-300 font-medium">{title}</p>
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-64">
          <div className="bg-white text-gray-900 text-sm p-3 rounded-lg shadow-xl border border-gray-200 relative">
            <p>{tooltip}</p>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  );
};

// VonVault Logo Component
const VonVaultLogo = ({ size = 64, showGradient = true }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" className="flex-shrink-0">
    {showGradient && (
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    )}
    <circle cx="100" cy="100" r="100" fill="#000000"/>
    <circle 
      cx="100" 
      cy="100" 
      r="85" 
      fill="none" 
      stroke={showGradient ? "url(#logoGradient)" : "#8B5CF6"} 
      strokeWidth="8"
    />
    <path 
      d="M 65 65 L 100 135 L 135 65" 
      fill="none" 
      stroke={showGradient ? "url(#logoGradient)" : "#8B5CF6"} 
      strokeWidth="16" 
      strokeLinecap="square" 
      strokeLinejoin="miter"
    />
  </svg>
);

// Wallet Card Component
const WalletCard = ({ wallet, type, compact = false }) => (
  <div className={`bg-gradient-to-br ${wallet.gradient} border ${wallet.border} rounded-xl ${compact ? 'p-4' : 'p-6'} relative overflow-hidden`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{wallet.icon}</span>
        <div>
          <h3 className={`font-bold text-white ${compact ? 'text-sm' : 'text-lg'}`}>{wallet.name}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            type === 'primary' 
              ? 'bg-purple-600/30 text-purple-300' 
              : 'bg-blue-600/30 text-blue-300'
          }`}>
            {type === 'primary' ? 'PRIMARY' : 'RESERVE'}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-400 text-xs ml-2">Connected</span>
      </div>
    </div>

    {!compact && (
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Balance</span>
          <div className="text-right">
            <p className="text-white font-semibold">{wallet.balance}</p>
            <p className="text-gray-300 text-sm">{wallet.usdValue}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">Address</span>
          <span className="text-white font-mono text-sm">{wallet.address}</span>
        </div>
      </div>
    )}
  </div>
);

// Analytics Card Component  
const AnalyticsCard = ({ title, value, subtitle, icon, color = "purple" }) => {
  const colorClasses = {
    purple: "bg-purple-600/20 text-purple-400",
    green: "bg-green-600/20 text-green-400", 
    blue: "bg-blue-600/20 text-blue-400",
    amber: "bg-amber-600/20 text-amber-400"
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="flex items-center mb-3">
        <div className={`w-10 h-10 ${colorClasses[color]} rounded-xl flex items-center justify-center mr-3`}>
          <span className={colorClasses[color].split(' ')[1]}>{icon}</span>
        </div>
        <span className="text-sm text-gray-400">{title}</span>
      </div>
      <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[1]}`}>
        {value}
      </p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

interface UiCatalogScreenProps {
  onBack?: () => void;
  onNavigate?: (screen: string) => void;
}

const UiCatalogScreen: React.FC<UiCatalogScreenProps> = ({ onBack, onNavigate }) => {
  const [activeButton, setActiveButton] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mock wallet data
  const mockWallet = {
    name: 'MetaMask',
    address: '0x742d...1234',
    balance: '2.5847 ETH',
    usdValue: '$4,250.32',
    icon: '🦊',
    gradient: 'from-orange-600/20 to-yellow-600/10',
    border: 'border-orange-500/30'
  };

  const handleLoadingDemo = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <span className="text-xl">←</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <VonVaultLogo size={32} />
            <h1 className="text-xl font-bold text-white">UI Catalog</h1>
          </div>
          
          <button className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-xl font-medium text-sm hover:bg-purple-700 transition-all">
            <span className="mr-1">🎨</span>
            Export
          </button>
        </div>
      </div>

      <div className="px-6 space-y-8 py-6">
        {/* VonVault Logo Showcase */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">VonVault Logo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <VonVaultLogo size={80} showGradient={true} />
              <p className="text-sm text-gray-400 mt-3">Gradient Version</p>
              <p className="text-xs text-gray-500">Primary brand usage</p>
            </div>
            <div className="text-center">
              <VonVaultLogo size={80} showGradient={false} />
              <p className="text-sm text-gray-400 mt-3">Solid Version</p>
              <p className="text-xs text-gray-500">Single color contexts</p>
            </div>
            <div className="text-center bg-white rounded-lg p-4">
              <VonVaultLogo size={80} showGradient={true} />
              <p className="text-sm text-gray-600 mt-3">On Light Background</p>
              <p className="text-xs text-gray-500">Marketing materials</p>
            </div>
          </div>
        </div>

        {/* Premium Buttons */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Premium Buttons</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Primary Action
              </button>
              
              <button className="w-full bg-gray-800 text-gray-300 py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-all border border-gray-700">
                Secondary Action
              </button>
              
              <button 
                onClick={handleLoadingDemo}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Demo Loading State'
                )}
              </button>
              
              <button className="w-full bg-red-600/20 text-red-400 py-3 px-6 rounded-xl font-semibold hover:bg-red-600/30 transition-all border border-red-500/50">
                Destructive Action
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Wallet Cards */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Wallet Connection Cards</h2>
          <div className="space-y-4">
            <WalletCard wallet={mockWallet} type="primary" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WalletCard wallet={{...mockWallet, name: 'Trust Wallet', icon: '🛡️'}} type="reserve" compact />
              <WalletCard wallet={{...mockWallet, name: 'Coinbase', icon: '💎'}} type="primary" compact />
            </div>
          </div>
        </div>

        {/* Analytics Dashboard Cards */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Analytics Cards</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnalyticsCard
              title="Total Staked"
              value="$75,500"
              subtitle="Working Capital"
              icon="💰"
              color="purple"
            />
            <AnalyticsCard
              title="Total Earned"
              value="+$8,240"
              subtitle="$945/month"
              icon="📈"
              color="green"
            />
            <AnalyticsCard
              title="Average APY"
              value="15%"
              subtitle="Weighted average"
              icon="📊"
              color="blue"
            />
            <AnalyticsCard
              title="Projected Annual"
              value="$14,940"
              subtitle="Based on current APY"
              icon="🚀"
              color="amber"
            />
          </div>
        </div>

        {/* Interactive Tooltips System */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Educational Tooltip System</h2>
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-medium mb-4 flex items-center">
              <span className="mr-2">📚</span>
              Hover for Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <TooltipTab
                icon="💰"
                title="USDC/USDT Only"
                tooltip="VonVault treasury only accepts USDC and USDT for staking. ETH and other tokens must be swapped first using DEXs like Uniswap."
              />
              <TooltipTab
                icon="🏦"
                title="Treasury Transfer"
                tooltip="When you stake, funds transfer from your wallet to VonVault's secure treasury wallet for institutional-grade management and insurance."
              />
              <TooltipTab
                icon="🌐"
                title="Multi-Network"
                tooltip="Supported on Ethereum, Polygon, and BNB Chain. Network fees vary by congestion. Users are responsible for their own gas fees for wallet transactions."
              />
              <TooltipTab
                icon="📊"
                title="Balance Display"
                tooltip="Your wallet shows total balance in preferred currency. Only USDC/USDT portions are stakeable. Check your stablecoin balance before staking."
              />
            </div>
          </div>
        </div>

        {/* Gradient Card Variations */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Gradient Card System</h2>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 border border-purple-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-purple-400 text-xl mr-3">✓</span>
                  <div>
                    <p className="text-purple-400 font-semibold text-lg">Success State</p>
                    <p className="text-sm text-gray-300">Operation completed successfully</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-400">100%</p>
                  <p className="text-xs text-gray-400">Complete</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-green-400 text-xl mr-3">💰</span>
                  <div>
                    <p className="text-green-400 font-semibold text-lg">Fee Savings</p>
                    <p className="text-sm text-gray-300">Only 0.75% fee vs industry average</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">92%</p>
                  <p className="text-xs text-gray-400">Savings</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-900/30 to-orange-800/20 border border-amber-700/50 rounded-xl p-4">
              <div className="flex items-center">
                <span className="text-amber-400 text-xl mr-3">⚠️</span>
                <div>
                  <p className="text-amber-400 font-semibold">Important Notice</p>
                  <p className="text-sm text-amber-300">Gas fees are user responsibility across all networks</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Elements */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Advanced Form Elements</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Premium Input</label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter text with purple focus..."
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">Password with Visibility</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter password..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Error State</label>
              <input
                className="w-full bg-gray-800 border border-red-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                placeholder="Field with error state"
              />
              <p className="text-red-400 text-xs mt-1">This field is required</p>
            </div>
          </div>
        </div>

        {/* Status Indicators & Badges */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Status Indicators & Badges</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Connection Status</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-green-900/20 border border-green-500/30 rounded-lg px-3 py-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm">Connected</span>
                </div>
                <div className="flex items-center space-x-2 bg-yellow-900/20 border border-yellow-500/30 rounded-lg px-3 py-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-400 text-sm">Connecting</span>
                </div>
                <div className="flex items-center space-x-2 bg-red-900/20 border border-red-500/30 rounded-lg px-3 py-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-400 text-sm">Disconnected</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-3">Tier Badges</h3>
              <div className="flex flex-wrap gap-3">
                <span className="bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">PRIMARY</span>
                <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">RESERVE</span>
                <span className="bg-amber-600/30 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">VIP</span>
                <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm font-medium">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal System */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Modal System</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all"
          >
            Open Demo Modal
          </button>
        </div>

        {/* Navigation Components */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Navigation Elements</h2>
          <div className="space-y-4">
            <div className="bg-black border border-gray-800 rounded-xl p-4">
              <h3 className="text-gray-300 mb-3">Bottom Navigation Preview</h3>
              <div className="flex items-center justify-around h-16">
                {['🏠', '🔒', '💳', '📊', '👤'].map((icon, index) => {
                  const labels = ['Home', 'Staking', 'Wallets', 'Portfolio', 'Profile'];
                  const isActive = index === 2;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center transition-all ${
                        isActive ? 'text-purple-400' : 'text-gray-500'
                      }`}
                    >
                      <div className={`text-2xl mb-1 transition-transform ${
                        isActive ? 'scale-110' : 'scale-100'
                      }`}>
                        {icon}
                      </div>
                      <div className="text-xs font-medium">{labels[index]}</div>
                      {isActive && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-400 rounded-b-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Loading States */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-6">Loading States</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-300 text-sm">Button Loading</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center space-x-1 mb-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <p className="text-gray-300 text-sm">Dots Loading</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mx-auto mb-3"></div>
              <p className="text-gray-300 text-sm">Status Indicator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Premium Modal</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              This is an example of VonVault's premium modal system with proper backdrop, animations, and accessibility.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-all"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UiCatalogScreen;
