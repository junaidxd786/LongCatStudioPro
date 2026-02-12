import React from 'react';
import { Button } from '../ui/Button';
import {
    Zap, Brain, MessageSquare, Play,
    HelpCircle, Bell, User
} from 'lucide-react';

const ModelSelector = ({ selectedModel, setSelectedModel, models = [] }) => {
    return (
        <div className="flex bg-zinc-900/80 p-1 rounded-xl border border-white/5">
            {models.map(model => (
                <button
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`
            flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
            ${selectedModel === model.id
                            ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-white/10'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}
          `}
                >
                    {model.icon && <model.icon size={12} className={selectedModel === model.id ? 'text-indigo-400' : ''} />}
                    <span className="hidden sm:inline">{model.name}</span>
                </button>
            ))}
        </div>
    );
};

export const Header = ({ models, selectedModel, setSelectedModel }) => {
    return (
        <header className="h-16 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex items-center justify-between px-6 z-20">
            {/* Left: Model Selector */}
            <div className="flex items-center gap-4">
                <ModelSelector
                    models={models}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                <div className="h-8 w-px bg-white/5 mx-2" />

                <button className="text-zinc-500 hover:text-zinc-300 transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-zinc-950" />
                </button>

                <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
                    <HelpCircle size={18} />
                </button>
            </div>
        </header>
    );
};
