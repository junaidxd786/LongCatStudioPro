import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Copy, Download, Zap, TrendingUp,
  Settings, BookOpen, Lightbulb,
  Target, Users, BarChart3, Flame, Brain,
  Play, RotateCcw, Save, Eye,
  CheckCircle2, XCircle, AlertCircle,
  MessageSquare, Film, Mic, Video, FileText, Newspaper,
  Layers, Sliders, ArrowRight, Minimize2, Maximize2, RefreshCw, Key, Feather,
  Loader2
} from 'lucide-react';

import { Button } from './components/ui/Button';
import { Card, CardHeader } from './components/ui/Card';
import { Input, Textarea } from './components/ui/Input';
import { Select } from './components/ui/Select';
import { Badge } from './components/ui/Badge';
import { Header } from './components/layout/Header';

// ==================== CONFIGURATION ====================

const MODELS = [
  { id: 'LongCat-Flash-Chat', name: 'Flash Chat', desc: 'General Purpose', icon: MessageSquare, color: 'blue', maxTokens: 16000 },
  { id: 'LongCat-Flash-Thinking', name: 'Flash Thinking', desc: 'Deep Reasoning', icon: Brain, color: 'purple', maxTokens: 32000 },
  { id: 'LongCat-Flash-Thinking-2601', name: 'Flash Thinking 2.0', desc: 'Enhanced Logic', icon: Brain, color: 'indigo', maxTokens: 32000 },
  { id: 'LongCat-Flash-Lite', name: 'Flash Lite', desc: 'Fast & Efficient', icon: Zap, color: 'emerald', maxTokens: 8000 },
];

const FORMATS = [
  { id: 'story_narrative', name: 'Story / Narrative', icon: Feather, color: 'indigo', description: 'Simple storytelling', prompt: 'Write a story...', structure: ['Opening', 'Inciting Incident', 'Rising Action', 'Climax', 'Resolution'] },
  { id: 'youtube_video', name: 'YouTube Video', icon: Video, color: 'red', description: 'Engaging long-form', prompt: 'Write a YouTube script...', structure: ['Hook', 'Intro', 'Main Points', 'Conclusion', 'CTA'] },
  { id: 'tiktok_reel', name: 'TikTok/Reels', icon: Film, color: 'pink', description: 'Viral short-form', prompt: 'Write a TikTok script...', structure: ['Hook', 'Value Bomb', 'Call-to-Action'] },
  { id: 'podcast', name: 'Podcast', icon: Mic, color: 'purple', description: 'Conversational audio', prompt: 'Write a podcast script...', structure: ['Cold Open', 'Intro', 'Discussion', 'Closing'] },
  { id: 'educational', name: 'Tutorial', icon: BookOpen, color: 'green', description: 'How-to content', prompt: 'Write a tutorial...', structure: ['Objective', 'Prerequisites', 'Steps', 'Practice'] },
  { id: 'news_report', name: 'News', icon: Newspaper, color: 'amber', description: 'Current events', prompt: 'Write a news report...', structure: ['Headline', 'Facts', 'Analysis', 'Outlook'] },
];

const TONES = [
  { id: 'energetic', name: 'High Energy', emoji: '🔥' },
  { id: 'casual', name: 'Casual', emoji: '😎' },
  { id: 'controversial', name: 'Edgy', emoji: '⚡' },
  { id: 'storytelling', name: 'Narrative', emoji: '📖' },
  { id: 'humorous', name: 'Funny', emoji: '😂' },
  { id: 'authority', name: 'Expert', emoji: '🎯' },
];

const DURATIONS = [
  { id: '30sec', name: '30s', desc: 'Short (30s)', tokens: 300 },
  { id: '1min', name: '1m', desc: 'Medium (1m)', tokens: 600 },
  { id: '3min', name: '3m', desc: 'Long (3m)', tokens: 1500 },
  { id: '5min', name: '5m', desc: 'Deep (5m)', tokens: 2500 },
  { id: '10min', name: '10m+', desc: 'Epic (10m+)', tokens: 5000 },
];

// ==================== MAIN APPLICATION ====================

