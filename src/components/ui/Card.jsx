import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
    return (
        <div
            className={`
        bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6
        ${hover ? 'hover:bg-zinc-900/80 hover:border-white/10 transition-all duration-300' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ title, description, icon: Icon, action }) => (
    <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
            {Icon && (
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                    <Icon size={20} />
                </div>
            )}
            <div>
                <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
                {description && <p className="text-sm text-zinc-500 mt-0.5">{description}</p>}
            </div>
        </div>
        {action && <div>{action}</div>}
    </div>
);
