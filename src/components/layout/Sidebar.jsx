import React from 'react';
import {
    Plus, History, LayoutTemplate, Settings,
    LogOut, Sparkles, MessageSquare, Menu
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        className={`
      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
      ${active
                ? 'bg-gradient-to-r from-indigo-600/20 to-violet-600/10 text-indigo-300 shadow-sm shadow-indigo-900/20'
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50'}
    `}
        title={collapsed ? label : ''}
    >
        <div className={`
      relative flex items-center justify-center
      ${active ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}
    `}>
            <Icon size={20} />
            {active && (
                <div className="absolute inset-0 bg-indigo-500/20 blur-lg rounded-full" />
            )}
        </div>

        {!collapsed && (
            <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
                {label}
            </span>
        )}

        {!collapsed && active && (
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        )}
    </button>
);

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
    const menuItems = [
        { id: 'create', icon: Plus, label: 'New Project' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside
            className={`
        border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl
        flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${collapsed ? 'w-[72px]' : 'w-72'}
      `}
        >
            {/* Brand */}
            <div className="h-16 flex items-center px-4 border-b border-white/5">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                        <Sparkles className="text-white" size={20} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <h1 className="font-bold text-white tracking-tight leading-none text-base">LongCat</h1>
                            <span className="text-[10px] font-medium text-indigo-400 uppercase tracking-widest mt-0.5">Studio Pro</span>
                        </div>
                    )}
                </div>

                {/* Collapse Toggle */}
                {!collapsed && (
                    <button
                        onClick={() => setCollapsed(true)}
                        className="ml-auto p-1.5 text-zinc-600 hover:text-zinc-300 rounded-lg hover:bg-zinc-800/50 transition-colors"
                    >
                        <Menu size={16} />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="w-full flex justify-center mb-4 text-zinc-600 hover:text-zinc-300"
                    >
                        <Menu size={20} />
                    </button>
                )}

                {menuItems.map(item => (
                    <SidebarItem
                        key={item.id}
                        {...item}
                        active={activeTab === item.id}
                        onClick={() => setActiveTab(item.id)}
                        collapsed={collapsed}
                    />
                ))}
            </div>

            {/* User / Footer */}
            <div className="p-3 border-t border-white/5">
                <button className={`
          w-full flex items-center gap-3 p-2 rounded-xl transition-colors
          ${collapsed ? 'justify-center' : 'hover:bg-zinc-900'}
        `}>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400">
                        <div className="font-bold text-xs">JD</div>
                    </div>
                    {!collapsed && (
                        <div className="flex-1 text-left overflow-hidden">
                            <div className="text-xs font-medium text-white truncate">John Doe</div>
                            <div className="text-[10px] text-zinc-500 truncate">Pro Plan</div>
                        </div>
                    )}
                    {!collapsed && <LogOut size={16} className="text-zinc-600 hover:text-zinc-400" />}
                </button>
            </div>
        </aside>
    );
};
