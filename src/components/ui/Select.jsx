import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
    label,
    options = [],
    value,
    onChange,
    className = '',
    placeholder = 'Select option...',
    renderOption
}) => {
    // Using native select for accessibility/simplicity, styled to look custom
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    value={value}
                    onChange={onChange}
                    className={`
            w-full appearance-none bg-zinc-950/50 border border-zinc-800 rounded-xl py-2.5 pl-4 pr-10
            text-sm text-zinc-200 
            focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50
            transition-all duration-200 cursor-pointer
          `}
                >
                    {options.map((opt) => (
                        <option key={opt.id || opt.value} value={opt.id || opt.value}>
                            {opt.name || opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none group-hover:text-zinc-300 transition-colors"
                />
            </div>
        </div>
    );
};
