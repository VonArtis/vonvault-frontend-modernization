import React from 'react';

interface VonVaultTierLogoProps {
  tier: 'BASIC' | 'CLUB' | 'PREMIUM' | 'VIP' | 'ELITE';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const VonVaultTierLogo: React.FC<VonVaultTierLogoProps> = ({ 
  tier, 
  size = 'medium', 
  className = '' 
}) => {
  const tierConfigs = {
    BASIC: {
      letterColor: '#9CA3AF', // Gray
      backgroundColor: '#000000', // Black
    },
    CLUB: {
      letterColor: '#EF4444', // Red
      backgroundColor: '#000000', // Black
    },
    PREMIUM: {
      letterColor: '#E5E7EB', // Silver
      backgroundColor: '#000000', // Black
    },
    VIP: {
      letterColor: '#F59E0B', // Gold
      backgroundColor: '#000000', // Black
    },
    ELITE: {
      letterColor: '#000000', // Black
      backgroundColor: '#F59E0B', // Gold
    }
  };

  const sizeConfig = {
    small: { container: 'w-8 h-8', svg: '20' },
    medium: { container: 'w-12 h-12', svg: '32' },
    large: { container: 'w-16 h-16', svg: '48' }
  };

  const config = tierConfigs[tier];
  const sizes = sizeConfig[size];

  return (
    <div className={`${sizes.container} rounded-full flex items-center justify-center border border-gray-700 ${className}`}>
      <div 
        className="w-full h-full rounded-full flex items-center justify-center"
        style={{ backgroundColor: config.backgroundColor }}
      >
        {/* VonVault V Logo */}
        <svg width={sizes.svg} height={sizes.svg} viewBox="0 0 200 200" className="relative z-10">
          {/* Outer circle border */}
          <circle 
            cx="100" 
            cy="100" 
            r="85" 
            fill="none" 
            stroke={config.letterColor} 
            strokeWidth="8"
          />
          {/* The V shape */}
          <path 
            d="M 65 65 L 100 135 L 135 65" 
            fill="none" 
            stroke={config.letterColor} 
            strokeWidth="16" 
            strokeLinecap="square" 
            strokeLinejoin="miter"
          />
        </svg>
      </div>
    </div>
  );
};

export default VonVaultTierLogo;