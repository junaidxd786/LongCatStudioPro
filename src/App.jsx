import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Copy, Download, Zap, TrendingUp,
  Settings, BookOpen, Lightbulb,
  Target, Users, BarChart3, Flame, Brain,
  Play, RotateCcw, Save, Eye,
  CheckCircle2, XCircle, AlertCircle,
  MessageSquare, Film, Mic, Video, FileText, Newspaper,
  Layers, Sliders, ArrowRight, Minimize2, Maximize2, RefreshCw, Key, Feather
} from 'lucide-react';

// ==================== CONFIGURATION ====================

const MODELS = [
  {
    id: 'LongCat-Flash-Chat',
    name: 'Flash Chat',
    desc: 'General Purpose',
    icon: MessageSquare,
    color: 'blue',
    maxTokens: 16000
  },
  {
    id: 'LongCat-Flash-Thinking',
    name: 'Flash Thinking',
    desc: 'Deep Reasoning',
    icon: Brain,
    color: 'purple',
    maxTokens: 32000
  },
  {
    id: 'LongCat-Flash-Thinking-2601',
    name: 'Flash Thinking 2.0',
    desc: 'Enhanced Logic',
    icon: Brain,
    color: 'indigo',
    maxTokens: 32000
  },
  {
    id: 'LongCat-Flash-Lite',
    name: 'Flash Lite',
    desc: 'Fast & Efficient',
    icon: Zap,
    color: 'emerald',
    maxTokens: 8000
  },
];

const FORMATS = [
  {
    id: 'story_narrative',
    name: 'Story / Narrative',
    icon: Feather, // Using Feather for story/writing
    color: 'indigo',
    description: 'Simple storytelling',
    prompt: `Write a simple, clear story in paragraph form.
- STRICTLY PARAGRAPH FORM only.
- Use simple, easy-to-understand vocabulary (Grade 5-6 level).
- Stick strictly to the provided topic/plot. Do NOT add unnecessary fluff, flowery adjectives, or side plots.
- NO dialogue tags (e.g. "Character: Hello"). Use narrative dialogue instead.
- NO visual cues, camera directions, or scene headings.
- Focus on clear actions and direct storytelling.`,
    structure: ['Opening', 'Inciting Incident', 'Rising Action', 'Climax', 'Resolution']
  },
  {
    id: 'youtube_video',
    name: 'YouTube Video',
    icon: Video,
    color: 'red',
    description: 'Engaging long-form',
    prompt: `Write a YouTube video script with:
- STRONG HOOK (first 5 seconds)
- Clear introduction
- Main content in digestible segments
- Conversational, everyday language
- Pattern interrupts every 30-60 seconds
- Timestamps for key sections
- Strong CTA`,
    structure: ['Hook', 'Intro', 'Main Points', 'Conclusion', 'CTA']
  },
  {
    id: 'tiktok_reel',
    name: 'TikTok/Reels',
    icon: Film,
    color: 'pink',
    description: 'Viral short-form',
    prompt: `Write a TikTok/Reel script (30-60 seconds) with:
- INSTANT HOOK (1-2 seconds)
- Fast-paced, high-energy
- Trending phrases naturally used
- Visual cues in [brackets]
- Engagement bait at the end`,
    structure: ['Hook', 'Value Bomb', 'Call-to-Action']
  },
  {
    id: 'podcast',
    name: 'Podcast',
    icon: Mic,
    color: 'purple',
    description: 'Conversational audio',
    prompt: `Write a podcast script with:
- Warm, conversational intro
- Natural dialogue flow
- Story-driven narrative
- Questions that create curiosity
- Segment markers`,
    structure: ['Cold Open', 'Intro', 'Discussion', 'Closing']
  },
  {
    id: 'educational',
    name: 'Tutorial',
    icon: BookOpen,
    color: 'green',
    description: 'How-to content',
    prompt: `Write an educational script with:
- Clear learning objective
- Step-by-step breakdown
- Simple analogies
- Encouraging tone
- Practical exercises`,
    structure: ['Objective', 'Prerequisites', 'Steps', 'Practice']
  },
  {
    id: 'news_report',
    name: 'News',
    icon: Newspaper,
    color: 'amber',
    description: 'Current events',
    prompt: `Write a news commentary script with:
- Breaking news hook
- Factual overview
- Analysis/Opinion labeled
- Accessible language
- Future outlook`,
    structure: ['Headline', 'Facts', 'Analysis', 'Outlook']
  },
];

