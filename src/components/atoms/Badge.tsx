import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
};

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-carbon-800 text-gray-300 border-carbon-700',
    success: 'bg-green-900/30 text-green-400 border-green-800',
    warning: 'bg-bronze-900/30 text-bronze-400 border-bronze-800',
    error: 'bg-red-900/30 text-red-400 border-red-800',
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
