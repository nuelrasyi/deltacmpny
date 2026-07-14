import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BrandIconProps {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'navy';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
}

export function BrandIcon({ 
  icon: Icon, 
  variant = 'primary', 
  size = 'md',
  className = '',
  iconClassName = ''
}: BrandIconProps) {
  
  // Base classes for the container
  const baseContainerClasses = 'inline-flex items-center justify-center shrink-0';
  
  // Define size mappings for container and icon
  const sizeMap = {
    sm: {
      container: 'w-10 h-10 rounded-xl',
      icon: 'w-5 h-5',
    },
    md: {
      container: 'w-12 h-12 rounded-2xl',
      icon: 'w-6 h-6',
    },
    lg: {
      container: 'w-16 h-16 rounded-3xl',
      icon: 'w-8 h-8',
    },
    xl: {
      container: 'w-20 h-20 rounded-[2rem]',
      icon: 'w-10 h-10',
    }
  };

  // Define color mappings for variant
  const variantMap = {
    primary: 'bg-primary-50 text-primary-500 border border-primary-100',
    secondary: 'bg-secondary-50 text-secondary-500 border border-secondary-100',
    tertiary: 'bg-tertiary-100 text-tertiary-700 border border-tertiary-200',
    navy: 'bg-slate-50 text-slate-800 border border-slate-200',
  };

  const selectedSize = sizeMap[size];
  const selectedVariant = variantMap[variant];

  return (
    <div className={`${baseContainerClasses} ${selectedSize.container} ${selectedVariant} ${className}`}>
      <Icon 
        className={`${selectedSize.icon} ${iconClassName}`} 
        strokeWidth={2.5} 
      />
    </div>
  );
}
