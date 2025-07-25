// Complete VonVault UI Components Library
// /src/components/ui/index.ts

import React, { useState } from 'react';
import { tokens } from '../../styles/tokens';

// ===== TOOLTIP TAB COMPONENT =====
export interface TooltipTabProps {
  icon: string;
  title: string;
  tooltip: string;
  size?: 'default' | 'large';
  disabled?: boolean;
}

export const TooltipTab: React.FC<TooltipTabProps> = ({ 
  icon, 
  title, 
  tooltip, 
  size = 'default',
  disabled = false 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const sizeClasses = size === 'large' 
    ? { padding: tokens.spacing.lg, textAlign: 'center' as const }
    : { padding: tokens.spacing.md, textAlign: 'center' as const };

  const baseStyles = {
    backgroundColor: `${tokens.colors.background.tertiary}50`,
    border: `${tokens.borders.width.thin} solid ${tokens.borders.colors.default}`,
    borderRadius: tokens.borders.radius.lg,
    cursor: disabled ? 'not-allowed' : 'help',
    transition: `all ${tokens.animations.duration.normal}`,
    opacity: disabled ? 0.5 : 1,
    ...sizeClasses,
  };

  const hoverStyles = !disabled ? {
    backgroundColor: `${tokens.colors.background.secondary}50`,
  } : {};

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={baseStyles}
        onMouseEnter={() => !disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onMouseOver={(e) => {
          if (!disabled) {
            Object.assign(e.currentTarget.style, hoverStyles);
          }
        }}
        onMouseOut={(e) => {
          Object.assign(e.currentTarget.style, baseStyles);
        }}
      >
        <div style={{ fontSize: tokens.typography.fontSize['2xl'], marginBottom: tokens.spacing.sm }}>
          {icon}
        </div>
        <p style={{ 
          fontSize: tokens.typography.fontSize.xs, 
          color: tokens.colors.text.secondary,
          fontWeight: tokens.typography.fontWeight.medium,
          margin: 0
        }}>
          {title}
        </p>
      </div>
      
      {/* Tooltip */}
      {showTooltip && !disabled && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: tokens.spacing.sm,
          zIndex: tokens.zIndex.tooltip,
          width: '16rem'
        }}>
          <div style={{
            backgroundColor: tokens.colors.text.primary,
            color: tokens.colors.background.primary,
            fontSize: tokens.typography.fontSize.sm,
            padding: tokens.spacing.md,
            borderRadius: tokens.borders.radius.lg,
            boxShadow: tokens.shadows.xl,
            border: `${tokens.borders.width.thin} solid ${tokens.borders.colors.default}`,
            position: 'relative'
          }}>
            <p style={{ margin: 0 }}>{tooltip}</p>
            {/* Arrow */}
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `4px solid ${tokens.colors.text.primary}`
            }}></div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== ANALYTICS CARD COMPONENT =====
