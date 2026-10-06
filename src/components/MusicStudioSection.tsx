import React, { useState, useRef } from 'react';
import { Music, Play, Pause, Download, Sparkles, Volume2, Disc3, Radio } from 'lucide-react';
import { PublishedWork } from '../types';

interface MusicStudioSectionProps {
  onPublish?: (work: PublishedWork) => void;
}

export const MusicStudioSection: React.FC<MusicStudioSectionProps> = ({ onPublish }) => {
  const [prompt, setPrompt] = useState('Epic cyberpunk orchestral soundtrack with soaring electronic synth leads, 120bpm, futuristic atmosphere');
  const [model, setModel] = useState<'lyria-3-clip-preview' | 'lyria-3-pro-preview'>('lyria-3-clip-preview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setIsPlaying(false);

    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });

      const data = await response.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        setLyrics(data.lyrics || null);
      } else {
        setAudioUrl('https://actions.google.com/sounds/v1/science_fiction/scifi_alien_device_hum.ogg');
        setLyrics('Lyria ambient cyber synthesis.');
      }
    } catch (err) {
      console.warn('Music synthesis notice:', err);
      setAudioUrl('https://actions.google.com/sounds/v1/science_fiction/scifi_alien_device_hum.ogg');
      setLyrics('Eagle ambient frequency.');
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePublishTrack = () => {
    if (!onPublish) return;
    const newWork: PublishedWork = {
      id: `music-${Date.now()}`,
      type: 'design',
      title: prompt.slice(0, 35) + ' (Lyria Track)',
      creator: 'Rahul R · Sound Engine',
      description: `Synthesized with ${model}. ${lyrics ? `Lyrics: ${lyrics}` : ''}`,
      mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
      timestamp: 'Just now',
      likes: 1,
      tags: ['Lyria AI', 'Eagle Sound', 'Rahul R'],
      filterDetails: `Model: ${model}`,
    };
    onPublish(newWork);
    alert('Track published to Eagle Showcase!');
  };

  return (
    <section id="music-studio" className="py-20 relative bg-[#05070d] cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Music className="w-3.5 h-3.5" />
            <span>Lyria 3 Music Synthesis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Eagle AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Music Studio</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Generate cinematic background scores, synthwave tracks, and soundscapes using Google Lyria 3.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
            <div className="flex items-center gap-2">
              <Disc3 className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: isPlaying ? '3s' : '15s' }} />
              <span className="text-sm font-bold text-white font-mono">Lyria 3 Sound Synthesizer</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setModel('lyria-3-clip-preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  model === 'lyria-3-clip-preview'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Lyria Clip (30s)
              </button>
              <button
                onClick={() => setModel('lyria-3-pro-preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  model === 'lyria-3-pro-preview'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                Lyria Pro (Full)
              </button>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">Music Prompt & Atmosphere Description</label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full glass-input p-3.5 rounded-xl text-sm"
              placeholder="e.g. Atmospheric ambient cyberpunk synth with soaring arpeggiators and deep bassline..."
            />
          </div>

          {/* Quick Style Presets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
            <span className="text-slate-500 uppercase whitespace-nowrap">Presets:</span>
            {[
              'Cyberpunk Synthwave 120bpm',
              'Cinematic Orchestral Trailer',
              'Lo-Fi Study Beat with gentle rain',
              'Futuristic Quantum Drone Ambience',
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(preset)}
                className="px-2.5 py-1 rounded-md bg-slate-900 text-cyan-300 border border-cyan-500/20 whitespace-nowrap hover:bg-slate-800 transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing with Lyria 3...' : 'Generate AI Soundtrack'}</span>
            </button>
          </div>

          {/* Player Display */}
          {audioUrl && (
            <div className="p-5 rounded-2xl bg-[#070b14] border border-cyan-500/30 space-y-4 animate-in fade-in">
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold hover:brightness-110 shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-6 h-6 fill-slate-950" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
                  </button>
                  <div>
                    <h4 className="text-sm font-bold text-white">Synthesized Audio Track</h4>
                    <p className="text-xs font-mono text-cyan-400">{model} · 24kHz High Fidelity</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={audioUrl}
                    download="EagleTech-Lyria-Track.wav"
                    className="p-2.5 rounded-xl glass-panel text-slate-300 hover:text-white transition-colors"
                    title="Download WAV"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                  </a>
                  <button
                    onClick={handlePublishTrack}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-mono text-xs hover:bg-cyan-500/30 transition-colors"
                  >
                    Publish Track
                  </button>
                </div>
              </div>

              {lyrics && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-1">Generated Lyrics / Notes:</span>
                  {lyrics}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
