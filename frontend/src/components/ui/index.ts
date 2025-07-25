// /src/components/ui/index.ts
// VonVault UI Component Library - Main Export File

// Design Tokens
export { tokens } from '../../styles/tokens';
export type { 
  TokenColors, 
  TokenGradients, 
  TokenSpacing, 
  TokenTypography 
} from '../../styles/tokens';

// Core Components
export { VonVaultButton } from './VonVaultButton';
export type { VonVaultButtonProps } from './VonVaultButton';

export { WalletCard } from './WalletCard';
export type { WalletCardProps, WalletData } from './WalletCard';

export { 
  TooltipTab,
  AnalyticsCard,
  GradientCard,
  StatusBadge,
  VonVaultLogo
} from './VonVaultComponents';
export type {
  TooltipTabProps,
  AnalyticsCardProps,
  GradientCardProps,
  StatusBadgeProps,
  VonVaultLogoProps
} from './VonVaultComponents';

// Helper Functions
export { getGradient, getBorder, getCardStyle } from '../../styles/tokens';

// Usage Examples and Documentation
export const VonVaultUIGuide = {
  // Button Usage
  button: {
    example: `
    import { VonVaultButton } from '@/components/ui';
    
    <VonVaultButton 
      variant="primary" 
      size="lg" 
      loading={isLoading}
      onClick={handleClick}
    >
      Connect Wallet
    </VonVaultButton>
    `,
    variants: ['primary', 'secondary', 'outline', 'destructive', 'success'],
    sizes: ['sm', 'md', 'lg', 'xl']
  },

  // Wallet Card Usage
  walletCard: {
    example: `
    import { WalletCard } from '@/components/ui';
    
    <WalletCard
      wallet={walletData}
      type="primary"
      onSwitch={handleSwitch}
      onDisconnect={handleDisconnect}
      onReplace={handleReplace}
    />
    `,
    types: ['primary', 'reserve']
  },

  // Analytics Card Usage
  analyticsCard: {
    example: `
    import { AnalyticsCard } from '@/components/ui';
    
    <AnalyticsCard
      title="Total Staked"
      value="$75,500"
      subtitle="Working Capital"
      icon="💰"
      color="purple"
      trend="up"
      trendValue="+12.5%"
    />
    `,
    colors: ['purple', 'green', 'blue', 'amber', 'red'],
    trends: ['up', 'down', 'neutral']
  },

  // Tooltip Tab Usage
  tooltipTab: {
    example: `
    import { TooltipTab } from '@/components/ui';
    
    <TooltipTab
      icon="💰"
      title="USDC/USDT Only"
      tooltip="VonVault treasury only accepts USDC and USDT for staking..."
    />
    `
  },

  // Gradient Card Usage
  gradientCard: {
    example: `
    import { GradientCard } from '@/components/ui';
    
    <GradientCard variant="success">
      <div className="flex items-center justify-between">
        <span className="text-green-400">✓ Success</span>
        <span className="text-2xl font-bold">100%</span>
      </div>
    </GradientCard>
    `,
    variants: ['success', 'warning', 'error', 'info', 'purple', 'blue']
  },

  // Status Badge Usage
  statusBadge: {
    example: `
    import { StatusBadge } from '@/components/ui';
    
    <StatusBadge 
      status="connected" 
      size="md" 
      animated={true} 
    />
    `,
    statuses: ['connected', 'connecting', 'disconnected', 'primary', 'reserve', 'active', 'inactive']
  },

  // Logo Usage
  logo: {
    example: `
    import { VonVaultLogo } from '@/components/ui';
    
    <VonVaultLogo 
      size={64} 
      showGradient={true} 
    />
    `
  },

  // Design Tokens Usage
  tokens: {
    example: `
    import { tokens } from '@/components/ui';
    
    // Use colors
    style={{ color: tokens.colors.brand.primary }}
    
    // Use gradients
    style={{ background: tokens.gradients.cards.status.success }}
    
    // Use spacing
    style={{ padding: tokens.spacing.lg }}
    
    // Use typography
    style={{ fontSize: tokens.typography.fontSize.xl }}
    `
  }
};

// Quick Start Templates
export const VonVaultTemplates = {
  // Wallet Connection Card Template
  walletConnectionCard: `
    <GradientCard variant="purple">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-purple-400 text-xl mr-3">🔗</span>
          <div>
            <p className="text-purple-400 font-semibold text-lg">Multi-Wallet Setup</p>
            <p className="text-sm text-gray-300">Connect primary and reserve wallets</p>
          </div>
        </div>
        <StatusBadge status="connected" />
      </div>
    </GradientCard>
  `,

  // Educational Section Template
  educationalSection: `
    <div className="grid grid-cols-2 gap-3">
      <TooltipTab
        icon="💰"
        title="USDC/USDT Only"
        tooltip="VonVault treasury only accepts USDC and USDT for staking..."
      />
      <TooltipTab
        icon="🏦"
        title="Treasury Transfer"
        tooltip="When you stake, funds transfer to VonVault's secure treasury..."
      />
    </div>
  `,

  // Analytics Dashboard Template
  analyticsDashboard: `
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <AnalyticsCard
        title="Total Staked"
        value="$75,500"
        icon="💰"
        color="purple"
      />
      <AnalyticsCard
        title="Total Earned"
        value="+$8,240"
        icon="📈"
        color="green"
        trend="up"
        trendValue="+12.5%"
      />
    </div>
  `,

  // Action Buttons Template
  actionButtons: `
    <div className="flex space-x-4">
      <VonVaultButton variant="primary" size="lg">
        Primary Action
      </VonVaultButton>
      <VonVaultButton variant="outline" size="lg">
        Secondary Action
      </VonVaultButton>
    </div>
  `
};

// Component Composition Examples
export const VonVaultCompositions = {
  // Complete Wallet Management Section
  walletManagementSection: `
    // Full wallet management with all components
    <div className="space-y-6">
      <GradientCard variant="purple">
        <div className="flex items-center justify-between">
          <VonVaultLogo size={32} />
          <StatusBadge status="connected" />
        </div>
      </GradientCard>
      
      <WalletCard
        wallet={primaryWallet}
        type="primary"
        onSwitch={handleSwitch}
        onDisconnect={handleDisconnect}
      />
      
      <div className="grid grid-cols-2 gap-3">
        <TooltipTab icon="💰" title="USDC/USDT" tooltip="..." />
        <TooltipTab icon="🏦" title="Treasury" tooltip="..." />
      </div>
      
      <VonVaultButton variant="primary" fullWidth>
        Connect Reserve Wallet
      </VonVaultButton>
    </div>
  `
};

// Development Guidelines
export const VonVaultGuidelines = {
  consistency: "Always use design tokens instead of hardcoded values",
  accessibility: "Include proper ARIA labels and semantic HTML",
  responsive: "Components are mobile-first responsive by default",
  performance: "Use React.memo for expensive components",
  testing: "Each component should have corresponding test files",
  documentation: "Update this guide when adding new components"
};
