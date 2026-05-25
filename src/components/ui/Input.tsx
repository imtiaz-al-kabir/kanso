import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label && (
          <label className="text-xs uppercase tracking-wider font-semibold text-stone-500">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full glass-input px-4 py-3 rounded-lg text-sm text-charcoal font-medium ${
            error ? 'border-red-400 focus:border-red-400 focus:shadow-red-100' : ''
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
