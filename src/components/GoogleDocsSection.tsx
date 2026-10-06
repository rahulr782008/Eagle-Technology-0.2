import React, { useState, useEffect } from 'react';
import { FileText, Plus, ExternalLink, RefreshCw, Trash2, Eye, Sparkles, Check, AlertTriangle, X, Download, Lock, CheckCircle2 } from 'lucide-react';
import { GoogleDocFile, GoogleDocDetail, listGoogleDocs, getGoogleDoc, createGoogleDoc, deleteGoogleDoc } from '../lib/googleDocs';
import { getAccessToken, googleSignIn, FirebaseUser } from '../lib/firebase';

interface GoogleDocsSectionProps {
  currentUser: FirebaseUser | null;
}

export const GoogleDocsSection: React.FC<GoogleDocsSectionProps> = ({ currentUser }) => {
  const [docs, setDocs] = useState<GoogleDocFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<GoogleDocDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('Eagle Technology · Technical Specification');
  const [newDocContent, setNewDocContent] = useState(
    `EAGLE TECHNOLOGY PROJECT REPORT\nFounder: Rahul R (Age 18)\nInstitution: Arunai Engineering College\nDegree: B.Tech Information Technology\n\n1. EXECUTIVE SUMMARY\nEagle Technology is a next-generation 3D AI and creative suite providing real-time reasoning, photo enhancement, video editing, and Google Workspace integration.\n\n2. ARCHITECTURE OVERVIEW\n- Full-Stack React + Express + WebGL Three.js\n- Gemini 3.8 & 3.1 Pro Intelligence Engine\n- Firebase Authentication & Firestore persistence\n- Google Docs REST API synchronization\n\nGenerated automatically via Eagle Docs Studio.`
  );
  const [createdDocResult, setCreatedDocResult] = useState<{ title: string; webViewLink?: string } | null>(null);

  // Destructive Confirmation Modal State
  const [docToDelete, setDocToDelete] = useState<GoogleDocFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load Docs when authenticated
  const loadDocuments = async () => {
    const token = getAccessToken();
    if (!token) {
      setDocs([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const files = await listGoogleDocs(token);
      setDocs(files);
    } catch (err: any) {
      console.error('Failed to load Google Docs:', err);
      setErrorMessage(err.message || 'Unable to list Google Docs. Verify OAuth permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadDocuments();
    }
  }, [currentUser]);

  // Connect Google Account with Docs Scope
  const handleConnectDocs = async () => {
    try {
      setIsLoading(true);
      await googleSignIn();
      await loadDocuments();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate Google Docs.');
    } finally {
      setIsLoading(false);
    }
  };

  // Inspect Doc Content
  const handleViewDoc = async (file: GoogleDocFile) => {
    const token = getAccessToken();
    if (!token) return;

    setIsLoadingDetail(true);
    try {
      const detail = await getGoogleDoc(file.id, token);
      setSelectedDoc(detail);
    } catch (err: any) {
      console.error('Error fetching doc:', err);
      alert(`Could not fetch document content: ${err.message}`);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Create New Doc
  const handleCreateDocument = async () => {
    const token = getAccessToken();
    if (!token) {
      alert('Please connect your Google account first to create Google Docs.');
      return;
    }

    if (!newDocTitle.trim()) return;

    setIsCreating(true);
    setCreatedDocResult(null);
    try {
      const res = await createGoogleDoc(newDocTitle.trim(), newDocContent, token);
      setCreatedDocResult({ title: res.title, webViewLink: res.webViewLink });
      await loadDocuments();
    } catch (err: any) {
      alert(`Failed to create Google Doc: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Confirm and Execute Deletion (Mandatory for Destructive Workspace Operations)
  const executeDeleteDoc = async () => {
    if (!docToDelete) return;
    const token = getAccessToken();
    if (!token) return;

    setIsDeleting(true);
    try {
      await deleteGoogleDoc(docToDelete.id, token);
      setDocs((prev) => prev.filter((d) => d.id !== docToDelete.id));
      if (selectedDoc?.documentId === docToDelete.id) {
        setSelectedDoc(null);
      }
      setDocToDelete(null);
    } catch (err: any) {
      alert(`Failed to delete document: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDocs = docs.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="google-docs" className="py-24 relative bg-[#060912] cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-cyan-500/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Google Workspace Integration · Google Docs & Drive API</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Eagle <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Docs Studio</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Create, read, and manage Google Docs directly from Eagle Technology with end-user permission. Perfect for engineering research, academic papers, and AI project documentation.
            </p>
          </div>

          {/* Connect / Refresh Bar */}
          <div className="flex items-center gap-3">
            {getAccessToken() ? (
              <button
                onClick={loadDocuments}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white text-xs font-mono transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Refresh Docs</span>
              </button>
            ) : (
              <button
                onClick={handleConnectDocs}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all font-mono"
              >
                <Lock className="w-4 h-4" />
                <span>Connect Google Docs</span>
              </button>
            )}
          </div>
        </div>

        {/* Auth Notice Banner */}
        {!getAccessToken() && (
          <div className="mb-8 p-6 rounded-2xl glass-panel-glow border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Google Workspace Access Required</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Connect your Google account with permission to see, edit, create, and manage your Google Docs. Your files stay securely in your own Google Drive.
                </p>
              </div>
            </div>

            <button
              onClick={handleConnectDocs}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all shrink-0 font-mono"
            >
              Sign In with Google Docs
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-200 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Google Docs File Browser (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl glass-panel border border-cyan-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white font-mono uppercase">
                    Your Google Docs ({filteredDocs.length})
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Google Drive</span>
              </div>

              {/* Search Bar */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by title..."
                className="w-full glass-input py-2 px-3 rounded-xl text-xs font-mono"
              />

              {/* Document List */}
              <div className="space-y-2 max-h-[480px] overflow-y-auto no-scrollbar">
                {isLoading ? (
                  <div className="py-12 text-center text-xs font-mono text-cyan-400 space-y-2">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-cyan-400" />
                    <span>Loading your Google Docs...</span>
                  </div>
                ) : filteredDocs.length > 0 ? (
                  filteredDocs.map((file) => (
                    <div
                      key={file.id}
                      className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between gap-2 group ${
                        selectedDoc?.documentId === file.id
                          ? 'bg-cyan-950/70 border-cyan-400 shadow-md shadow-cyan-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                      }`}
                    >
                      <button
                        onClick={() => handleViewDoc(file)}
                        className="flex-1 flex items-start gap-3 text-left overflow-hidden"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            Modified: {new Date(file.modifiedTime).toLocaleDateString()}
                          </p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                            title="Open in Google Docs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => setDocToDelete(file)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-500 text-xs font-mono">
                    {getAccessToken() ? 'No Google Docs found matching your query.' : 'Connect your Google account above to view files.'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Document Viewer / Creator (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Document Viewer Modal/Card if a doc is selected */}
            {selectedDoc ? (
              <div className="rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-base font-bold text-white truncate max-w-md">{selectedDoc.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://docs.google.com/document/d/${selectedDoc.documentId}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 hover:brightness-110"
                    >
                      <span>Edit in Google Docs</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setSelectedDoc(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#070b14] border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap max-h-[320px] overflow-y-auto no-scrollbar">
                  {selectedDoc.bodyText || '(Document contains no plain text elements or is empty)'}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Doc ID: {selectedDoc.documentId}</span>
                  <span>Characters: {selectedDoc.bodyText.length}</span>
                </div>
              </div>
            ) : null}

            {/* Document Creator Suite */}
            <div className="rounded-2xl glass-panel border border-cyan-500/20 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-mono uppercase">
                    Create & Export to Google Docs
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">Google Docs API</span>
              </div>

              {/* Template Quick Selectors */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Document Templates:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: 'B.Tech IT Project Report',
                      title: 'Eagle Technology · B.Tech IT Research Paper',
                      content: `TITLE: Next-Generation 3D Generative AI Architecture\nAUTHOR: Rahul R, B.Tech Information Technology\nINSTITUTION: Arunai Engineering College, Tiruvannamalai\n\nABSTRACT:\nThis paper examines the integration of hardware-accelerated 3D WebGL meshes with cloud-based multimodal LLMs (Gemini 3.8 Flash) and timeline video VFX.\n\nMETHODOLOGY:\n1. Client-Side Rendering with Three.js\n2. Real-time Canvas Neural Filters\n3. Google Workspace Docs & Drive Cloud Synchronization`,
                    },
                    {
                      label: 'AI Chatbot Transcript',
                      title: 'Eagle AI · STEM Tutoring & Code Notes',
                      content: `EAGLE AI STUDY TRANSCRIPT\nPlatform: Eagle Technology\nCreated by: Rahul R\n\nTOPIC: Algorithmic Optimization & Calculus\n- Proof: Eigenvectors in Linear Transformation\n- Code Snippet: WebGL Shader Matrix Multiplication\n- Reference: Verified via Google Search Grounding`,
                    },
                    {
                      label: 'Creative Media LUT Guide',
                      title: 'Eagle Photo & Video Studio · LUT Specifications',
                      content: `EAGLE TECHNOLOGY CREATIVE SPECIFICATION\n\nPRESETS:\n1. Eagle HDR Boost: Contrast +35%, Saturation +30%, Vignette 25%\n2. Cyberpunk 2099: Hue-Rotate 195deg, Cyber Glow 40%\n3. Veo 3 Video Reel: 720p 60fps, Aspect 16:9, HUD Reticle Active`,
                    },
                  ].map((tmpl, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setNewDocTitle(tmpl.title);
                        setNewDocContent(tmpl.content);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doc Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Document Title *</label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full glass-input py-2 px-3 rounded-xl text-xs sm:text-sm font-mono"
                  placeholder="e.g. Eagle Tech Project Specification"
                />
              </div>

              {/* Doc Body Content */}
              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Document Text Content</label>
                <textarea
                  rows={6}
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl text-xs sm:text-sm font-mono resize-none leading-relaxed text-slate-200"
                  placeholder="Enter text to write directly into Google Docs..."
                />
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={handleCreateDocument}
                  disabled={isCreating || !newDocTitle.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreating ? 'Creating Google Doc in your Drive...' : 'Export to Google Docs'}</span>
                </button>
              </div>

              {/* Created Success Banner */}
              {createdDocResult && (
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Google Doc "{createdDocResult.title}" created successfully!</span>
                  </div>
                  {createdDocResult.webViewLink && (
                    <a
                      href={createdDocResult.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded bg-emerald-400 text-slate-950 font-bold hover:brightness-110 flex items-center gap-1"
                    >
                      <span>Open Doc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Mandatory User Confirmation Modal for Destructive Operations */}
      {docToDelete && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#070b14] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Confirm Document Deletion</h4>
                <p className="text-xs text-rose-400 font-mono">Destructive Action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to delete the Google Doc <strong className="text-white">"{docToDelete.name}"</strong>? This will remove the document from your Google Drive. This action cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setDocToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl glass-panel text-slate-300 text-xs font-mono hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteDoc}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs font-mono hover:bg-rose-500 transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Confirm & Delete Doc'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
