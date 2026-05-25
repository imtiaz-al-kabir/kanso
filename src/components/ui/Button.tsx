import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 active:scale-97 cursor-pointer focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-lg';
  
  const variants = {
    primary: 'bg-charcoal text-sand hover:bg-stone-800 border border-charcoal shadow-sm',
    secondary: 'bg-primary text-charcoal hover:bg-primary-dark border border-primary',
    outline: 'border border-charcoal/15 text-charcoal hover:bg-charcoal hover:text-sand hover:border-charcoal',
    ghost: 'text-charcoal hover:bg-charcoal/5',
    glass: 'glass-panel text-charcoal hover:bg-sand/90 border border-charcoal/5 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 tracking-wider uppercase',
    md: 'text-sm px-6 py-3 tracking-wide',
    lg: 'text-base px-8 py-4 tracking-wide',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
