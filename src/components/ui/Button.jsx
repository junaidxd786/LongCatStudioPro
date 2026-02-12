import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 border border-indigo-500/50",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
    ghost: "bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    viral: "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white shadow-lg shadow-orange-500/25 border border-orange-500/50",
    outline: "bg-transparent border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white"
};

const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-2"
};

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon: Icon,
    fullWidth = false,
    onClick,
    ...props
}) => {
    return (
        <button
            className={`
        relative overflow-hidden inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.98]
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!loading && Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
            {children}
        </button>
    );
};