export interface AnalyticsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color?: 'purple' | 'green' | 'blue' | 'amber' | 'red';
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  loading?: boolean;
  onClick?: () => void;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'purple',
  trend,
  trendValue,
  loading = false,
  onClick
}) => {
  const colorConfig = {
    purple: {
      bg: `${tokens.colors.brand.primary}20`,
      text: tokens.colors.brand.secondary,
      icon: tokens.colors.brand.primary
    },
    green: {
      bg: `${tokens.colors.status.success}20`,
      text: tokens.colors.status.success,
      icon: tokens.colors.status.success
    },
    blue: {
      bg: `${tokens.colors.semantic.blue}20`,
      text: tokens.colors.semantic.blue,
      icon: tokens.colors.semantic.blue
    },
    amber: {
      bg: `${tokens.colors.semantic.amber}20`,
      text: tokens.colors.semantic.amber,
      icon: tokens.colors.semantic.amber
    },
    red: {
      bg: `${tokens.colors.status.error}20`,
      text: tokens.colors.status.error,
      icon: tokens.colors.status.error
    }
  };

  const config = colorConfig[color];

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'neutral': return '→';
      default: return '';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return tokens.colors.status.success;
      case 'down': return tokens.colors.status.error;
      case 'neutral': return tokens.colors.text.tertiary;
      default: return tokens.colors.text.tertiary;
    }
  };

  const cardStyles = {
    backgroundColor: tokens.colors.background.secondary,
    borderRadius: tokens.borders.radius.xl,
    padding: tokens.components.card.padding.md,
    border: `${tokens.borders.width.thin} solid ${tokens.borders.colors.default}`,
    transition: `all ${tokens.animations.duration.normal}`,
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const handleClick = () => {
    if (onClick && !loading) {
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (onClick && !loading) {
      e.currentTarget.style.transform = `scale(${tokens.animations.scale.hover})`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (onClick) {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <div
      style={cardStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `${tokens.colors.background.secondary}80`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}>
          <div style={{
            width: tokens.icons.size.md,
            height: tokens.icons.size.md,
            border: `2px solid ${config.icon}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: tokens.spacing.md 
      }}>
        <div style={{
          width: tokens.icons.size.lg,
          height: tokens.icons.size.lg,
          backgroundColor: config.bg,
          borderRadius: tokens.borders.radius.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: tokens.spacing.md
        }}>
          <span style={{ 
            color: config.icon,
            fontSize: tokens.typography.fontSize.lg 
          }}>
            {icon}
          </span>
        </div>
        <span style={{ 
          fontSize: tokens.typography.fontSize.sm,
          color: tokens.colors.text.tertiary
        }}>
          {title}
        </span>
      </div>

      {/* Value */}
      <p style={{
        fontSize: tokens.typography.fontSize['2xl'],
        fontWeight: tokens.typography.fontWeight.bold,
        color: config.text,
        margin: 0,
        marginBottom: subtitle || trend ? tokens.spacing.xs : 0
      }}>
        {value}
      </p>

      {/* Subtitle and Trend */}
      {(subtitle || trend) && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {subtitle && (
            <p style={{
              fontSize: tokens.typography.fontSize.xs,
              color: tokens.colors.text.tertiary,
              margin: 0
            }}>
              {subtitle}
            </p>
          )}
          {trend && trendValue && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: tokens.typography.fontSize.xs
            }}>
              <span style={{ marginRight: tokens.spacing.xs }}>
                {getTrendIcon()}
              </span>
              <span style={{ color: getTrendColor() }}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ===== GRADIENT CARD COMPONENT =====
export interface GradientCardProps {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'error' | 'info' | 'purple' | 'blue';
  className?: string;
  onClick?: () => void;
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  variant,
  className = '',
  onClick
}) => {
  const variantStyles = {
    success: {
      background: tokens.gradients.cards.status.success,
      borderColor: tokens.borders.colors.green
    },
    warning: {
      background: tokens.gradients.cards.status.warning,
      borderColor: tokens.borders.colors.amber
    },
    error: {
      background: tokens.gradients.cards.status.error,
      borderColor: tokens.borders.colors.red
    },
    info: {
      background: tokens.gradients.cards.status.info,
      borderColor: tokens.borders.colors.blue
    },
    purple: {
      background: tokens.gradients.backgrounds.purple,
      borderColor: tokens.borders.colors.purple
    },
    blue: {
      background: tokens.gradients.backgrounds.blue,
      borderColor: tokens.borders.colors.blue
    }
  };

  const styles = variantStyles[variant];

  const cardStyles = {
    background: styles.background,
    border: `${tokens.borders.width.default} solid ${styles.borderColor}`,
    borderRadius: tokens.borders.radius.xl,
    padding: tokens.spacing.lg,
    transition: `all ${tokens.animations.duration.normal}`,
    cursor: onClick ? 'pointer' : 'default',
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (onClick) {
      e.currentTarget.style.transform = `scale(${tokens.animations.scale.hover})`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    if (onClick) {
      e.currentTarget.style.transform = 'scale(1)';
    }
  };

  return (
    <div
      style={cardStyles}
      className={className}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

// ===== STATUS BADGE COMPONENT =====
export interface StatusBadgeProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'primary' | 'reserve' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  animated = true
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          color: tokens.colors.status.success,
          backgroundColor: `${tokens.colors.status.success}20`,
          text: 'Connected',
          icon: '●'
        };
      case 'connecting':
        return {
          color: tokens.colors.status.warning,
          backgroundColor: `${tokens.colors.status.warning}20`,
          text: 'Connecting',
          icon: '●'
        };
      case 'disconnected':
        return {
          color: tokens.colors.status.error,
          backgroundColor: `${tokens.colors.status.error}20`,
          text: 'Disconnected',
          icon: '●'
        };
      case 'primary':
        return {
          color: tokens.colors.brand.secondary,
          backgroundColor: `${tokens.colors.brand.primary}30`,
          text: 'PRIMARY',
          icon: '★'
        };
      case 'reserve':
        return {
          color: tokens.colors.semantic.blue,
          backgroundColor: `${tokens.colors.semantic.blue}30`,
          text: 'RESERVE',
          icon: '◆'
        };
      case 'active':
        return {
          color: tokens.colors.status.success,
          backgroundColor: `${tokens.colors.status.success}30`,
          text: 'ACTIVE',
          icon: '✓'
        };
      case 'inactive':
        return {
          color: tokens.colors.text.tertiary,
          backgroundColor: `${tokens.colors.text.tertiary}30`,
          text: 'INACTIVE',
          icon: '○'
        };
      default:
        return {
          color: tokens.colors.text.tertiary,
          backgroundColor: `${tokens.colors.text.tertiary}30`,
          text: status.toUpperCase(),
          icon: '●'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          fontSize: tokens.typography.fontSize.xs,
          padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        };
      case 'md':
        return {
          fontSize: tokens.typography.fontSize.sm,
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        };
      case 'lg':
        return {
          fontSize: tokens.typography.fontSize.base,
          padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        };
      default:
        return {};
    }
  };

  const config = getStatusConfig();
  const sizeStyles = getSizeStyles();

  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: config.backgroundColor,
    color: config.color,
    borderRadius: tokens.borders.radius.full,
    fontWeight: tokens.typography.fontWeight.medium,
    ...sizeStyles,
  };

  const iconStyles = {
    marginRight: showIcon ? tokens.spacing.xs : 0,
    animation: animated && (status === 'connected' || status === 'connecting') ? 'pulse 2s infinite' : 'none'
  };

  return (
    <span style={badgeStyles}>
      {showIcon && (
        <span style={iconStyles}>
          {config.icon}
        </span>
      )}
      {config.text}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </span>
  );
};

// ===== VONVAULT LOGO COMPONENT =====
export interface VonVaultLogoProps {
  size?: number;
  showGradient?: boolean;
  className?: string;
}

export const VonVaultLogo: React.FC<VonVaultLogoProps> = ({ 
  size = 32, 
  showGradient = true,
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={`flex-shrink-0 ${className}`}
  >
    {showGradient && (
      <defs>
        <linearGradient id={`logoGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
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
      stroke={showGradient ? `url(#logoGradient-${size})` : tokens.colors.brand.primary} 
      strokeWidth="8"
    />
    <path 
      d="M 65 65 L 100 135 L 135 65" 
      fill="none" 
      stroke={showGradient ? `url(#logoGradient-${size})` : tokens.colors.brand.primary} 
      strokeWidth="16" 
      strokeLinecap="square" 
      strokeLinejoin="miter"
    />
  </svg>
);

// Export all components
export {
  // Re-export from separate files if needed
  // WalletCard (from ./WalletCard)
  // VonVaultButton (from ./VonVaultButton)
};
