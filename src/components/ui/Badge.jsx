import React from 'react';

const colors = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    zinc: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

export const Badge = ({ children, color = 'zinc', className = '', icon: Icon }) => {
    return (
        <span className={`
      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border
      ${colors[color] || colors.zinc}
      ${className}
    `}>
            {Icon && <Icon size={12} />}
            {children}
        </span>
    );
};
