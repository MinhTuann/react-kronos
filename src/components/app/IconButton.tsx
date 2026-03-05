import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Define the available options for better IDE autocomplete
type IconVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type IconSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string; // Required for accessibility
  variant?: IconVariant;
  size?: IconSize;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  icon, 
  onClick, 
  label, 
  variant, 
  size = 'md',
  className = 'text-tertiary',
  ...props // Capture standard button props like 'disabled' or 'type'
}) => {
  
  const variants: Record<IconVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    danger: 'bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300'
  };

  const sizes: Record<IconSize, string> = {
    sm: 'p-1.5',
    md: 'p-2.5',
    lg: 'p-4'
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label} // Optional: browser default tooltip
      className={`
        inline-flex items-center justify-center rounded-full 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant ? variants[variant] : ''} 
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;