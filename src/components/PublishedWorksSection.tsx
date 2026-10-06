import React, { useState } from 'react';
import { Heart, Eye, Play, Sparkles, Filter, X, Download } from 'lucide-react';
import { PublishedWork } from '../types';

interface PublishedWorksSectionProps {
  works: PublishedWork[];
  onLike: (id: string) => void;
}

export const PublishedWorksSection: React.FC<PublishedWorksSectionProps> = ({ works, onLike }) => {
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'design'>('all');
  const [activeModalWork, setActiveModalWork] = useState<PublishedWork | null>(null);

  const filteredWorks = works.filter((w) => (filter === 'all' ? true : w.type === filter));

  return (
    <section id="published-works" className="py-20 relative bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-cyan-500/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community & Platform Masterpieces</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Published <span className="text-cyan-400">Works & Projects</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Curated gallery of photos, videos, and designs created with Eagle Technology.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl glass-panel border border-cyan-500/20">
            {(['all', 'photo', 'video', 'design'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                  filter === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Works' : cat === 'photo' ? 'AI Photos' : cat === 'video' ? 'AI Videos' : '3D Designs'}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorks.map((work) => (
            <div
              key={work.id}
              className="rounded-2xl glass-panel-glow border border-cyan-500/20 overflow-hidden flex flex-col group hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Media Thumbnail */}
              <div
                onClick={() => setActiveModalWork(work)}
                className="relative h-56 bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={work.mediaUrl}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay Badge for Type */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {work.type === 'video' ? 'AI Video' : work.type === 'photo' ? 'AI Photo' : '3D Art'}
                  </span>
                </div>

                {work.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-black/80 text-white flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>Inspect</span>
                  </span>
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {work.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {work.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {work.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Footer Bar */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-slate-300 font-medium">{work.creator}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLike(work.id);
                    }}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500/30 text-rose-400" />
                    <span>{work.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Inspect Lightbox Modal */}
      {activeModalWork && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-[#070b14] border border-cyan-500/30 rounded-2xl overflow-hidden p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <div>
                <h3 className="text-lg font-bold text-white">{activeModalWork.title}</h3>
                <p className="text-xs font-mono text-cyan-400">{activeModalWork.creator} · {activeModalWork.timestamp}</p>
              </div>
              <button
                onClick={() => setActiveModalWork(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[60vh] bg-black/40 rounded-xl overflow-hidden">
              <img
                src={activeModalWork.mediaUrl}
                alt={activeModalWork.title}
                className="max-h-[55vh] object-contain rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm text-slate-300">{activeModalWork.description}</p>
              {activeModalWork.filterDetails && (
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-300">
                  <span className="text-slate-400">Filter parameters: </span>
                  {activeModalWork.filterDetails}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => onLike(activeModalWork.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs text-rose-400 hover:text-rose-300 font-mono"
              >
                <Heart className="w-4 h-4 fill-rose-500/30" />
                <span>Like ({activeModalWork.likes})</span>
              </button>

              <div className="flex gap-2">
                <a
                  href={activeModalWork.mediaUrl}
                  download={`EagleTech-${activeModalWork.title}.jpg`}
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:brightness-110"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Artwork</span>
                </a>
                <button
                  onClick={() => setActiveModalWork(null)}
                  className="px-4 py-2 rounded-lg glass-panel text-slate-300 text-xs hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
