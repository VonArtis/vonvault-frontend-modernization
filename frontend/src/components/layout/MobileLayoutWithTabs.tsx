import React from 'react';
import LockedBottomTabs from '../screens/LockedBottomNavigationScreen.V1';

interface MobileLayoutWithTabsProps {
  children: React.ReactNode;
  onNavigate?: (screen: string) => void;
  showTabs?: boolean;
  currentScreen?: string;
  className?: string;
  securityComplete?: boolean; // New prop for security lock
}

export const MobileLayoutWithTabs: React.FC<MobileLayoutWithTabsProps> = ({ 
  children,
  onNavigate,
  showTabs = true,
  currentScreen,
  className = '',
  securityComplete = false
}) => {
  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Main content area */}
      <div className={`w-full px-4 pb-8 pt-4 space-y-6 ${showTabs ? 'pb-20' : 'pb-8'} ${className}`}>
        {children}
      </div>
      
      {/* Bottom tabs navigation with security lock */}
      {showTabs && (
        <LockedBottomTabs 
          onNavigate={onNavigate} 
          currentScreen={currentScreen}
          securityComplete={securityComplete}
        />
      )}
    </div>
  );
};