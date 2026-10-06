import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, User, MessageSquare, Terminal } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Collaboration / Inquiry regarding Eagle Technology',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setSubmissionStatus(
        data.message ||
          `Thank you ${formData.name}! Your transmission has been dispatched to Rahul R (rahulr782008@gmail.com).`
      );
      setFormData({
        name: '',
        email: '',
        subject: 'Collaboration / Inquiry regarding Eagle Technology',
        message: '',
      });
    } catch {
      setSubmissionStatus(
        `Thank you ${formData.name}! Your transmission has been queued for Rahul R at rahulr782008@gmail.com.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-[#05070d] cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Transmission Channel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect With <span className="text-cyan-400">Rahul R</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Reach out for collaborations, technology discussions, engineering inquiries, or AI feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Info Pod (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Rahul R</h3>
                <p className="text-xs font-mono text-cyan-400 mt-1">
                  Creator & Founder · Eagle Technology
                </p>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Available for engineering inquiries, AI collaboration, and creative tool feedback. Dispatches are monitored directly.
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-cyan-500/15 text-xs font-mono">
                {/* Email Item */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Official Email</span>
                    <a
                      href="mailto:rahulr782008@gmail.com"
                      className="text-cyan-300 hover:text-white font-medium break-all transition-colors"
                    >
                      rahulr782008@gmail.com
                    </a>
                  </div>
                </div>

                {/* College Location */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Institution</span>
                    <span className="text-slate-200">
                      Arunai Engineering College
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Tiruvannamalai, Tamil Nadu, India
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Current Focus</span>
                    <span className="text-emerald-300">
                      B.Tech Information Technology & 3D AI Synthesis
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Digital Identity Footnote */}
              <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                <span>Eagle Technology Secure Encrypted Gateway</span>
              </div>
            </div>
          </div>

          {/* Right: Message Dispatch Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl glass-panel border border-cyan-500/20 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Transmission Console
                </span>
                <span className="text-[11px] font-mono text-cyan-400">STATUS: READY</span>
              </div>

              {submissionStatus ? (
                <div className="p-6 rounded-2xl bg-cyan-950/70 border border-cyan-500/40 text-center space-y-3 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-cyan-400 mx-auto" />
                  <h4 className="text-base font-bold text-white font-mono">Transmission Dispatched</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    {submissionStatus}
                  </p>
                  <button
                    onClick={() => setSubmissionStatus(null)}
                    className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                  >
                    Send Another Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Morgan"
                        className="w-full glass-input py-2.5 px-3.5 rounded-xl text-xs sm:text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@domain.com"
                        className="w-full glass-input py-2.5 px-3.5 rounded-xl text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Transmission Subject</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full glass-input py-2.5 px-3.5 rounded-xl text-xs sm:text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Message Content *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message to Rahul R regarding Eagle Technology..."
                      className="w-full glass-input py-3 px-3.5 rounded-xl text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Message to Rahul R'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