const TONES = [
  { id: 'energetic', name: 'High Energy', emoji: '🔥', color: 'orange' },
  { id: 'casual', name: 'Casual', emoji: '😎', color: 'blue' },
  { id: 'controversial', name: 'Edgy', emoji: '⚡', color: 'red' },
  { id: 'storytelling', name: 'Narrative', emoji: '📖', color: 'purple' },
  { id: 'humorous', name: 'Funny', emoji: '😂', color: 'yellow' },
  { id: 'authority', name: 'Expert', emoji: '🎯', color: 'indigo' },
];

const DURATIONS = [
  { id: '30sec', name: '30s', desc: 'Short', tokens: 300 },
  { id: '1min', name: '1m', desc: 'Medium', tokens: 600 },
  { id: '3min', name: '3m', desc: 'Long', tokens: 1500 },
  { id: '5min', name: '5m', desc: 'Deep', tokens: 2500 },
  { id: '10min', name: '10m+', desc: 'Epic', tokens: 5000 },
];

// ==================== UTILITY COMPONENTS ====================

const Badge = ({ children, color = 'gray', icon: Icon }) => {
  const colors = {
    gray: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    blue: 'bg-blue-900/30 text-blue-300 border-blue-800',
    green: 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
    purple: 'bg-purple-900/30 text-purple-300 border-purple-800',
    red: 'bg-red-900/30 text-red-300 border-red-800',
    amber: 'bg-amber-900/30 text-amber-300 border-amber-800',
    pink: 'bg-pink-900/30 text-pink-300 border-pink-800',
    emerald: 'bg-emerald-900/30 text-emerald-300 border-emerald-800',
    orange: 'bg-orange-900/30 text-orange-300 border-orange-800',
    yellow: 'bg-yellow-900/30 text-yellow-300 border-yellow-800',
    indigo: 'bg-indigo-900/30 text-indigo-300 border-indigo-800',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border ${colors[color]}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, icon: Icon, loading = false, fullWidth = false }) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 border border-indigo-500/50",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700",
    ghost: "bg-transparent hover:bg-zinc-800/50 text-zinc-400 hover:text-white",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500/50",
    danger: "bg-red-600 hover:bg-red-500 text-white border border-red-500/50",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && (
        <Icon size={16} className="mr-2" />
      )}
      {children}
    </button>
  );
};

// ==================== MAIN APPLICATION ====================

