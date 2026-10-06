import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Image, Video, Sparkles, User, GraduationCap, Mail, Menu, X, ArrowUpRight, Music, LogIn, LogOut, FileText, Box } from 'lucide-react';
import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, FirebaseUser } from '../lib/firebase';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser: FirebaseUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate, currentUser }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign-in error:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Overview' },
    { id: '3d-models', label: '3D Models', icon: Box },
    { id: 'tutorials', label: '3D Tutorials', icon: Sparkles },
    { id: 'chatbot', label: 'AI Chatbot', icon: Bot },
    { id: 'photo-editor', label: 'Photo Studio', icon: Image },
    { id: 'video-editor', label: 'Video Studio', icon: Video },
    { id: 'music-studio', label: 'Music Studio', icon: Music },
    { id: 'google-docs', label: 'Google Docs', icon: FileText },
    { id: 'creative-tools', label: 'Creative Tools', icon: Sparkles },
    { id: 'published-works', label: 'Showcase' },
    { id: 'about', label: 'About Rahul R', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070d]/90 backdrop-blur-xl border-b border-cyan-500/15 shadow-lg shadow-black/40 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <button
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
              <div className="w-full h-full bg-[#070b14] rounded-xl flex items-center justify-center overflow-hidden">
                <svg
                  className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L15 8L22 9L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9L9 8L12 2Z" fill="rgba(6, 182, 212, 0.2)" />
                  <path d="M7 12L12 6L17 12" />
                  <path d="M9 16L12 13L15 16" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  EAGLE <span className="text-cyan-400">TECH</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                  AI 3D
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                BY RAHUL R · ARUNAI ENGG
              </p>
            </div>
          </button>

          {/* Desktop Nav Items with Framer-Motion Sliding Layout Indicator */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-950/40 p-1 rounded-2xl border border-slate-800/60 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-3 py-1.5 text-xs font-medium rounded-xl transition-colors duration-200 ${
                    isActive ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-cyan-950/80 border border-cyan-400/50 rounded-xl shadow-sm shadow-cyan-500/25"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Auth & Quick Launch */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-cyan-400 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 text-xs font-bold">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg glass-panel hover:text-rose-400 text-slate-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSignIn}
                disabled={isAuthLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-panel text-xs text-cyan-300 hover:text-white hover:border-cyan-500/50 font-mono transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Sign-In</span>
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('chatbot')}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <span>Launch AI</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Framer-Motion AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="xl:hidden bg-[#070b14]/95 backdrop-blur-2xl border-b border-cyan-500/20 px-4 pt-3 pb-6 mt-3 overflow-hidden"
          >
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      isActive
                        ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs text-slate-300 font-mono">{currentUser.displayName || currentUser.email}</span>
                  <button onClick={handleSignOut} className="text-xs text-rose-400 font-mono">Sign Out</button>
                </div>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="w-full py-2 rounded-lg glass-panel text-cyan-300 text-xs font-mono text-center"
                >
                  Sign In with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
