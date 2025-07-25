import React from 'react';

const VonVaultTierAvatars = () => {
  const tiers = [
    {
      name: 'BASIC',
      letterColor: '#9CA3AF', // Gray
      backgroundColor: '#000000', // Black
      description: 'Gray V on Black background'
    },
    {
      name: 'CLUB', 
      letterColor: '#EF4444', // Red
      backgroundColor: '#000000', // Black
      description: 'Red V on Black background'
    },
    {
      name: 'PREMIUM',
      letterColor: '#E5E7EB', // Silver
      backgroundColor: '#000000', // Black  
      description: 'Silver V on Black background'
    },
    {
      name: 'VIP',
      letterColor: '#F59E0B', // Gold
      backgroundColor: '#000000', // Black
      description: 'Gold V on Black background'
    },
    {
      name: 'ELITE',
      letterColor: '#000000', // Black
      backgroundColor: '#F59E0B', // Gold
      description: 'Black V on Gold background'
    }
  ];

  const createVonVaultAvatar = (letterColor, backgroundColor) => {
    return (
      <div className="w-32 h-32 rounded-full flex items-center justify-center relative border border-gray-700">
        <div 
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{ backgroundColor }}
        >
          {/* VonVault V Logo */}
          <svg width="80" height="80" viewBox="0 0 200 200" className="relative z-10">
            {/* Outer circle border */}
            <circle 
              cx="100" 
              cy="100" 
              r="85" 
              fill="none" 
              stroke={letterColor} 
              strokeWidth="8"
            />
            {/* The V shape */}
            <path 
              d="M 65 65 L 100 135 L 135 65" 
              fill="none" 
              stroke={letterColor} 
              strokeWidth="16" 
              strokeLinecap="square" 
              strokeLinejoin="miter"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-400">
        VonVault Tier Avatars
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div key={tier.name} className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
            <div className="flex justify-center mb-4">
              {createVonVaultAvatar(tier.letterColor, tier.backgroundColor)}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
            <p className="text-purple-400 font-medium mb-1">VonVault Logo</p>
            <p className="text-gray-400 text-sm">{tier.description}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Tier Design System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="text-purple-400 font-semibold mb-2">Color Progression:</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• <span className="text-gray-400">BASIC:</span> Gray (starter tier)</li>
              <li>• <span className="text-red-400">CLUB:</span> Red (energy, growth)</li>
              <li>• <span className="text-gray-200">PREMIUM:</span> Silver (premium quality)</li>
              <li>• <span className="text-yellow-400">VIP:</span> Gold (luxury status)</li>
              <li>• <span className="text-yellow-600">ELITE:</span> Inverted (ultimate prestige)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-purple-400 font-semibold mb-2">Benefits:</h3>
            <ul className="text-gray-300 space-y-1">
              <li>• Instantly recognizable VonVault branding</li>
              <li>• Clean, professional appearance</li>
              <li>• Perfect circle fill</li>
              <li>• Clear tier hierarchy</li>
              <li>• Scalable SVG graphics</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 rounded-xl p-6 border border-gray-800 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-4">Size Comparison</h2>
        <div className="flex items-center justify-center space-x-6">
          <div className="text-center">
            <div className="mb-2">{createVonVaultAvatar('#F59E0B', '#000000')}</div>
            <p className="text-xs text-gray-400">Large (128px)</p>
          </div>
          <div className="text-center">
            <div className="mb-2 scale-75">{createVonVaultAvatar('#F59E0B', '#000000')}</div>
            <p className="text-xs text-gray-400">Medium (96px)</p>
          </div>
          <div className="text-center">
            <div className="mb-2 scale-50">{createVonVaultAvatar('#F59E0B', '#000000')}</div>
            <p className="text-xs text-gray-400">Small (64px)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VonVaultTierAvatars;
