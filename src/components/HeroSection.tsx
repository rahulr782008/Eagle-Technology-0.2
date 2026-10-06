import React from 'react';
import { Eagle3DCanvas } from './Eagle3DCanvas';
import { Bot, Image, Video, Sparkles, ChevronRight, User, Terminal, Box, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section id="hero" className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center cyber-grid overflow-hidden">
      {/* Background ambient light orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        
        {/* 1st LOGO: Refined Small 3D Holographic Crest Badge */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="relative group">
            {/* Ambient Cyan Aura */}
            <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 opacity-70 blur-md group-hover:opacity-100 transition-opacity" />
            
            {/* Small 3D Eagle Emblem (Compact 72x72px) */}
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#070b14] border border-cyan-400/60 p-3 flex items-center justify-center shadow-xl shadow-cyan-500/25">
              <svg
                className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.85)] group-hover:scale-105 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="rgba(6, 182, 212, 0.25)" />
                <path d="M7 12L12 6L17 12" />
                <path d="M9 16L12 13L15 16" />
                <circle cx="12" cy="8.5" r="1.5" fill="#38bdf8" />
              </svg>

              {/* Status Beacon Indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#070b14] animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-[#070b14]" />
            </div>
          </div>

          {/* Kicker Pill */}
          <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eagle Technology · 3D AI Ecosystem</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Rahul R</span>
          </div>
        </div>

        {/* Brand Headline, Narrative & Primary Action Suite */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          
          {/* Main Title */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              EAGLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">TECHNOLOGY</span>
            </h1>
            <p className="text-lg sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto">
              Intelligent AI Chatbot, 3D WebGL Models & Creative Media Studio Suite
            </p>
          </div>

          {/* Bio & System Overview */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Founded and engineered by <strong className="text-white font-medium">Rahul R</strong> (18), currently pursuing B.Tech Information Technology at Arunai Engineering College. Explore high-performance Gemini AI reasoning, neural photo & video editing, and Google Docs integration.
          </p>

          {/* Primary Quick-Launch Action Buttons */}
          <div className="pt-2 flex flex-wrap justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('chatbot')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Chatbot</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('3d-models')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl glass-panel text-white hover:text-cyan-300 hover:border-cyan-500/40 font-medium text-sm transition-all"
            >
              <Box className="w-4 h-4 text-cyan-400" />
              <span>Explore 3D Models</span>
            </button>

            <button
              onClick={() => onNavigate('photo-editor')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl glass-panel text-white hover:text-cyan-300 hover:border-cyan-500/40 font-medium text-sm transition-all"
            >
              <Image className="w-4 h-4 text-sky-400" />
              <span>Photo Studio</span>
            </button>

            <button
              onClick={() => onNavigate('video-editor')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl glass-panel text-white hover:text-cyan-300 hover:border-cyan-500/40 font-medium text-sm transition-all"
            >
              <Video className="w-4 h-4 text-indigo-400" />
              <span>Video Studio</span>
            </button>

            <button
              onClick={() => onNavigate('google-docs')}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl glass-panel text-white hover:text-cyan-300 hover:border-cyan-500/40 font-medium text-sm transition-all"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Google Docs</span>
            </button>
          </div>

          {/* Quick Feature Badges / Meta Strip */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap justify-center items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gemini 3.8 Intelligence Core</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-sky-400" />
              <span>Three.js Hardware Accelerated 3D</span>
            </div>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <button
              onClick={() => onNavigate('about')}
              className="flex items-center gap-1.5 text-cyan-400 hover:underline"
            >
              <User className="w-3.5 h-3.5" />
              <span>Rahul R · Arunai Engg</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
