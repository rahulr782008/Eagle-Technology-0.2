import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  MapPin,
  CheckCircle2,
  Cpu,
  Code2,
  Sparkles,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Compass,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type JourneyCategory = 'all' | 'academic' | 'skills';

interface Milestone {
  id: string;
  year: string;
  period: string;
  title: string;
  institution: string;
  location?: string;
  category: 'academic' | 'skills';
  badge: string;
  badgeColor: string;
  description: string;
  highlights: string[];
  skills: string[];
  icon: React.ElementType;
}

const MILESTONES: Milestone[] = [
  {
    id: 'btech-arunai',
    year: '2024 – Present',
    period: 'Current Undergraduate Studies',
    title: 'Bachelor of Technology (B.Tech) in Information Technology',
    institution: 'Arunai Engineering College',
    location: 'Tiruvannamalai, Tamil Nadu, India',
    category: 'academic',
    badge: 'Undergraduate · In Progress',
    badgeColor: 'border-cyan-400 bg-cyan-950/80 text-cyan-300',
    description:
      'Pursuing rigorous engineering education in Information Technology. Focusing on advanced computational algorithms, data structures, cloud architectures, network protocols, and artificial intelligence integration.',
    highlights: [
      'Top quartile performance across foundational computing courses',
      'Actively exploring distributed systems, modern web runtimes, and databases',
      'Founded and architected the Eagle Technology AI & 3D ecosystem as flagship collegiate innovation',
    ],
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (C++/Java)',
      'Database Management Systems',
      'Computer Architecture',
      'Cloud & Web Technologies',
    ],
    icon: GraduationCap,
  },
  {
    id: 'eagle-tech-innovation',
    year: '2025 – 2026',
    period: 'Flagship Platform Engineering',
    title: 'Eagle Technology 3D AI Platform Architecture',
    institution: 'Independent Research & Development',
    category: 'skills',
    badge: 'Flagship Engineering',
    badgeColor: 'border-sky-400 bg-sky-950/80 text-sky-300',
    description:
      'Architected and implemented a next-generation creative platform combining Three.js hardware-accelerated 3D graphics, multimodal Google Gemini 3.8 Flash intelligence, real-time photo/video filters, and Google Docs Workspace integration.',
    highlights: [
      'Built 5 procedural Three.js WebGL models with CAD-grade exploded assembly view',
      'Integrated Google GenAI SDK for multi-turn chat, prompt enhancement, and audio transcription',
      'Engineered interactive video timeline editor and HTML5 Canvas image grading suite',
    ],
    skills: [
      'Three.js WebGL',
      'TypeScript & React 19',
      'Gemini Multimodal API',
      'Canvas 2D Hardware Acceleration',
      'REST & Express Backends',
    ],
    icon: Sparkles,
  },
  {
    id: 'fullstack-mastery',
    year: '2023 – 2024',
    period: 'Skill Acceleration & Web Systems',
    title: 'Modern Full-Stack & Spatial Web Engineering',
    institution: 'Self-Directed Applied Labs & Open Source',
    category: 'skills',
    badge: 'Skill Mastery',
    badgeColor: 'border-indigo-400 bg-indigo-950/80 text-indigo-300',
    description:
      'Deep dive into asynchronous JavaScript/TypeScript paradigms, modern reactive user interfaces, component design systems, and client-server network protocols.',
    highlights: [
      'Developed modular component architectures with reusable UI patterns',
      'Explored state synchronization, token caching, and real-time event loops',
      'Mastered Tailwind CSS utility workflows and responsive mobile layouts',
    ],
    skills: [
      'JavaScript ES6+',
      'React & Virtual DOM',
      'Node.js & Express',
      'Tailwind CSS',
      'Git & Version Control',
    ],
    icon: Code2,
  },
  {
    id: 'higher-secondary',
    year: '2022 – 2024',
    period: 'Higher Secondary Education',
    title: 'Higher Secondary Schooling (11th & 12th Grade)',
    institution: 'Tamil Nadu State Board',
    location: 'Tamil Nadu, India',
    category: 'academic',
    badge: 'Graduated With Distinction',
    badgeColor: 'border-emerald-400 bg-emerald-950/80 text-emerald-300',
    description:
      'Completed rigorous higher secondary science and mathematics curriculum with specialization in Computer Science, Mathematics, Physics, and Chemistry.',
    highlights: [
      'Graduated with distinction and academic honors in Computer Science',
      'Built strong analytical foundation in calculus, linear algebra, and mechanics',
      'Wrote early algorithmic problem solvers in C++ and Python',
    ],
    skills: [
      'Advanced Mathematics',
      'Physics & Mechanics',
      'Computer Science Fundamentals',
      'Algorithmic Logic',
      'Python & C++',
    ],
    icon: BookOpen,
  },
  {
    id: 'early-foundations',
    year: '2020 – 2022',
    period: 'Foundational Curiosity & Early Coding',
    title: 'Foundational Computing & Creative Coding Explorations',
    institution: 'Early Technical Discovery',
    category: 'skills',
    badge: 'Technical Spark',
    badgeColor: 'border-amber-400 bg-amber-950/80 text-amber-300',
    description:
      'Wrote first lines of code and explored computer hardware fundamentals, digital media editing tools, and early web page design.',
    highlights: [
      'Learned fundamentals of computer software, hardware components, and operating systems',
      'Explored digital creative software and photo/video editing workflows',
      'Built first interactive web scripts and command-line experiments',
    ],
    skills: [
      'HTML5 & CSS3',
      'Python Basics',
      'Digital Media Tools',
      'Hardware Principles',
      'Problem Decomposition',
    ],
    icon: Cpu,
  },
];