export default function App() {
  // Core Settings
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_LONGCAT_API_KEY || '');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showSettings, setShowSettings] = useState(false);

  // Script Configuration
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('story_narrative'); // Default to story if that's what user is focused on
  const [tone, setTone] = useState(TONES[0].id);
  const [duration, setDuration] = useState(DURATIONS[1].id);
  const [targetAudience, setTargetAudience] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');

  // Advanced Options
  const [includeHooks, setIncludeHooks] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [includeVisualCues, setIncludeVisualCues] = useState(true);

  // Output & Status
  const [script, setScript] = useState('');
  const [hookSuggestions, setHookSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState(null);
  const [scriptAnalysis, setScriptAnalysis] = useState(null);

  // UI State
  const [activeTab, setActiveTab] = useState('script');
  const [copySuccess, setCopySuccess] = useState(false);

  // Helper: Get model details
  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];
  const currentFormat = FORMATS.find(f => f.id === format) || FORMATS[0];

  // API Call Helper (LongCat - OpenAI Format)
  const callLongCatAPI = async (messages, modelId, maxTokens) => {
    if (!apiKey) throw new Error("API Key is missing. Please check settings.");

    const response = await fetch('https://api.longcat.chat/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelId,
        messages: messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
  };

  // Generate Hooks
  const generateHooks = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);
    setCurrentStep('Generating hooks...');
    setError(null);

    try {
      const prompt = `Generate 5 viral, click-worthy hooks for a video about "${topic}".
      Target Audience: ${targetAudience || 'General'}
      Tone: ${TONES.find(t => t.id === tone)?.name}
      Format: Return ONLY a numbered list of 5 hooks.`;

      const content = await callLongCatAPI(
        [{ role: 'user', content: prompt }],
        selectedModel,
        1000
      );

      const hooks = content.split(/\n/).filter(line => /^\d/.test(line.trim()));
      setHookSuggestions(hooks.length > 0 ? hooks : [content]);
      setActiveTab('hooks');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  // Generate Script
  const generateScript = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentStep('Planning structure...');
    setActiveTab('script');

    try {
      const durationObj = DURATIONS.find(d => d.id === duration);
      const toneObj = TONES.find(t => t.id === tone);
      const isStory = format === 'story_narrative';

      const systemPrompt = `You are a professional content creator and writer.
      Format: ${currentFormat.name}
      Tone: ${toneObj.name}
      Target Length: ${durationObj.desc} (~${durationObj.name})
      
      Requirements:
      ${includeHooks && !isStory ? '- Start with a strong hook' : ''}
      ${includeTimestamps && !isStory ? '- Include timestamps [00:00]' : ''}
      ${includeVisualCues && !isStory ? '- Include [Visual Cues]' : ''}
      - Use natural, spoken language.
      - Structure: ${currentFormat.structure.join(', ')}
      
      CRITICAL FORMATTING RULES:
      ${isStory
          ? '- Write STRICTLY in paragraph form.'
          : '- Follow the standard script format.'}
      ${isStory
          ? '- DO NOT use script style dialogue (e.g. "Crow: Hello"). Use narrative dialogue tags (e.g. "Hello," said the crow).'
          : ''}
      ${isStory
          ? '- DO NOT include visual cues, camera angles, or timestamps.'
          : ''}
      ${isStory
          ? '- IMPORTANT: Keep vocabulary SIMPLE and easy to understand. Avoid flowery language (e.g. "sun-dappled", "whispered secrets"). Stick strictly to the requested events.'
          : ''}
      `;

      const userPrompt = `Topic: "${topic}"
      
      Audience: ${targetAudience || 'General Interest'}
      Additional Instructions: ${customInstructions}
      
      Write the full content now.`;

      setCurrentStep('Writing content...');

      const content = await callLongCatAPI(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        selectedModel,
        durationObj.tokens
      );

      setScript(content);
      analyzeScript(content);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  // Analyze Script
  const analyzeScript = (text) => {
    const wordCount = text.trim().split(/\s+/).length;
    const estimatedTime = Math.ceil(wordCount / 2.5); // ~150 wpm

    setScriptAnalysis({
      words: wordCount,
      time: `${Math.floor(estimatedTime / 60)}m ${estimatedTime % 60}s`,
      hasHook: /hook|intro/i.test(text.substring(0, 200)),
      hasCTA: /subscribe|follow|like|comment/i.test(text)
    });
  };

  // Quick Actions
  const handleModifyScript = async (action) => {
    if (!script) return;
    setIsGenerating(true);
    setCurrentStep(action === 'shorten' ? 'Shortening...' : action === 'expand' ? 'Expanding...' : 'Rewriting...');

    let prompt = "";
    if (action === 'shorten') prompt = "Shorten this text by 30% while keeping the main points.";
    if (action === 'expand') prompt = "Expand this text with more vivid details and descriptions.";
    if (action === 'simplify') prompt = "Rewrite this using simpler, more casual language.";
    if (action === 'viral') prompt = "Make this text more engaging and punchy.";

    try {
      const content = await callLongCatAPI(
        [
          { role: 'system', content: "You are a professional editor." },
          { role: 'user', content: `${prompt}\n\nOriginal Text:\n${script}` }
        ],
        selectedModel,
        DURATIONS.find(d => d.id === duration).tokens
      );
      setScript(content);
      analyzeScript(content);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
      setCurrentStep('');
    }
  };

  // Copy Helper to handle permission errors
  const handleCopy = (text) => {
    if (!text) return;

    // Fallback using legacy execCommand if modern API fails or is restricted
    const fallbackCopy = (txt) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = txt;

        // Ensure it's not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } else {
          console.error('Fallback: Copying text command was unsuccessful');
        }
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }
    };

    // Try modern API first, then fallback
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        })
        .catch(err => {
          console.warn('Clipboard API failed (likely permission policy), trying fallback...', err);
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-indigo-500/30">

      {/* ========== TOP BAR ========== */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/20">
            LC
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">LongCat Studio Pro</h1>
            <p className="text-[10px] text-zinc-500 font-mono uppercase">API Integrated</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 p-1">
            {MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${selectedModel === model.id
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                title={model.desc}
              >
                <model.icon size={12} />
                <span className="hidden sm:inline">{model.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-zinc-800 text-zinc-400'}`}
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* ========== SETTINGS DRAWER ========== */}
      {showSettings && (
        <div className="bg-zinc-900 border-b border-zinc-800 p-6 grid gap-4 animate-in slide-in-from-top-4">
          <div className="max-w-3xl mx-auto w-full">
            <h3 className="text-sm font-bold text-zinc-400 uppercase mb-4">API Configuration</h3>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="block text-xs text-zinc-500 mb-1.5">LongCat API Key</label>
                <div className="relative">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50"
                    placeholder="sk-..."
                  />
                  <Key size={14} className="absolute left-3.5 top-3 text-zinc-600" />
                </div>
                <p className="text-[10px] text-zinc-600 mt-2">
                  Uses <code className="bg-zinc-800 px-1 rounded text-zinc-400">https://api.longcat.chat/openai</code> endpoint.
                  Free quota resets daily (Beijing Time).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== WORKSPACE ========== */}
      <div className="flex-1 flex overflow-hidden">

        {/* ----- LEFT COLUMN: INPUTS & CONTROLS ----- */}
        <div className="w-[400px] flex flex-col border-r border-zinc-800 bg-zinc-900/30 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">

            {/* Topic Input */}
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase mb-3">
                <Lightbulb size={14} /> Video / Story Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to create today? E.g., The Story of the Thirsty Crow..."
                className="w-full h-28 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all"
              />
            </div>

            {/* Selectors Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Format</label>
                <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                  {FORMATS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={`h-9 rounded-md flex items-center justify-center transition-all ${format === f.id ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
                        }`}
                      title={f.name}
                    >
                      <f.icon size={16} />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-xs text-zinc-500 text-center">{currentFormat.name}: {currentFormat.description}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
                >
                  {TONES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Length</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
                >
                  {DURATIONS.map(d => <option key={d.id} value={d.id}>{d.name} ({d.desc})</option>)}
                </select>
              </div>
            </div>

            {/* Options Toggles */}
            <div className={`space-y-3 pt-2 ${format === 'story_narrative' ? 'opacity-50 pointer-events-none' : ''}`}>
              <label className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${includeHooks ? 'bg-indigo-500' : 'bg-zinc-700'}`} />
                  <span className="text-sm font-medium">Viral Hooks</span>
                </div>
                <input type="checkbox" checked={includeHooks} onChange={(e) => setIncludeHooks(e.target.checked)} className="hidden" />
              </label>

              <label className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${includeTimestamps ? 'bg-indigo-500' : 'bg-zinc-700'}`} />
                  <span className="text-sm font-medium">Timestamps</span>
                </div>
                <input type="checkbox" checked={includeTimestamps} onChange={(e) => setIncludeTimestamps(e.target.checked)} className="hidden" />
              </label>

              <label className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${includeVisualCues ? 'bg-indigo-500' : 'bg-zinc-700'}`} />
                  <span className="text-sm font-medium">Visual Cues</span>
                </div>
                <input type="checkbox" checked={includeVisualCues} onChange={(e) => setIncludeVisualCues(e.target.checked)} className="hidden" />
              </label>
            </div>
            {format === 'story_narrative' && <p className="text-xs text-zinc-500 italic text-center">Script options disabled for Narrative format</p>}

            {/* Advanced Inputs */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Target Audience</label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Beginners, Tech Enthusiasts"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Generate Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="secondary"
                icon={Zap}
                onClick={generateHooks}
                disabled={!topic || isGenerating}
              >
                Get Hooks
              </Button>
              <Button
                variant="primary"
                icon={Sparkles}
                onClick={generateScript}
                loading={isGenerating && activeTab === 'script'}
                disabled={!topic || isGenerating}
              >
                Generate
              </Button>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-red-300 text-xs flex items-start gap-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* ----- RIGHT COLUMN: OUTPUT ----- */}
        <div className="flex-1 flex flex-col bg-zinc-950 relative">

          {/* Output Toolbar */}
          <div className="h-12 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/30">
            <div className="flex items-center gap-1">
              {['script', 'hooks', 'analysis'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${activeTab === tab
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" icon={Copy} onClick={() => handleCopy(script)} disabled={!script}>
                {copySuccess ? 'Copied' : 'Copy'}
              </Button>
              <Button size="sm" variant="ghost" icon={Download} disabled={!script}>
                Save
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-zinc-400 font-medium animate-pulse">{currentStep}</p>
              </div>
            )}

            {activeTab === 'script' && (
              <div className="max-w-3xl mx-auto">
                {!script ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 mt-20">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>Generated content will appear here</p>
                  </div>
                ) : (
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="w-full h-[calc(100vh-200px)] bg-transparent border-none resize-none focus:ring-0 text-zinc-300 font-mono text-sm leading-relaxed"
                    spellCheck="false"
                  />
                )}
              </div>
            )}

            {activeTab === 'hooks' && (
              <div className="max-w-2xl mx-auto space-y-4">
                {hookSuggestions.length === 0 ? (
                  <div className="text-center text-zinc-600 mt-20">No hooks generated yet.</div>
                ) : (
                  hookSuggestions.map((hook, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-4 group hover:border-indigo-500/30 transition-all">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-zinc-300 leading-relaxed pt-1">{hook}</p>
                      <button
                        onClick={() => handleCopy(hook)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-white transition-opacity"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'analysis' && scriptAnalysis && (
              <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                  <div className="text-zinc-500 text-xs uppercase font-bold mb-1">Word Count</div>
                  <div className="text-3xl font-bold text-white">{scriptAnalysis.words}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                  <div className="text-zinc-500 text-xs uppercase font-bold mb-1">Est. Read Time</div>
                  <div className="text-3xl font-bold text-white">{scriptAnalysis.time}</div>
                </div>
                <div className="col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Strong Hook Detected</span>
                    {scriptAnalysis.hasHook ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Call to Action Detected</span>
                    {scriptAnalysis.hasCTA ? <CheckCircle2 className="text-emerald-500" /> : <XCircle className="text-red-500" />}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar (Bottom) */}
          <div className="h-16 border-t border-zinc-800 bg-zinc-900/30 px-6 flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-600 uppercase mr-2">Refine:</span>
            <Button size="sm" variant="secondary" icon={Minimize2} onClick={() => handleModifyScript('shorten')} disabled={!script}>Shorten</Button>
            <Button size="sm" variant="secondary" icon={Maximize2} onClick={() => handleModifyScript('expand')} disabled={!script}>Expand</Button>
            <Button size="sm" variant="secondary" icon={Users} onClick={() => handleModifyScript('simplify')} disabled={!script}>Simplify</Button>
            <Button size="sm" variant="secondary" icon={Flame} onClick={() => handleModifyScript('viral')} disabled={!script}>Make Viral</Button>
          </div>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #52525b; }
      `}</style>
    </div>
  );
}
