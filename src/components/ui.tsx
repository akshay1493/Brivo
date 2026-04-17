import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
};

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95',
    secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
    outline: 'border border-slate-200 bg-transparent hover:bg-slate-100',
    ghost: 'hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'glass-card rounded-3xl p-6 transition-all duration-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ 
  className, 
  variant = 'default', 
  children,
  ...props 
}: { 
  className?: string, 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info', 
  children: React.ReactNode 
} & React.HTMLAttributes<HTMLSpanElement>) {
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span 
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold px-2 py-0.5', variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
