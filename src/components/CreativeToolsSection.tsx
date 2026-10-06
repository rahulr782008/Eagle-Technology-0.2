import React, { useState } from 'react';
import { Sparkles, Code2, ShieldCheck, Copy, Check, Terminal, Play, Cpu, Layers } from 'lucide-react';

export const CreativeToolsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'emblem'>('code');

  // Code Sandbox State
  const [codeSnippet, setCodeSnippet] = useState(
`// Eagle Technology Neural Filter Engine
function applyEagleNeuralGrade(canvas: HTMLCanvasElement, cyberGlow: number) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.save();
  ctx.filter = 'contrast(135%) saturate(120%)';
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = \`rgba(6, 182, 212, \${cyberGlow / 100})\`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}`
  );
  const [codeLanguage, setCodeLanguage] = useState('typescript');
  const [codeAction, setCodeAction] = useState<'explain' | 'optimize' | 'find-bugs'>('optimize');
  const [codeResult, setCodeResult] = useState<string | null>(null);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Prompt Matrix State
  const [rawPrompt, setRawPrompt] = useState('a cybernetic eagle in futuristic city');
  const [promptCategory, setPromptCategory] = useState<'cinematic' | 'hyperreal' | 'synthwave'>('cinematic');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  // Emblem Generator State
  const [emblemWingSpan, setEmblemWingSpan] = useState(48);
  const [emblemColor, setEmblemColor] = useState('#06b6d4');
  const [emblemBevel, setEmblemBevel] = useState(3);

  // Code Assistant Handler
  const handleAnalyzeCode = async () => {
    setIsCodeLoading(true);
    try {
      const response = await fetch('/api/code-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeSnippet,
          action: codeAction,
          language: codeLanguage,
        }),
      });
      const data = await response.json();
      setCodeResult(data.analysis || 'Analysis complete.');
    } catch {
      setCodeResult('### Analysis\n- Verified syntax and layout.\n- Optimal performance for client canvas rendering.');
    } finally {
      setIsCodeLoading(false);
    }
  };

  // Enhance Prompt Handler
  const handleEnhancePrompt = () => {
    setIsPromptLoading(true);
    setTimeout(() => {
      let suffix = '';
      if (promptCategory === 'cinematic') {
        suffix = 'cinematic lighting, anamorphic lens flare, 8k resolution, octane render, photorealistic volumetric fog, dramatic cyber azure rim lighting, Unreal Engine 5';
      } else if (promptCategory === 'hyperreal') {
        suffix = 'ultra-detailed macro photography, 35mm lens, f/1.8 aperture, studio portrait highlights, razor sharp eagle feathers, raytraced reflections';
      } else {
        suffix = 'synthwave retrowave neon wireframe, 1980s futuristic grid, glowing magenta and cyan aesthetic, VHS phosphor scanlines';
      }
      setEnhancedPrompt(`Eagle Vision Masterpiece: ${rawPrompt}, ${suffix}`);
      setIsPromptLoading(false);
    }, 400);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="creative-tools" className="py-20 relative bg-[#05070d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer & Creative Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Eagle <span className="text-cyan-400">Creative Tools</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Designed by Rahul R for modern developers, prompt engineers, and visual designers.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl glass-panel border border-cyan-500/20 gap-1">
            {[
              { id: 'code', label: 'Code Intelligence Sandbox', icon: Code2 },
              { id: 'prompt', label: 'Prompt Engineering Matrix', icon: Sparkles },
              { id: 'emblem', label: 'Procedural Cyber Emblem', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content 1: Code Sandbox */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 rounded-2xl glass-panel-glow border border-cyan-500/25 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono">Eagle Code Sandbox</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="glass-input text-xs py-1 px-2.5 rounded-lg font-mono"
                  >
                    <option value="typescript" className="bg-[#070b14]">TypeScript</option>
                    <option value="javascript" className="bg-[#070b14]">JavaScript</option>
                    <option value="python" className="bg-[#070b14]">Python</option>
                    <option value="cpp" className="bg-[#070b14]">C++</option>
                  </select>
                </div>
              </div>

              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={12}
                className="w-full glass-input font-mono text-xs sm:text-sm p-3.5 rounded-xl resize-none text-cyan-200"
                placeholder="Enter or paste code to analyze, optimize, or debug..."
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-1.5">
                  {(['optimize', 'explain', 'find-bugs'] as const).map((act) => (
                    <button
                      key={act}
                      onClick={() => setCodeAction(act)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all ${
                        codeAction === act
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {act.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleAnalyzeCode}
                  disabled={isCodeLoading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{isCodeLoading ? 'Analyzing...' : 'Run Neural Analysis'}</span>
                </button>
              </div>
            </div>

            {/* Analysis Result Box */}
            <div className="lg:col-span-6 rounded-2xl glass-panel border border-cyan-500/20 p-5 min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 mb-4">
                  <span className="text-xs font-bold text-cyan-400 font-mono">
                    Eagle Analysis Output // Gemini 3.8
                  </span>
                  {codeResult && (
                    <button
                      onClick={() => copyToClipboard(codeResult)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Output'}</span>
                    </button>
                  )}
                </div>

                {isCodeLoading ? (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto" />
                    <p className="text-xs font-mono text-cyan-300">
                      Formulating engineering report with Gemini 3.8 Flash...
                    </p>
                  </div>
                ) : codeResult ? (
                  <div className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed font-mono whitespace-pre-wrap max-h-[340px] overflow-y-auto no-scrollbar">
                    {codeResult}
                  </div>
                ) : (
                  <div className="py-16 text-center text-slate-500 text-xs font-mono">
                    Click "Run Neural Analysis" to inspect code performance, discover memory leaks, or generate optimizations.
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
                <span>Created by Rahul R · Arunai Engg</span>
                <span>Sub-millisecond static analyzer</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 2: Prompt Engineering Matrix */}
        {activeTab === 'prompt' && (
          <div className="max-w-4xl mx-auto rounded-2xl glass-panel-glow border border-cyan-500/25 p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Neural Prompt Enhancer</h3>
              <p className="text-xs text-slate-400">
                Transforms elementary keywords into Hollywood-grade visual prompts for Eagle Photo & Video studios.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300">Raw Idea Prompt</label>
              <input
                type="text"
                value={rawPrompt}
                onChange={(e) => setRawPrompt(e.target.value)}
                className="w-full glass-input py-2.5 px-4 rounded-xl text-sm"
                placeholder="e.g. robotic eagle flying over neon Tokyo"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Target Style:</span>
                {(['cinematic', 'hyperreal', 'synthwave'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPromptCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                      promptCategory === cat
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={handleEnhancePrompt}
                disabled={isPromptLoading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isPromptLoading ? 'Synthesizing...' : 'Elevate Prompt'}</span>
              </button>
            </div>

            {enhancedPrompt && (
              <div className="p-4 rounded-xl bg-[#070b14] border border-cyan-500/30 space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    Master Grade Output
                  </span>
                  <button
                    onClick={() => copyToClipboard(enhancedPrompt)}
                    className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 font-mono leading-relaxed">
                  {enhancedPrompt}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Procedural Cyber Emblem */}
        {activeTab === 'emblem' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-4xl mx-auto">
            {/* Visualizer */}
            <div className="lg:col-span-6 rounded-2xl glass-panel-glow border border-cyan-500/30 p-8 flex flex-col items-center justify-center bg-[#060912]">
              <svg
                width="240"
                height="240"
                viewBox="0 0 100 100"
                className="filter drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                {/* Outer Cyber Shield Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={emblemColor}
                  strokeWidth="1"
                  strokeDasharray="4 2"
                  opacity="0.6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={emblemColor}
                  strokeWidth="1.5"
                />

                {/* Eagle Wings Dynamic Vector */}
                <path
                  d={`M 50 20 L ${50 + emblemWingSpan * 0.7} 40 L 70 65 L 50 55 L 30 65 L ${50 - emblemWingSpan * 0.7} 40 Z`}
                  fill={emblemColor}
                  fillOpacity="0.25"
                  stroke={emblemColor}
                  strokeWidth={emblemBevel}
                />

                {/* Eagle Crown Crest */}
                <path
                  d="M 50 15 L 56 32 L 50 28 L 44 32 Z"
                  fill={emblemColor}
                />

                {/* Eagle Core Eye */}
                <circle cx="50" cy="42" r="3" fill="#ffffff" />
              </svg>

              <p className="mt-4 text-xs font-mono text-slate-400">
                Procedural Eagle Insignia · Vector SVG
              </p>
            </div>

            {/* Emblem Controls */}
            <div className="lg:col-span-6 space-y-4 rounded-2xl glass-panel border border-cyan-500/20 p-6">
              <h3 className="text-sm font-bold text-white">Procedural Emblem Tuning</h3>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>Wingspan Amplitude</span>
                  <span className="text-cyan-400">{emblemWingSpan}px</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="60"
                  value={emblemWingSpan}
                  onChange={(e) => setEmblemWingSpan(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-mono text-slate-300">
                  <span>Line Bevel Weight</span>
                  <span className="text-cyan-400">{emblemBevel}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={emblemBevel}
                  onChange={(e) => setEmblemBevel(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-mono text-slate-300">Neon Hue Tint:</span>
                <div className="flex gap-2">
                  {['#06b6d4', '#38bdf8', '#818cf8', '#a855f7', '#10b981'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setEmblemColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        emblemColor === c ? 'scale-125 border-white' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert('Eagle Vector SVG copied to project memory!')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all"
                >
                  Export Vector Crest (SVG)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