export default function App() {
  // State
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_LONGCAT_API_KEY || '');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  // Inputs
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('story_narrative');
  const [tone, setTone] = useState(TONES[0].id);
  const [duration, setDuration] = useState(DURATIONS[1].id);
  const [targetAudience, setTargetAudience] = useState('');

  // Script Options
  const [includeHooks, setIncludeHooks] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [includeVisualCues, setIncludeVisualCues] = useState(true);

  // Outputs
  const [script, setScript] = useState('');
  const [hooks, setHooks] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [outputTab, setOutputTab] = useState('script'); // 'script', 'hooks'

  // Helpers
  const currentFormat = FORMATS.find(f => f.id === format) || FORMATS[0];
  const currentModel = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  const callLongCatAPI = async (messages, modelId, maxTokens) => {
    if (!apiKey) throw new Error("API Key is missing.");

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

  const handleGenerate = async (type = 'script') => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      if (type === 'hooks') {
        const prompt = `Generate 5 viral hooks for "${topic}". Audience: ${targetAudience}. Tone: ${tone}. Return a numbered list in PLAIN TEXT. Do not use Markdown (no bold, no italics, no headers).`;
        const content = await callLongCatAPI([{ role: 'user', content: prompt }], selectedModel, 1000);
        // Strip markdown just in case
        const plainText = content.replace(/[*_#`]/g, '');
        const hookList = plainText.split(/\n/).filter(line => /^\d/.test(line.trim()));
        setHooks(hookList.length ? hookList : [plainText]);
        setOutputTab('hooks');
      } else {
        const durationObj = DURATIONS.find(d => d.id === duration);
        const toneObj = TONES.find(t => t.id === tone);
        const isStory = format === 'story_narrative';

        const systemPrompt = `Role: Pro Content Creator. Format: ${currentFormat.name}. Tone: ${toneObj.name}. Length: ${durationObj.desc}.
        Requirements:
        ${includeHooks && !isStory ? '- Start with a hook' : ''}
        ${includeTimestamps && !isStory ? '- Timestamps [00:00]' : ''}
        ${includeVisualCues && !isStory ? '- Visual Cues [Scene]' : ''}
        - Natural spoken language.
        - Strict formatting rules apply.
        - IMPORTANT: Output MUST be PLAIN TEXT only. Do NOT use Markdown formatting (no bold **, no italics *, no headers #). Just plain text.`;

        const userPrompt = `Topic: "${topic}"\nAudience: ${targetAudience}\nWrite the script.`;

        const content = await callLongCatAPI(
          [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
          selectedModel,
          durationObj.tokens
        );

        // Strip Markdown characters from the response to ensure plain text
        const plainTextScript = content.replace(/[*#`]/g, '');

        setScript(plainTextScript);
        analyzeScript(plainTextScript);
        setOutputTab('script');
      }
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeScript = (text) => {
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 2.5); // ~150 wpm
    setAnalysis({
      words,
      time: `${Math.floor(time / 60)}m ${time % 60}s`,
    });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Ideally show toast
  };

  const handleSave = () => {
    if (!script) return;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `longcat-script-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefine = async (action) => {
    if (!script) return;
    setIsGenerating(true);
    let instruction = "";
    switch (action) {
      case 'shorten': instruction = "Shorten this text by 20% while keeping key info."; break;
      case 'expand': instruction = "Expand this text with more detail and depth."; break;
      case 'simplify': instruction = "Simplify this text for a general audience (Grade 8 reading level)."; break;
      case 'viral': instruction = "Make this text more engaging, punchy, and viral using emotional triggers."; break;
      default: instruction = "Refine this text.";
    }

    try {
      const prompt = `${instruction}\n\nIMPORTANT: Return PLAIN TEXT only. No Markdown.\n\nText:\n${script}`;
      const content = await callLongCatAPI([{ role: 'user', content: prompt }], selectedModel, 2000);
      const plainText = content.replace(/[*#`]/g, '');
      setScript(plainText);
      analyzeScript(plainText);
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-hidden">

      {/* Sidebar Removed */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-white tracking-tight">LongCat Studio Pro</h2>
            </div>
            <div className="h-6 w-px bg-white/10" />

            {/* Model Selector Inline */}
            <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
              {MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`
                    px-2.5 py-1 text-xs font-medium rounded-md transition-all
                    ${selectedModel === m.id ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}
                  `}
                  title={m.name}
                >
                  <span className="flex items-center gap-1.5">
                    <m.icon size={12} />
                    <span className="hidden xl:inline">{m.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" icon={Settings} />
            <Button variant="primary" size="sm" icon={Sparkles} onClick={() => handleGenerate('script')} loading={isGenerating}>
              Generate
            </Button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Panel: Configuration */}
          <div className="w-[420px] border-r border-white/5 bg-zinc-900/10 flex flex-col overflow-y-auto custom-scrollbar">
            <div className="p-6 space-y-8">

              {/* Topic Section */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Project Topic</label>
                  <Badge color="indigo" icon={Lightbulb}>Core Idea</Badge>
                </div>
                <Textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What would you like to create today? E.g., The future of AI..."
                  className="h-32 text-base"
                />
              </section>

              {/* Format Selection */}
              <section>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Content Format</label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMATS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={`
                        relative flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200
                        ${format === f.id
                          ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-800/60'}
                      `}
                    >
                      <f.icon size={20} />
                      <span className="text-[10px] font-medium text-center leading-tight">{f.name}</span>
                      {format === f.id && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.8)]" />
                      )}
                    </button>
                  ))}
                </div>
              </section>

              {/* Attributes Grid */}
              <section className="grid grid-cols-2 gap-4">
                <Select
                  label="Tone & Voice"
                  options={TONES.map(t => ({ id: t.id, name: `${t.emoji} ${t.name}` }))}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
                <Select
                  label="Duration"
                  options={DURATIONS.map(d => ({ id: d.id, name: d.desc }))}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </section>

              {/* Advanced Options */}
              <section>
                <Input
                  label="Target Audience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Tech enthusiasts, Beginners..."
                  icon={Users}
                  className="mb-4"
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Structure Elements</label>
                  {[
                    { id: 'hooks', label: 'Include Viral Hooks', state: includeHooks, set: setIncludeHooks },
                    { id: 'timestamps', label: 'Add Timestamps', state: includeTimestamps, set: setIncludeTimestamps },
                    { id: 'visuals', label: 'Visual Scene Cues', state: includeVisualCues, set: setIncludeVisualCues },
                  ].map(opt => (
                    <label key={opt.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/50 cursor-pointer hover:bg-zinc-800/50 transition-colors">
                      <span className="text-sm text-zinc-400 font-medium">{opt.label}</span>
                      <div className={`
                         w-10 h-5 rounded-full relative transition-colors duration-200 ease-in-out
                         ${opt.state ? 'bg-indigo-600' : 'bg-zinc-700'}
                       `}>
                        <div className={`
                           absolute top-1 left-1 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out
                           ${opt.state ? 'translate-x-5' : 'translate-x-0'}
                         `} />
                      </div>
                      <input type="checkbox" checked={opt.state} onChange={(e) => opt.set(e.target.checked)} className="hidden" />
                    </label>
                  ))}
                </div>
              </section>

            </div>
          </div>

          {/* Right Panel: Output & Editor */}
          <div className="flex-1 bg-zinc-950 flex flex-col relative overflow-hidden">

            {/* Toolbar */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-zinc-900/20">
              <div className="flex gap-1">
                {['script', 'hooks'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setOutputTab(tab)}
                    className={`
                      px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all
                      ${outputTab === tab ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}
                    `}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                {analysis && (
                  <div className="flex items-center gap-3 mr-4 text-xs font-medium text-zinc-500 bg-zinc-900/50 px-3 py-1 rounded-lg border border-white/5">
                    <span className="flex items-center gap-1.5"><FileText size={12} /> {analysis.words} words</span>
                    <span className="w-px h-3 bg-zinc-700" />
                    <span className="flex items-center gap-1.5"><ArrowRight size={12} /> ~{analysis.time}</span>
                  </div>
                )}
                <Button variant="ghost" size="sm" icon={Copy} onClick={() => handleCopy(script)}>Copy</Button>
                <Button variant="ghost" size="sm" icon={Download} onClick={handleSave}>Save</Button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 size={48} className="text-indigo-500 animate-spin relative z-10" />
                  </div>
                  <p className="font-medium animate-pulse">Crafting your content...</p>
                </div>
              ) : outputTab === 'script' ? (
                script ? (
                  <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <textarea
                      value={script}
                      onChange={(e) => setScript(e.target.value)}
                      className="w-full h-[calc(100vh-240px)] bg-transparent border-none resize-none focus:ring-0 text-zinc-200 font-mono text-base leading-relaxed p-0 selection:bg-indigo-500/30"
                      spellCheck="false"
                    />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                      <Sparkles size={32} className="opacity-20" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-zinc-500">Ready to create</p>
                      <p className="text-sm text-zinc-600 mt-1">Configure your settings and hit Generate</p>
                    </div>
                  </div>
                )
              ) : (
                <div className="max-w-2xl mx-auto space-y-3">
                  {hooks.length ? hooks.map((hook, i) => (
                    <Card key={i} className="group cursor-pointer hover:border-indigo-500/30">
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-zinc-300 leading-relaxed font-medium">{hook}</p>
                      </div>
                    </Card>
                  )) : (
                    <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
                      <p>No hooks generated yet.</p>
                      <Button variant="secondary" size="sm" className="mt-4" onClick={() => handleGenerate('hooks')}>
                        Generate Hooks
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            {script && (
              <div className="h-16 border-t border-white/5 bg-zinc-900/10 px-6 flex items-center gap-3 backdrop-blur-sm z-10">
                <span className="text-xs font-bold text-zinc-600 uppercase mr-2 tracking-wider">Refine:</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" icon={Minimize2} onClick={() => handleRefine('shorten')}>Shorten</Button>
                  <Button size="sm" variant="secondary" icon={Maximize2} onClick={() => handleRefine('expand')}>Expand</Button>
                  <Button size="sm" variant="secondary" icon={Users} onClick={() => handleRefine('simplify')}>Simplify</Button>
                  <Button size="sm" variant="secondary" icon={Flame} className="hover:boder-orange-500/50 hover:text-orange-400" onClick={() => handleRefine('viral')}>Make Viral</Button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
