import React from 'react';
import { ArrowUp, Bot, Image, Video, Sparkles, User, GraduationCap, Mail, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#030509] border-t border-cyan-500/20 pt-16 pb-12 relative overflow-hidden text-xs text-slate-400">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#070b14] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyan-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="rgba(6, 182, 212, 0.2)" />
                    <path d="M7 12L12 6L17 12" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">
                  EAGLE <span className="text-cyan-400">TECHNOLOGY</span>
                </span>
                <p className="text-[10px] font-mono text-cyan-400/80">
                  NEXT-GEN 3D AI PLATFORM
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An intelligent 3D AI Chatbot and multimedia editing platform designed and built by <strong>Rahul R</strong>. Empowering creators with real-time neural photo enhancements, dynamic timeline video editing, and interactive 3D WebGL synthesis.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 font-mono text-[11px]">
              <p className="text-white font-semibold">Founder & Creator: Rahul R (Age 18)</p>
              <p className="text-cyan-300">B.Tech Information Technology</p>
              <p className="text-slate-400">Arunai Engineering College, Tiruvannamalai</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              AI Suites
            </h4>
            <ul className="space-y-2 font-mono">
              <li>
                <button
                  onClick={() => onNavigate('chatbot')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Chatbot</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('photo-editor')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Image className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Photo Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('video-editor')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-cyan-400" />
                  <span>AI Video Studio</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('creative-tools')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Creative Tools</span>
                </button>
              </li>
            </ul>
          </div>

          {/* About Creator Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              The Creator
            </h4>
            <ul className="space-y-2 font-mono">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>About Rahul R</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('education')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Arunai Engg College</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('published-works')}
                  className="hover:text-cyan-300 transition-colors"
                >
                  <span>Published Works</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Contact Rahul R</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Transmission */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Direct Contact
            </h4>
            <p className="text-[11px] text-slate-400">
              For collaborations and inquiries:
            </p>
            <a
              href="mailto:rahulr782008@gmail.com"
              className="text-cyan-300 hover:text-white font-mono font-medium block break-all"
            >
              rahulr782008@gmail.com
            </a>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel hover:text-cyan-300 hover:border-cyan-500/40 transition-colors font-mono"
              >
                <span>Back to Top</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Banner with Explicit Creator Attribution */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© {new Date().getFullYear()} Eagle Technology.</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-slate-200 font-semibold">
              Created by Rahul R
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Arunai Engineering College</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>B.Tech Information Technology</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
