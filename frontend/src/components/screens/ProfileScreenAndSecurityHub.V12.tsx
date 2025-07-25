import React, { useState } from 'react';

const ProfileScreen = ({ onNavigate }) => {
  // Mock user data with verification status
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    membershipTier: 'VIP',
    joinDate: '2023-01-15',
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: true
  };

  const settings = {
    notifications: { enabled: true, supported: true },
    biometric: { enabled: false, supported: true, available: true, setup: false },
    theme: 'dark'
  };

  // Mock security progress (would come from actual user data)
  const securityProgress = {
    completedLayers: 3,
    totalLayers: 7,
    isWeb3User: true
  };

  // State declarations
  const [showBiometricSetup, setShowBiometricSetup] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [showSimpleMode, setShowSimpleMode] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone
  });

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 
    'Hindi', 'Turkish', 'Polish'
  ];

  // VonVault tier avatars
  const createVonVaultAvatar = (tier) => {
    const tierConfig = {
      'BASIC': { letterColor: '#9CA3AF', backgroundColor: '#000000' },
      'CLUB': { letterColor: '#EF4444', backgroundColor: '#000000' },
      'PREMIUM': { letterColor: '#E5E7EB', backgroundColor: '#000000' },
      'VIP': { letterColor: '#F59E0B', backgroundColor: '#000000' },
      'ELITE': { letterColor: '#000000', backgroundColor: '#F59E0B' }
    };

    const config = tierConfig[tier] || tierConfig['BASIC'];

    return (
      <div className="w-20 h-20 rounded-full flex items-center justify-center relative border border-gray-700">
        <div 
          className="w-full h-full rounded-full flex items-center justify-center"
          style={{ backgroundColor: config.backgroundColor }}
        >
          <svg width="50" height="50" viewBox="0 0 200 200" className="relative z-10">
            <circle 
              cx="100" 
              cy="100" 
              r="85" 
              fill="none" 
              stroke={config.letterColor} 
              strokeWidth="8"
            />
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

  // Handlers
  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleNotificationToggle = () => {
    console.log('Toggle notifications');
  };

  const handleBiometricToggle = () => {
    if (!settings.biometric.setup) {
      setShowBiometricSetup(true);
      return;
    }
    console.log('Toggle biometric');
  };

  const handleBiometricSetup = () => {
    console.log('Setup biometric');
    setShowBiometricSetup(false);
  };

  const handleNavigation = (action) => {
    if (action === 'security-hub') {
      console.log('Navigating to Security Hub');
      onNavigate?.('security-hub');
    } else {
      console.log('Navigate to:', action);
    }
  };

  const handleSaveProfile = () => {
    console.log('Save profile:', editData);
    setIsEditMode(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone
    });
    setIsEditMode(false);
  };

  // Simple mode - essential settings only
  const simpleProfileSections = [
    {
      title: 'Account Status',
      items: [
        { label: 'Membership Tier', icon: '⭐', component: 'membership', value: userData.membershipTier }
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Create Ticket', icon: '🎫', action: 'create-ticket' },
        { label: 'My Tickets', icon: '📋', action: 'my-tickets' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Security Hub', icon: '🛡️', component: 'security-hub' },
        { label: 'Language', icon: '🌐', component: 'language' },
        { label: 'Notifications', icon: '🔔', component: 'notifications' },
        { label: '2FA Security', icon: '🔐', component: 'security', enabled: userData.twoFactorEnabled },
        { label: 'Biometric Auth', icon: '👆', component: 'biometric' }
      ]
    }
  ];

  // Detailed mode - all settings
  const detailedProfileSections = [
    {
      title: 'Account Status',
      items: [
        { label: 'Membership Tier', icon: '⭐', component: 'membership', value: userData.membershipTier }
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Create Ticket', icon: '🎫', action: 'create-ticket' },
        { label: 'My Tickets', icon: '📋', action: 'my-tickets' }
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Security Hub', icon: '🛡️', component: 'security-hub' },
        { label: 'Language', icon: '🌐', component: 'language' },
        { label: 'Notifications', icon: '🔔', component: 'notifications' },
        { label: '2FA Security', icon: '🔐', component: 'security', enabled: userData.twoFactorEnabled },
        { label: 'Biometric Auth', icon: '👆', component: 'biometric' },
        { label: 'Terms of Service', icon: '📄', action: 'terms-of-service' },
        { label: 'Privacy Policy', icon: '🔒', action: 'privacy-policy' }
      ]
    }
  ];

  const currentSections = showSimpleMode ? simpleProfileSections : detailedProfileSections;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            className="flex items-center justify-center w-11 h-11 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all"
            aria-label="Go back"
          >
            <span className="text-xl">←</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <svg width="32" height="32" viewBox="0 0 200 200" className="flex-shrink-0" aria-hidden="true">
              <circle cx="100" cy="100" r="100" fill="#000000"/>
              <circle cx="100" cy="100" r="85" fill="none" stroke="#8B5CF6" strokeWidth="8"/>
              <path d="M 65 65 L 100 135 L 135 65" 
                    fill="none" 
                    stroke="#8B5CF6" 
                    strokeWidth="16" 
                    strokeLinecap="square" 
                    strokeLinejoin="miter"/>
            </svg>
            <h1 className="text-xl font-bold text-white">Profile</h1>
          </div>
          
          <button 
            onClick={() => isEditMode ? handleSaveProfile() : setIsEditMode(true)}
            className={`flex items-center px-3 py-2 rounded-xl font-medium text-sm transition-all ${
              isEditMode 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            aria-label={isEditMode ? "Save changes" : "Edit profile"}
          >
            <span className="mr-1">{isEditMode ? '✓' : '✏️'}</span>
            {isEditMode ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="px-6 space-y-6 py-6">
        {/* User Profile Card */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center space-x-4">
            {createVonVaultAvatar(userData.membershipTier)}
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      placeholder="Last Name"
                    />
                  </div>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Email"
                  />
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    placeholder="Phone Number"
                  />
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {userData.firstName} {userData.lastName}
                  </h2>
                  <div className="space-y-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">{userData.email}</span>
                      {userData.emailVerified ? (
                        <span className="text-green-400 text-sm">✓ Verified</span>
                      ) : (
                        <span className="text-red-400 text-sm">⚠ Verify Now</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">{userData.phone}</span>
                      {userData.phoneVerified ? (
                        <span className="text-green-400 text-sm">✓ Verified</span>
                      ) : (
                        <span className="text-red-400 text-sm">⚠ Verify Now</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-purple-400 font-medium">{userData.membershipTier} Member</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Joined {new Date(userData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        {currentSections.map((section, index) => (
          <div key={index} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">{section.title}</h3>
            
            <div className="space-y-3">
              {section.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className={`p-3 rounded-lg transition-all cursor-pointer ${
                    item.component === 'security-hub' 
                      ? 'bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/30 hover:border-purple-400/50' 
                      : 'hover:bg-gray-800/50'
                  }`}
                  onClick={item.component === 'security-hub' ? () => handleNavigation('security-hub') : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        item.component === 'security-hub' 
                          ? 'bg-purple-700/50' 
                          : 'bg-gray-800'
                      }`}>
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <span className={`font-medium transition-all ${
                        item.component === 'security-hub' 
                          ? 'text-purple-200' 
                          : 'text-white'
                      }`}>{item.label}</span>
                    </div>
                    
                    {item.component === 'membership' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-purple-400 font-medium">{item.value}</span>
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      </div>
                    ) : item.component === 'security' ? (
                      <div className="flex items-center space-x-2">
                        {item.enabled ? (
                          <>
                            <span className="text-sm text-green-400">Enabled</span>
                            <span className="text-green-400">✓</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-red-400">Setup Now</span>
                            <span className="text-red-400">⚠</span>
                          </>
                        )}
                      </div>
                    ) : item.component === 'security-hub' ? (
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm text-purple-300 font-medium">
                            {securityProgress.completedLayers}/{securityProgress.totalLayers} Layers
                          </div>
                          <div className="text-xs text-purple-400">
                            {Math.round((securityProgress.completedLayers / securityProgress.totalLayers) * 100)}% Complete
                          </div>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 text-purple-300 rounded-lg">
                          <span className="text-sm">→</span>
                        </div>
                      </div>
                    ) : item.component === 'language' ? (
                      <div className="relative">
                        <button
                          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                          className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg text-sm hover:bg-gray-700 transition-all"
                        >
                          <span className="text-gray-300">{selectedLanguage}</span>
                          <span className="text-gray-400">▼</span>
                        </button>
                        
                        {showLanguageDropdown && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 max-h-48 overflow-y-auto">
                            {languages.map((lang) => (
                              <button
                                key={lang}
                                onClick={() => {
                                  setSelectedLanguage(lang);
                                  setShowLanguageDropdown(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-all ${
                                  selectedLanguage === lang ? 'text-purple-400 bg-gray-700' : 'text-gray-300'
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : item.component === 'notifications' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">Enabled</span>
                        <button
                          onClick={handleNotificationToggle}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-colors"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                        </button>
                      </div>
                    ) : item.component === 'biometric' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">
                          {settings.biometric.setup ? 'Enabled' : 'Setup'}
                        </span>
                        <button
                          onClick={handleBiometricToggle}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            settings.biometric.enabled ? 'bg-purple-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settings.biometric.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item.action)}
                        className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                      >
                        <span className="text-sm">→</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Section */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 p-3 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${!showSimpleMode ? 'text-white font-bold' : 'text-gray-400'}`}>
              Detailed Mode
            </span>
            
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showSimpleMode}
                onChange={(e) => setShowSimpleMode(e.target.checked)}
                className="sr-only"
                aria-label="Toggle between simple and detailed mode"
              />
              <div className="relative w-12 h-6 rounded-full transition-colors bg-purple-600">
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  showSimpleMode ? 'right-0.5' : 'left-0.5'
                }`}></div>
              </div>
            </label>
            
            <span className={`text-sm ${showSimpleMode ? 'text-white font-bold' : 'text-gray-400'}`}>
              Simple Mode
            </span>
          </div>
        </div>
      </div>

      {/* Biometric Setup Modal */}
      {showBiometricSetup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👆</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Setup Biometric Auth</h2>
              <p className="text-sm text-gray-400">
                Use your fingerprint or face to securely access your account and authorize transactions.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBiometricSetup}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-all"
              >
                Setup Biometric Auth
              </button>
              
              <button
                onClick={() => setShowBiometricSetup(false)}
                className="w-full border border-gray-700 text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Your biometric data stays secure on your device and is never shared.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileScreen;
