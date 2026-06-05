import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'bronze' | 'outline' | 'ghost' | 'numeric';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95';
    
    const variants = {
      primary: 'bg-carbon-800 text-white hover:bg-carbon-700 border border-carbon-700',
      bronze: 'bg-bronze-500 text-white hover:bg-bronze-600 shadow-lg shadow-bronze-500/20',
      outline: 'border border-carbon-700 hover:bg-carbon-800 text-gray-300',
      ghost: 'hover:bg-carbon-800 text-gray-300',
      numeric: 'bg-carbon-800 text-3xl font-bold rounded-2xl hover:bg-carbon-700 border border-carbon-700 text-white aspect-square shadow-xl',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
      icon: 'h-11 w-11',
    };

    const classes = `${baseStyles} ${variants[variant]} ${variant === 'numeric' ? '' : sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
      <button ref={ref} className={classes} {...props} />
    );
  }
);
Button.displayName = 'Button';
