import React from 'react';
import { Search } from 'lucide-react';

export const Input = ({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    className={`
            w-full bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 
            ${Icon ? 'pl-10' : 'pl-4'} pr-4 
            text-sm text-zinc-200 placeholder-zinc-600
            focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50
            transition-all duration-200
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
          `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-400 mt-1.5 ml-1">{error}</p>}
        </div>
    );
};

export const Textarea = ({
    label,
    error,
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                    {label}
                </label>
            )}
            <textarea
                className={`
          w-full bg-zinc-950/50 border border-zinc-800 rounded-xl p-4
          text-sm text-zinc-200 placeholder-zinc-600
          focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50
          transition-all duration-200 resize-none
          ${error ? 'border-red-500/50 focus:border-red-500' : ''}
        `}
                {...props}
            />
            {error && <p className="text-xs text-red-400 mt-1.5 ml-1">{error}</p>}
        </div>
    );
};
