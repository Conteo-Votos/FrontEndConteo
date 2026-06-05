import React from 'react';

type TypographyProps = {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'small';
  className?: string;
  children: React.ReactNode;
};

export const Typography = ({ variant = 'body', className = '', children }: TypographyProps) => {
  const baseStyles = {
    h1: 'text-4xl md:text-5xl font-bold tracking-tight',
    h2: 'text-3xl md:text-4xl font-semibold tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold',
    h4: 'text-xl md:text-2xl font-medium',
    body: 'text-base',
    small: 'text-sm text-gray-400',
  };

  const Component = variant === 'body' || variant === 'small' ? (variant === 'small' ? 'small' : 'p') : variant;

  return (
    <Component className={`${baseStyles[variant]} ${className}`}>
      {children}
    </Component>
  );
};
