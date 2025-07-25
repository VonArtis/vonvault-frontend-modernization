import React from 'react';
import { tokens } from '../../styles/tokens';

export interface WalletData {
  id: string;
  name: string;
  address: string;
  balance: string;
  usdValue: string;
  icon: string;
  chainId: number;
  status: 'connected' | 'connecting' | 'disconnected';
  connectedAt: string;
  gradient: keyof typeof walletGradients;
  border: keyof typeof walletBorders;
}

export interface WalletCardProps {
  wallet: WalletData;
  type: 'primary' | 'reserve';
  compact?: boolean;
  onSwitch?: () => void;
  onDisconnect?: (type: 'primary' | 'reserve') => void;
  onReplace?: (type: 'primary' | 'reserve') => void;
  loading?: boolean;
}

// Predefined wallet styling
const walletGradients = {
  metamask: tokens.gradients.cards.wallet.metamask,
  trust: tokens.gradients.cards.wallet.trust,
  coinbase: tokens.gradients.cards.wallet.coinbase,
  universal: tokens.gradients.cards.wallet.universal,
} as const;

const walletBorders = {
  metamask: tokens.borders.colors.orange,
  trust: tokens.borders.colors.cyan,
  coinbase: tokens.borders.colors.blue,
  universal: tokens.borders.colors.purple,
} as const;

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  type,
  compact = false,
  onSwitch,
  onDisconnect,
  onReplace,
  loading = false
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    switch (wallet.status) {
      case 'connected':
        return tokens.colors.status.success;
      case 'connecting':
        return tokens.colors.status.warning;
      case 'disconnected':
        return tokens.colors.status.error;
      default:
        return tokens.colors.text.muted;
    }
  };

  const getStatusText = () => {
    switch (wallet.status) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-${tokens.animations.duration.normal}`}
      style={{
        background: walletGradients[wallet.gradient],
        borderColor: walletBorders[wallet.border],
        padding: compact ? tokens.spacing.lg : tokens.spacing.xl,
      }}
    >
      {/* Wallet Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{wallet.icon}</span>
          <div>
            <h3 
              className="font-bold text-white"
              style={{ fontSize: compact ? tokens.typography.fontSize.sm : tokens.typography.fontSize.lg }}
            >
              {wallet.name}
            </h3>
            <span 
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                backgroundColor: type === 'primary' 
                  ? `${tokens.colors.brand.primary}30` 
                  : `${tokens.colors.semantic.blue}30`,
                color: type === 'primary' 
                  ? tokens.colors.brand.secondary 
                  : tokens.colors.semantic.blue,
              }}
            >
              {type === 'primary' ? 'PRIMARY' : 'RESERVE'}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: getStatusColor(),
              animation: wallet.status === 'connected' ? 'pulse 2s infinite' : 'none'
            }}
          ></div>
          <span 
            className="text-xs ml-2"
            style={{ color: getStatusColor() }}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Wallet Details */}
      {!compact && (
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span 
              className="text-sm"
              style={{ color: tokens.colors.text.tertiary }}
            >
              Balance
            </span>
            <div className="text-right">
              <p 
                className="font-semibold"
                style={{ color: tokens.colors.text.primary }}
              >
                {wallet.balance}
              </p>
              <p 
                className="text-sm"
                style={{ color: tokens.colors.text.secondary }}
              >
                {wallet.usdValue}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span 
              className="text-sm"
              style={{ color: tokens.colors.text.tertiary }}
            >
              Address
            </span>
            <span 
              className="font-mono text-sm"
              style={{ 
                color: tokens.colors.text.primary,
                fontFamily: tokens.typography.fontFamily.mono.join(', ')
              }}
            >
              {formatAddress(wallet.address)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span 
              className="text-sm"
              style={{ color: tokens.colors.text.tertiary }}
            >
              Network
            </span>
            <span 
              className="text-sm"
              style={{ color: tokens.colors.status.success }}
            >
              {wallet.chainId === 1 ? 'Ethereum' : `Chain ${wallet.chainId}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span 
              className="text-sm"
              style={{ color: tokens.colors.text.tertiary }}
            >
              Connected
            </span>
            <span 
              className="text-sm"
              style={{ color: tokens.colors.text.secondary }}
            >
              {formatDate(wallet.connectedAt)}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {type === 'reserve' && onSwitch && (
          <button
            onClick={onSwitch}
            disabled={loading}
            className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: `${tokens.colors.brand.primary}20`,
              color: tokens.colors.brand.secondary,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = `${tokens.colors.brand.primary}30`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${tokens.colors.brand.primary}20`;
            }}
          >
            Make Primary
          </button>
        )}
        {onReplace && (
          <button
            onClick={() => onReplace(type)}
            disabled={loading}
            className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: `${tokens.colors.semantic.blue}20`,
              color: tokens.colors.semantic.blue,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = `${tokens.colors.semantic.blue}30`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${tokens.colors.semantic.blue}20`;
            }}
          >
            Replace
          </button>
        )}
        {onDisconnect && (
          <button
            onClick={() => onDisconnect(type)}
            disabled={loading}
            className="py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50"
            style={{
              backgroundColor: `${tokens.colors.status.error}20`,
              color: tokens.colors.status.error,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = `${tokens.colors.status.error}30`;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${tokens.colors.status.error}20`;
            }}
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
};
