import React from 'react';
import { User, GraduationCap, MapPin, Calendar, BookOpen, Code2, Award, Mail, ExternalLink, Sparkles, Terminal } from 'lucide-react';

interface AboutRahulSectionProps {
  onNavigateContact: () => void;
}

export const AboutRahulSection: React.FC<AboutRahulSectionProps> = ({ onNavigateContact }) => {
  return (
    <section id="about" className="py-24 relative bg-[#05070d] cyber-grid overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <User className="w-3.5 h-3.5" />
            <span>Visionary Founder & Lead Architect</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Rahul R</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Creator of Eagle Technology — fusing 3D interactive graphics, artificial intelligence, and media creation.
          </p>
        </div>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Avatar / Futuristic Profile Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 relative overflow-hidden text-center group">
              {/* Glowing Corner Accents */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

              {/* Holographic Avatar Graphic */}
              <div className="relative w-36 h-36 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 p-[2px] shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#070b14] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Stylized Avatar Illustration */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-b from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-inner">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="absolute bottom-1.5 text-[9px] font-mono tracking-widest text-cyan-400/90 uppercase">
                    ARCHITECT
                  </div>
                </div>
              </div>

              {/* Core Name & Title */}
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Rahul R
              </h3>
              <p className="text-cyan-400 text-sm font-mono mt-1 font-semibold">
                Founder · Eagle Technology
              </p>
              <p className="text-xs text-slate-400 mt-2">
                18-Year-Old Technologist & Full-Stack AI Engineer
              </p>

              {/* Status Pill */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Currently pursuing B.Tech Information Technology</span>
              </div>

              {/* Verified Profile Matrix List */}
              <div className="mt-6 pt-5 border-t border-cyan-500/15 text-left space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">Name</span>
                  <span className="text-white font-semibold">Rahul R</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">Age</span>
                  <span className="text-cyan-300 font-semibold">18 Years</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">College</span>
                  <span className="text-white font-semibold">Arunai Engineering College</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">Degree</span>
                  <span className="text-cyan-300 font-semibold">B.Tech Information Technology</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-500">Status</span>
                  <span className="text-emerald-400 font-semibold">Enrolled & Active Student</span>
                </div>
              </div>

              {/* Contact Button */}
              <div className="mt-6">
                <button
                  onClick={onNavigateContact}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Connect with Rahul R</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Vision, Biography & Core Competencies (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="rounded-2xl glass-panel border border-cyan-500/20 p-6 sm:p-8 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>The Vision Behind Eagle Technology</span>
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed">
                At age 18, <strong>Rahul R</strong> conceptualized and engineered <strong>Eagle Technology</strong> as a unified, high-performance ecosystem. Recognizing the friction between standalone AI text tools and disjointed video/photo editors, Rahul architected a single responsive platform combining real-time hardware-accelerated 3D graphics (WebGL Three.js) with state-of-the-art multimodal reasoning.
              </p>

              <p className="text-slate-300 text-sm leading-relaxed">
                As a student of <strong>B.Tech Information Technology at Arunai Engineering College</strong>, Rahul focuses on pushing the boundaries of edge computation, generative neural filters, and human-computer interfaces.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-cyan-500/20 space-y-1">
                  <p className="text-xs font-mono text-cyan-400 font-bold">ACADEMIC FOUNDATION</p>
                  <p className="text-xs text-slate-300">
                    B.Tech IT curriculum at Arunai Engineering College with focus on Data Structures, Algorithms, Computer Networks, and AI.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-cyan-500/20 space-y-1">
                  <p className="text-xs font-mono text-cyan-400 font-bold">SOFTWARE ETHOS</p>
                  <p className="text-xs text-slate-300">
                    Zero-compromise engineering: type-safe TypeScript, real-time Canvas rendering, and clean UI without bloat.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Skills & Stack */}
            <div className="rounded-2xl glass-panel border border-cyan-500/20 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Technical Proficiencies</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">Core Stack</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: 'TypeScript & React', level: 'Advanced', desc: 'Component Architecture' },
                  { name: 'Three.js & WebGL', level: 'Specialist', desc: '3D Procedural Scenes' },
                  { name: 'Python & AI/ML', level: 'Proficient', desc: 'Neural Models & LLMs' },
                  { name: 'Canvas 2D Pipeline', level: 'Advanced', desc: 'Real-Time Video VFX' },
                  { name: 'Express & Node.js', level: 'Full-Stack', desc: 'Server Architectures' },
                  { name: 'Tailwind CSS', level: 'Expert', desc: 'Futuristic Cyber UIs' },
                ].map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#070b14]/80 border border-slate-800 hover:border-cyan-500/40 transition-colors"
                  >
                    <p className="text-xs font-bold text-white">{skill.name}</p>
                    <p className="text-[10px] text-cyan-400 font-mono">{skill.level}</p>
                    <p className="text-[10px] text-slate-400">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