export const EducationSection: React.FC = () => {
  const [filter, setFilter] = useState<JourneyCategory>('all');
  const [expandedId, setExpandedId] = useState<string | null>('btech-arunai');

  const filteredMilestones = MILESTONES.filter((m) => {
    if (filter === 'all') return true;
    return m.category === filter;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="education" className="py-24 relative bg-[#060912] cyber-grid overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Excellence & Technical Trajectory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Academic & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Skill-Building Journey</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Trace the educational milestones, institutional training, and applied software engineering breakthroughs of <strong>Rahul R</strong>.
          </p>
        </div>

        {/* Quick Credentials Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-5xl mx-auto">
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Current Program</span>
            <p className="text-sm font-bold text-white">B.Tech in IT</p>
            <p className="text-[11px] text-cyan-400 font-mono">Undergraduate Active</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Institution</span>
            <p className="text-sm font-bold text-white">Arunai Engg College</p>
            <p className="text-[11px] text-slate-400 font-mono">Tiruvannamalai, TN</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Flagship Innovation</span>
            <p className="text-sm font-bold text-white">Eagle Technology</p>
            <p className="text-[11px] text-sky-400 font-mono">3D AI Studio Suite</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 text-center space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Engineering Age</span>
            <p className="text-sm font-bold text-white">18 Years Old</p>
            <p className="text-[11px] text-emerald-400 font-mono">Active Creator</p>
          </div>
        </div>

        {/* Interactive Category Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-md gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Milestones ({MILESTONES.length})
            </button>
            <button
              onClick={() => setFilter('academic')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'academic'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Academic Degrees (2)
            </button>
            <button
              onClick={() => setFilter('skills')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                filter === 'skills'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Engineering & Skills (3)
            </button>
          </div>
        </div>

        {/* The Vertical Chronological Timeline */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Vertical Connecting Central Spine */}
          <div className="hidden sm:block absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-cyan-400 via-sky-500 to-indigo-500/20 pointer-events-none" />

          {/* Timeline Nodes */}
          <div className="space-y-8 sm:space-y-10">
            {filteredMilestones.map((milestone, index) => {
              const Icon = milestone.icon;
              const isExpanded = expandedId === milestone.id;

              return (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="relative flex flex-col sm:flex-row gap-6 items-start"
                >
                  {/* Timeline Node Badge with Glow */}
                  <div className="relative shrink-0 z-10 sm:pt-1">
                    <div className="w-16 h-16 rounded-2xl bg-[#070b14] border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    {/* Pulsing indicator on current college card */}
                    {milestone.id === 'btech-arunai' && (
                      <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border border-[#070b14]" />
                      </span>
                    )}
                  </div>

                  {/* Timeline Card Body */}
                  <div className="flex-1 w-full rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-7 space-y-4 hover:border-cyan-400/50 transition-all bg-gradient-to-b from-[#070b14]/90 to-[#04060b]/90">
                    
                    {/* Header Row: Badge & Dates */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-cyan-500/15">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${milestone.badgeColor}`}>
                          {milestone.badge}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {milestone.period}
                        </span>
                      </div>
                      
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-xl border border-cyan-500/20 w-fit">
                        <Calendar className="w-3.5 h-3.5 text-cyan-300" />
                        <span className="font-bold">{milestone.year}</span>
                      </div>
                    </div>

                    {/* Milestone Title & Institution */}
                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {milestone.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300 font-mono">
                        <span className="text-cyan-300 font-semibold">{milestone.institution}</span>
                        {milestone.location && (
                          <>
                            <span className="text-slate-600">·</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {milestone.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {milestone.description}
                    </p>

                    {/* Expandable Key Highlights & Skills */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleExpand(milestone.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Key Highlights & Skills' : 'View Key Highlights & Skills'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mt-4 space-y-4 pt-3 border-t border-slate-800/80 overflow-hidden"
                          >
                            {/* Accomplishments Bullet Points */}
                            <div className="space-y-2">
                              <p className="text-[11px] font-mono uppercase text-slate-400">
                                Key Accomplishments & Focus:
                              </p>
                              <div className="space-y-1.5">
                                {milestone.highlights.map((h, i) => (
                                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                    <span>{h}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Skills Tags */}
                            <div className="space-y-2">
                              <p className="text-[11px] font-mono uppercase text-slate-400">
                                Acquired Competencies:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {milestone.skills.map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-cyan-300 text-xs font-mono border border-cyan-500/20"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Closing Academic Philosophy Quote */}
        <div className="mt-16 max-w-3xl mx-auto p-6 sm:p-7 rounded-3xl glass-panel border border-cyan-500/20 text-center space-y-3 bg-gradient-to-r from-cyan-950/20 via-slate-900/40 to-blue-950/20">
          <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
            &ldquo;Engineering is not merely writing code—it is synthesizing rigorous mathematical foundations, institutional discipline, and creative innovation into technology that elevates human potential.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
            <span className="font-bold text-white">Rahul R</span>
            <span className="text-slate-600">·</span>
            <span>B.Tech IT, Arunai Engineering College</span>
          </div>
        </div>

      </div>
    </section>
  );
};
