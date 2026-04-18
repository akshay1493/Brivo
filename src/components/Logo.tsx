import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  iconOnly?: boolean;
  size?: number | string;
  light?: boolean;
  onClick?: () => void;
}

export function Logo({ className, showText = true, iconOnly = false, size = 32, light = false, onClick }: LogoProps) {
  const dotColor = "#3b82f6"; // Primary blue
  
  const fontSize = typeof size === 'number' ? `${size}px` : size;
  const iconSize = typeof size === 'number' ? size : 32;

  if (iconOnly) {
    return (
      <div 
        className={cn("flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 cursor-pointer", className)}
        style={{ width: iconSize, height: iconSize }}
        onClick={onClick}
      >
        <div 
          className="rounded-full bg-white transition-transform group-hover:scale-110" 
          style={{ width: '40%', height: '40%' }} 
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 select-none", className)} onClick={onClick}>
      <div 
        className={cn(
          "flex items-center justify-center rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20",
          typeof size === 'number' && iconSize < 40 ? "rounded-lg" : "rounded-2xl"
        )}
        style={{ 
          width: typeof size === 'number' ? iconSize * 1.2 : 'auto', 
          height: typeof size === 'number' ? iconSize * 1.2 : 'auto',
          aspectRatio: '1/1',
          fontSize: typeof size === 'number' ? iconSize * 0.7 : '1.5rem'
        }}
      >
        B
      </div>
      {showText && (
        <span 
          className={cn(
            "font-black tracking-tight", 
            light ? "text-white" : "text-slate-900"
          )}
          style={{ fontSize }}
        >
          Br<span className="relative">i<span className="absolute -top-[0.2em] left-1/2 -translate-x-1/2 w-[0.25em] h-[0.25em] rounded-full" style={{ backgroundColor: dotColor }} /></span>vo
        </span>
      )}
    </div>
  );
}
