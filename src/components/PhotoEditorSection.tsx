import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Sliders, Eye, Download, Share2, Sparkles, RefreshCw, ZoomIn, Check, SlidersHorizontal, Maximize2, X, Wand2, ImagePlus } from 'lucide-react';
import { PhotoFilterSettings, PublishedWork } from '../types';

interface PhotoEditorSectionProps {
  onPublish: (work: PublishedWork) => void;
}

const DEFAULT_SETTINGS: PhotoFilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 0,
  blur: 0,
  vignette: 0,
  hueRotate: 0,
  sharpness: 0,
  sepia: 0,
  invert: 0,
  cyberGlow: 0,
};

const SAMPLE_PHOTOS = [
  {
    id: 'eagle',
    name: 'Cybernetic Eagle',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cyberpunk',
    name: 'Neo Cyber City',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'portrait',
    name: 'AI Neural Subject',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'futuristic',
    name: 'Quantum Architecture',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
];

export const PhotoEditorSection: React.FC<PhotoEditorSectionProps> = ({ onPublish }) => {
  const [imageSrc, setImageSrc] = useState<string>(SAMPLE_PHOTOS[0].url);
  const [imageTitle, setImageTitle] = useState('Cybernetic Eagle Flight');
  const [settings, setSettings] = useState<PhotoFilterSettings>(DEFAULT_SETTINGS);
  const [splitSliderPos, setSplitSliderPos] = useState<number>(50);
  const [isComparing, setIsComparing] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [aspectRatio, setAspectRatio] = useState<string>('free');
  
  // AI Generator & Advisor State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGeneratingNewImage, setIsGeneratingNewImage] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([]);
  
  // Modals & Feedback
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPublishedNotification, setIsPublishedNotification] = useState(false);
  const [isSavedNotification, setIsSavedNotification] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      originalImageRef.current = img;
      renderCanvas();
    };
  }, [imageSrc]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetWidth = img.naturalWidth || 800;
    let targetHeight = img.naturalHeight || 600;

    let srcX = 0;
    let srcY = 0;
    let srcW = img.naturalWidth || 800;
    let srcH = img.naturalHeight || 600;

    if (aspectRatio === '1:1') {
      const minDim = Math.min(srcW, srcH);
      srcX = (srcW - minDim) / 2;
      srcY = (srcH - minDim) / 2;
      srcW = minDim;
      srcH = minDim;
      targetWidth = 1000;
      targetHeight = 1000;
    } else if (aspectRatio === '16:9') {
      srcH = srcW * (9 / 16);
      if (srcH > img.naturalHeight) {
        srcH = img.naturalHeight;
        srcW = srcH * (16 / 9);
      }
      srcX = (img.naturalWidth - srcW) / 2;
      srcY = (img.naturalHeight - srcH) / 2;
      targetWidth = 1280;
      targetHeight = 720;
    } else if (aspectRatio === '9:16') {
      srcW = srcH * (9 / 16);
      if (srcW > img.naturalWidth) {
        srcW = img.naturalWidth;
        srcH = srcW * (16 / 9);
      }
      srcX = (img.naturalWidth - srcW) / 2;
      srcY = (img.naturalHeight - srcH) / 2;
      targetWidth = 720;
      targetHeight = 1280;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const filters = [
      `brightness(${settings.brightness + settings.exposure}%)`,
      `contrast(${settings.contrast}%)`,
      `saturate(${settings.saturation}%)`,
      `hue-rotate(${settings.hueRotate}deg)`,
      `blur(${settings.blur}px)`,
      `sepia(${settings.sepia}%)`,
      `invert(${settings.invert}%)`,
    ];

    ctx.save();
    ctx.filter = filters.join(' ');
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetWidth, targetHeight);
    ctx.restore();

    if (settings.cyberGlow > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(6, 182, 212, ${settings.cyberGlow / 250})`;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.restore();
    }

    if (settings.vignette > 0) {
      ctx.save();
      const gradient = ctx.createRadialGradient(
        targetWidth / 2,
        targetHeight / 2,
        targetWidth / 4,
        targetWidth / 2,
        targetHeight / 2,
        targetWidth * 0.7
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, `rgba(0, 0, 0, ${settings.vignette / 100})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, targetWidth, targetHeight);
      ctx.restore();
    }
  }, [settings, aspectRatio]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const applyPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    switch (presetName) {
      case 'eagle-hdr':
        setSettings({
          ...DEFAULT_SETTINGS,
          brightness: 110,
          contrast: 135,
          saturation: 130,
          vignette: 25,
          sharpness: 30,
          cyberGlow: 15,
        });
        break;
      case 'cyberpunk':
        setSettings({
          ...DEFAULT_SETTINGS,
          brightness: 105,
          contrast: 145,
          saturation: 160,
          hueRotate: 195,
          vignette: 35,
          cyberGlow: 40,
        });
        break;
      case 'synthwave':
        setSettings({
          ...DEFAULT_SETTINGS,
          brightness: 105,
          contrast: 125,
          saturation: 140,
          hueRotate: 310,
          vignette: 30,
          sepia: 15,
        });
        break;
      case 'studio':
        setSettings({
          ...DEFAULT_SETTINGS,
          brightness: 108,
          contrast: 115,
          saturation: 110,
          vignette: 10,
        });
        break;
      case 'obsidian':
        setSettings({
          ...DEFAULT_SETTINGS,
          brightness: 90,
          contrast: 155,
          saturation: 85,
          vignette: 55,
        });
        break;
      case 'hologram':
        setSettings({
          ...DEFAULT_SETTINGS,
          brightness: 120,
          contrast: 130,
          saturation: 200,
          hueRotate: 180,
          invert: 15,
          cyberGlow: 60,
        });
        break;
      case 'reset':
      default:
        setSettings(DEFAULT_SETTINGS);
        break;
    }
  };

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageSrc(e.target.result as string);
        setImageTitle(file.name.replace(/\.[^/.]+$/, ''));
        setSelectedPreset('custom');
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate or Edit Image with Gemini 3.1 Flash Image
  const handleAiGenerateImage = async (isEdit: boolean) => {
    setIsGeneratingNewImage(true);
    try {
      const payload: any = {
        prompt: aiPrompt || (isEdit ? 'Add glowing cybernetic wings' : 'Futuristic cybernetic eagle soaring through neon cyberpunk sky, 8k resolution'),
        aspectRatio: aspectRatio === 'free' ? '1:1' : aspectRatio,
      };

      if (isEdit && canvasRef.current) {
        try {
          payload.imageBase64 = canvasRef.current.toDataURL('image/png');
        } catch {
          payload.imageBase64 = imageSrc;
        }
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setImageSrc(data.imageUrl);
        setImageTitle(aiPrompt ? aiPrompt.slice(0, 30) : 'Eagle Neural Image');
        setSelectedPreset('custom');
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGeneratingNewImage(false);
    }
  };

  // AI Prompt Enhancement
  const handleAiEnhancePrompt = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/photo-enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt || 'Cinematic futuristic grade with crisp eagle clarity',
          currentSettings: settings,
        }),
      });
      const data = await response.json();
      if (data.enhancementTips) {
        setAiTips(data.enhancementTips);
      }
      if (data.recommendedSliders) {
        setSettings((prev) => ({
          ...prev,
          ...data.recommendedSliders,
        }));
      }
      if (data.suggestedPreset && data.suggestedPreset !== 'custom') {
        setSelectedPreset(data.suggestedPreset);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleDownload = (format: 'png' | 'jpeg') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = `EagleTech-${imageTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${format}`;
      link.href = canvas.toDataURL(`image/${format}`, 0.95);
      link.click();
    } catch {
      // Fallback if canvas is tainted by external image CORS
      const link = document.createElement('a');
      link.download = `EagleTech-${imageTitle.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      link.href = imageSrc;
      link.target = '_blank';
      link.click();
    }
  };

  const handleSave = () => {
    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 2500);
  };

  const handlePublish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dataUrl = imageSrc;
    try {
      dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    } catch {
      dataUrl = imageSrc;
    }

    const newWork: PublishedWork = {
      id: `photo-${Date.now()}`,
      type: 'photo',
      title: imageTitle,
      creator: 'Rahul R · Creator',
      description: `Neural enhancement using Eagle Tech Photo Studio. Preset: ${selectedPreset}. Contrast: ${settings.contrast}%, Saturation: ${settings.saturation}%.`,
      mediaUrl: dataUrl,
      timestamp: 'Just now',
      likes: 1,
      tags: ['AI Photo', selectedPreset, 'Eagle Tech', 'Rahul R'],
      filterDetails: `B:${settings.brightness}% C:${settings.contrast}% S:${settings.saturation}%`,
    };

    onPublish(newWork);
    setIsPublishedNotification(true);
    setTimeout(() => setIsPublishedNotification(false), 3000);
  };

  return (
    <section id="photo-editor" className="py-20 relative bg-[#05070d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-cyan-500/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Canvas & Gemini 3.1 Flash Image Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Eagle AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Photo Studio</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              High-fidelity neural editor with hardware acceleration, split-view comparison, and Gemini 3.1 Flash Image generation & editing.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition-colors"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Photo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
            />

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition-colors"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>Preview</span>
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition-colors"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save</span>
            </button>

            <button
              onClick={() => handleDownload('png')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition-colors"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export</span>
            </button>

            <button
              onClick={handlePublish}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        {isPublishedNotification && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
            <span>✓ Artwork successfully published to the Eagle Showcase gallery!</span>
            <span className="text-emerald-400 font-bold">BY RAHUL R</span>
          </div>
        )}
        {isSavedNotification && (
          <div className="mb-6 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono animate-in fade-in">
            ✓ Snapshot saved to active session memory.
          </div>
        )}

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Canvas & Split Viewport (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              className="relative rounded-2xl glass-panel-glow border border-cyan-500/30 overflow-hidden bg-[#070b14] min-h-[440px] flex items-center justify-center p-2"
            >
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-1 rounded bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                    {imageTitle}
                  </span>
                  <button
                    onClick={() => setIsComparing(!isComparing)}
                    className="pointer-events-auto text-[11px] font-mono px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-slate-300 hover:text-white border border-slate-700 hover:border-cyan-500/50 transition-colors"
                  >
                    {isComparing ? 'Split View: ON' : 'Split View: OFF'}
                  </button>
                </div>

                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="pointer-events-auto p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                  title="Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative max-h-[540px] overflow-hidden rounded-xl flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="max-h-[500px] w-auto max-w-full object-contain shadow-2xl rounded-lg"
                />

                {isComparing && originalImageRef.current && (
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg"
                    style={{ clipPath: `inset(0 ${100 - splitSliderPos}% 0 0)` }}
                  >
                    <img
                      src={imageSrc}
                      alt="Original Raw"
                      className="w-full h-full object-contain max-h-[500px]"
                    />
                    <div className="absolute top-4 left-4 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/30">
                      Original Raw
                    </div>
                  </div>
                )}

                {isComparing && (
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-cyan-400 cursor-ew-resize z-10 shadow-[0_0_12px_#38bdf8]"
                    style={{ left: `${splitSliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-cyan-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-lg">
                      <SlidersHorizontal className="w-3 h-3" />
                    </div>
                  </div>
                )}
              </div>

              {isComparing && (
                <div className="absolute bottom-3 left-4 right-4 z-20">
                  <div className="bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl border border-cyan-500/20 flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      Raw vs Enhanced:
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={splitSliderPos}
                      onChange={(e) => setSplitSliderPos(Number(e.target.value))}
                      className="w-full accent-cyan-400 cursor-ew-resize"
                    />
                    <span className="text-xs font-mono text-cyan-400 w-8 text-right">
                      {splitSliderPos}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Curated Sample Library Quick Select */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
                Sample Library:
              </span>
              {SAMPLE_PHOTOS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setImageSrc(item.url);
                    setImageTitle(item.name);
                    setSelectedPreset('custom');
                  }}
                  className="flex items-center gap-2 p-1.5 rounded-xl glass-panel hover:border-cyan-500/50 shrink-0 transition-all text-left"
                >
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-xs text-slate-300 font-medium pr-2">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Gemini 3.1 Flash Image Generator & AI Prompt Director */}
            <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  <span>Gemini 3.1 Flash Image Generator & Director</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">
                  gemini-3.1-flash-image
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Generate a high-tech eagle with holographic wings or describe edits..."
                  className="flex-1 glass-input py-2 px-3 rounded-lg text-xs"
                />
              </div>

              {/* Generation Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => handleAiGenerateImage(false)}
                  disabled={isGeneratingNewImage}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>{isGeneratingNewImage ? 'Generating Image...' : 'Generate New Image'}</span>
                </button>

                <button
                  onClick={() => handleAiGenerateImage(true)}
                  disabled={isGeneratingNewImage}
                  className="px-3.5 py-1.5 rounded-lg glass-panel text-cyan-300 hover:text-white border-cyan-500/40 text-xs font-mono disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Edit Current Image with AI</span>
                </button>

                <button
                  onClick={handleAiEnhancePrompt}
                  disabled={isAiLoading}
                  className="px-3.5 py-1.5 rounded-lg glass-panel text-slate-300 hover:text-white text-xs font-mono disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAiLoading ? 'Analyzing...' : 'Calibrate Sliders with AI'}</span>
                </button>
              </div>

              {aiTips.length > 0 && (
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/20 space-y-1">
                  <p className="text-[11px] font-mono text-cyan-300 font-bold uppercase">
                    Neural Recommendations:
                  </p>
                  <ul className="text-xs text-slate-300 list-disc list-inside space-y-0.5">
                    {aiTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Controls & Presets (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">Neural Presets</h3>
                </div>
                <button
                  onClick={() => applyPreset('reset')}
                  className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'eagle-hdr', label: 'Eagle HDR Boost', desc: 'Clarity & Dynamic Range' },
                  { id: 'cyberpunk', label: 'Cyberpunk 2099', desc: 'Neon Azure & Pink' },
                  { id: 'synthwave', label: 'Synthwave', desc: 'Retro Sunset Warmth' },
                  { id: 'studio', label: 'Studio Clarity', desc: 'Crisp Balanced Light' },
                  { id: 'obsidian', label: 'Deep Obsidian', desc: 'Moody Dark Contrast' },
                  { id: 'hologram', label: 'Hologram Blue', desc: 'Cyan Wireframe Glow' },
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPreset === preset.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-cyan-500/30'
                    }`}
                  >
                    <p className="text-xs font-bold">{preset.label}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400">Aspect Ratio Framing</h3>
              <div className="grid grid-cols-4 gap-2">
                {['free', '1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono text-center border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    {ratio === 'free' ? 'Original' : ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Manual Adjustments</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Brightness</span>
                    <span className="text-cyan-400">{settings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.brightness}
                    onChange={(e) => setSettings({ ...settings, brightness: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Contrast</span>
                    <span className="text-cyan-400">{settings.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={settings.contrast}
                    onChange={(e) => setSettings({ ...settings, contrast: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Saturation</span>
                    <span className="text-cyan-400">{settings.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.saturation}
                    onChange={(e) => setSettings({ ...settings, saturation: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Vignette</span>
                    <span className="text-cyan-400">{settings.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.vignette}
                    onChange={(e) => setSettings({ ...settings, vignette: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Cyber Glow</span>
                    <span className="text-cyan-400">{settings.cyberGlow}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.cyberGlow}
                    onChange={(e) => setSettings({ ...settings, cyberGlow: Number(e.target.value) })}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#070b14] border border-cyan-500/30 rounded-2xl overflow-hidden p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <span className="text-sm font-bold text-white font-mono">
                Full-Resolution Preview · {imageTitle}
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={canvasRef.current?.toDataURL() || imageSrc}
                alt="Full preview"
                className="max-h-[70vh] object-contain rounded-lg"
              />
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">Created by Rahul R · Eagle Tech</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload('png')}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Download PNG
                </button>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg glass-panel text-slate-300 text-xs"
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
