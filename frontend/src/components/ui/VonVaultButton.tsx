import React from 'react';
import { tokens } from '../../styles/tokens';

export interface VonVaultButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const VonVaultButton: React.FC<VonVaultButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: tokens.colors.brand.primary,
          color: tokens.colors.text.primary,
          border: 'none',
          '&:hover': {
            backgroundColor: tokens.colors.brand.tertiary,
          }
        };
      case 'secondary':
        return {
          backgroundColor: tokens.colors.background.tertiary,
          color: tokens.colors.text.secondary,
          border: `${tokens.borders.width.default} solid ${tokens.borders.colors.default}`,
          '&:hover': {
            backgroundColor: tokens.colors.background.secondary,
          }
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: tokens.colors.text.secondary,
          border: `${tokens.borders.width.default} solid ${tokens.borders.colors.default}`,
          '&:hover': {
            backgroundColor: tokens.colors.background.tertiary,
          }
        };
      case 'destructive':
        return {
          backgroundColor: `${tokens.colors.status.error}20`,
          color: tokens.colors.status.error,
          border: `${tokens.borders.width.default} solid ${tokens.colors.status.error}50`,
          '&:hover': {
            backgroundColor: `${tokens.colors.status.error}30`,
          }
        };
      case 'success':
        return {
          backgroundColor: tokens.colors.status.success,
          color: tokens.colors.text.primary,
          border: 'none',
          '&:hover': {
            backgroundColor: '#059669', // darker green
          }
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          height: tokens.components.button.height.sm,
          padding: tokens.components.button.padding.sm,
          fontSize: tokens.typography.fontSize.sm,
        };
      case 'md':
        return {
          height: tokens.components.button.height.md,
          padding: tokens.components.button.padding.md,
          fontSize: tokens.typography.fontSize.base,
        };
      case 'lg':
        return {
          height: tokens.components.button.height.lg,
          padding: tokens.components.button.padding.lg,
          fontSize: tokens.typography.fontSize.lg,
        };
      case 'xl':
        return {
          height: tokens.components.button.height.xl,
          padding: tokens.components.button.padding.xl,
          fontSize: tokens.typography.fontSize.xl,
        };
      default:
        return {};
    }
  };

  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: tokens.typography.fontWeight.semibold,
    borderRadius: tokens.borders.radius.xl,
    transition: `all ${tokens.animations.duration.normal} ${tokens.animations.easing.easeInOut}`,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    textDecoration: 'none',
    outline: 'none',
    userSelect: 'none',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const combinedStyles = {
    ...baseStyles,
    ...variantStyles,
    ...sizeStyles,
  };

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = `scale(${tokens.animations.scale.hover})`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = `scale(${tokens.animations.scale.active})`;
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = `scale(${tokens.animations.scale.hover})`;
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loading}
      className={className}
      style={combinedStyles}
    >
      {/* Loading Spinner */}
      {loading && (
        <div 
          className="mr-2"
          style={{
            width: tokens.icons.size.sm,
            height: tokens.icons.size.sm,
            border: `2px solid ${variant === 'primary' ? tokens.colors.text.primary : tokens.colors.text.secondary}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      
      {/* Left Icon */}
      {leftIcon && !loading && (
        <span className="mr-2" style={{ fontSize: tokens.icons.size.sm }}>
          {leftIcon}
        </span>
      )}
      
      {/* Button Text */}
      <span>{children}</span>
      
      {/* Right Icon */}
      {rightIcon && (
        <span className="ml-2" style={{ fontSize: tokens.icons.size.sm }}>
          {rightIcon}
        </span>
      )}
      
      {/* Add CSS for spin animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
