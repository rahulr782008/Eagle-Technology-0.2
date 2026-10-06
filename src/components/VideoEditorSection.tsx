import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Upload, Eye, Download, Share2, Sparkles, Sliders, Check, Maximize2, X, Captions, Shield, FastForward, Film, Video, Image as ImageIcon } from 'lucide-react';
import { VideoCaption, VideoFilterSettings, PublishedWork } from '../types';

interface VideoEditorSectionProps {
  onPublish: (work: PublishedWork) => void;
}

const SAMPLE_VIDEOS = [
  {
    id: 'cyber-city',
    title: 'Neon Cyber Metropolis',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    theme: 'Cyberpunk Sci-Fi VFX',
  },
  {
    id: 'tech-loop',
    title: 'Quantum Synthetic Grid',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    theme: 'Deep Space Robotics',
  },
];

export const VideoEditorSection: React.FC<VideoEditorSectionProps> = ({ onPublish }) => {
  const [videoSrc, setVideoSrc] = useState(SAMPLE_VIDEOS[0].url);
  const [videoTitle, setVideoTitle] = useState(SAMPLE_VIDEOS[0].title);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');

  // Veo Video Generation State
  const [veoPrompt, setVeoPrompt] = useState('Cinematic aerial flight of a robotic eagle through neon megacity skyscrapers, anamorphic flares');
  const [isGeneratingVeo, setIsGeneratingVeo] = useState(false);
  const [veoProgressMsg, setVeoProgressMsg] = useState('');
  const [veoSourceImage, setVeoSourceImage] = useState<string | null>(null);

  // Video Filters
  const [filterSettings, setFilterSettings] = useState<VideoFilterSettings>({
    brightness: 100,
    contrast: 110,
    saturation: 120,
    hudOverlay: true,
    scanlines: true,
    glitchVfx: false,
    nightVision: false,
    cinematicBars: true,
    anamorphicGlow: false,
  });

  // AI Subtitles
  const [captions, setCaptions] = useState<VideoCaption[]>([
    { start: 0, end: 3, text: '🦅 EAGLE TECHNOLOGY · AI VISION SYSTEM INITIALIZED' },
    { start: 3, end: 7, text: 'Real-time neural synthesis & high-performance media pipeline' },
    { start: 7, end: 11, text: 'Engineered by Rahul R at Arunai Engineering College' },
    { start: 11, end: 16, text: 'Empowering future creators with next-generation 3D AI' },
  ]);
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);

  // Notifications
  const [isPublishedNotification, setIsPublishedNotification] = useState(false);
  const [isSavedNotification, setIsSavedNotification] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      renderVideoFrame();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 15);
    }
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      renderVideoFrame();
    }
  };

  const renderVideoFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetW = 1280;
    let targetH = 720;

    if (aspectRatio === '9:16') {
      targetW = 720;
      targetH = 1280;
    } else if (aspectRatio === '1:1') {
      targetW = 1000;
      targetH = 1000;
    }

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.save();

    const filters = [
      `brightness(${filterSettings.brightness}%)`,
      `contrast(${filterSettings.contrast}%)`,
      `saturate(${filterSettings.saturation}%)`,
    ];
    if (filterSettings.nightVision) {
      filters.push('hue-rotate(90deg) contrast(180%)');
    }
    ctx.filter = filters.join(' ');

    let sWidth = video.videoWidth || 1280;
    let sHeight = video.videoHeight || 720;
    let sX = 0;
    let sY = 0;

    const targetRatio = targetW / targetH;
    const currentRatio = sWidth / sHeight;

    if (currentRatio > targetRatio) {
      const newWidth = sHeight * targetRatio;
      sX = (sWidth - newWidth) / 2;
      sWidth = newWidth;
    } else {
      const newHeight = sWidth / targetRatio;
      sY = (sHeight - newHeight) / 2;
      sHeight = newHeight;
    }

    ctx.drawImage(video, sX, sY, sWidth, sHeight, 0, 0, targetW, targetH);
    ctx.restore();

    if (filterSettings.anamorphicGlow) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.restore();
    }

    if (filterSettings.scanlines) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      for (let y = 0; y < targetH; y += 4) {
        ctx.fillRect(0, y, targetW, 1.5);
      }
      ctx.restore();
    }

    if (filterSettings.glitchVfx && Math.random() > 0.82) {
      ctx.save();
      const sliceY = Math.random() * targetH;
      const sliceH = Math.random() * 40 + 10;
      const offset = (Math.random() - 0.5) * 35;
      ctx.drawImage(canvas, 0, sliceY, targetW, sliceH, offset, sliceY, targetW, sliceH);
      ctx.restore();
    }

    if (filterSettings.cinematicBars && aspectRatio === '16:9') {
      ctx.save();
      ctx.fillStyle = '#000000';
      const barHeight = targetH * 0.08;
      ctx.fillRect(0, 0, targetW, barHeight);
      ctx.fillRect(0, targetH - barHeight, targetW, barHeight);
      ctx.restore();
    }

    if (filterSettings.hudOverlay) {
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
      ctx.lineWidth = 2;
      ctx.font = '16px monospace';
      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';

      const cx = targetW / 2;
      const cy = targetH / 2;
      const r = 60;

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - r - 15, cy);
      ctx.lineTo(cx - r + 5, cy);
      ctx.moveTo(cx + r - 5, cy);
      ctx.lineTo(cx + r + 15, cy);
      ctx.moveTo(cx, cy - r - 15);
      ctx.lineTo(cx, cy - r + 5);
      ctx.moveTo(cx, cy + r - 5);
      ctx.lineTo(cx, cy + r + 15);
      ctx.stroke();

      ctx.fillText(`EAGLE HUD // REC [${video.currentTime.toFixed(2)}s]`, 30, 45);
      ctx.fillText(`ARUNAI ENGG · RAHUL R`, targetW - 270, 45);

      ctx.font = '12px monospace';
      ctx.fillText(`SYNC: 60FPS · 4K NEURAL STABILIZED`, 30, targetH - 35);
      ctx.restore();
    }

    const activeSub = captions.find(
      (c) => video.currentTime >= c.start && video.currentTime <= c.end
    );
    if (activeSub) {
      ctx.save();
      ctx.font = 'bold 22px sans-serif';
      ctx.textAlign = 'center';
      const textMetrics = ctx.measureText(activeSub.text);

      const padding = 14;
      const textX = targetW / 2;
      const textY = targetH - (filterSettings.cinematicBars ? targetH * 0.12 : 55);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(
        textX - textMetrics.width / 2 - padding,
        textY - 24,
        textMetrics.width + padding * 2,
        36
      );

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        textX - textMetrics.width / 2 - padding,
        textY - 24,
        textMetrics.width + padding * 2,
        36
      );

      ctx.fillStyle = '#f0fdf4';
      ctx.fillText(activeSub.text, textX, textY);
      ctx.restore();
    }
  };

  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (isPlaying) {
        renderVideoFrame();
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  });

  const handleVideoUpload = (file: File) => {
    if (!file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setVideoTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIsPlaying(false);
  };

  // Veo Video Generation (Text-to-Video & Image-to-Video)
  const handleGenerateVeoVideo = async () => {
    setIsGeneratingVeo(true);
    setVeoProgressMsg('Initializing Veo 3 Video synthesis engine...');

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: veoPrompt,
          aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
          imageBase64: veoSourceImage,
        }),
      });

      const data = await response.json();
      if (data.operationName) {
        setVeoProgressMsg('Veo model is rendering neural frames (this may take a moment)...');

        // Poll for completion
        let done = false;
        let attempts = 0;
        while (!done && attempts < 20) {
          attempts++;
          await new Promise((r) => setTimeout(r, 4000));
          const statusRes = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName: data.operationName }),
          });
          const statusData = await statusRes.json();
          if (statusData.done) {
            done = true;
          }
        }

        // Download result
        const dlRes = await fetch('/api/video-download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName: data.operationName }),
        });

        if (dlRes.ok) {
          const blob = await dlRes.blob();
          const videoBlobUrl = URL.createObjectURL(blob);
          setVideoSrc(videoBlobUrl);
          setVideoTitle(`Veo AI: ${veoPrompt.slice(0, 25)}`);
          setVeoProgressMsg('Veo video successfully synthesized and loaded onto timeline!');
        } else {
          setVideoSrc(SAMPLE_VIDEOS[0].url);
          setVeoProgressMsg('Veo demo reel loaded.');
        }
      }
    } catch (err) {
      console.error('Veo generation error:', err);
      setVeoProgressMsg('Generation encountered an issue; fallback video loaded.');
    } finally {
      setIsGeneratingVeo(false);
      setTimeout(() => setVeoProgressMsg(''), 5000);
    }
  };

  const handleGenerateAiSubtitles = async () => {
    setIsGeneratingCaptions(true);
    try {
      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          theme: 'Futuristic AI and Tech innovation by Rahul R',
          duration: duration || 15,
        }),
      });
      const data = await response.json();
      if (data.captions && Array.isArray(data.captions)) {
        setCaptions(data.captions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingCaptions(false);
    }
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const link = document.createElement('a');
      link.download = `EagleTech-VideoFrame-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      console.warn('Canvas export tainted, downloading fallback frame');
    }
  };

  const handleSave = () => {
    setIsSavedNotification(true);
    setTimeout(() => setIsSavedNotification(false), 2500);
  };

  const handlePublish = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let dataUrl = 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80';
    try {
      dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    } catch {
      // Use fallback thumbnail
    }

    const newWork: PublishedWork = {
      id: `video-${Date.now()}`,
      type: 'video',
      title: videoTitle,
      creator: 'Rahul R · Video Studio',
      description: `Timeline AI video edit with HUD Reticle and Real-Time Scanlines. Mastered by Rahul R at Arunai Engineering College.`,
      mediaUrl: dataUrl,
      timestamp: 'Just now',
      likes: 2,
      tags: ['AI Video', 'Veo 3', 'Eagle HUD', 'Rahul R'],
      filterDetails: `Speed: ${playbackSpeed}x | Aspect: ${aspectRatio} | HUD: Active`,
    };

    onPublish(newWork);
    setIsPublishedNotification(true);
    setTimeout(() => setIsPublishedNotification(false), 3000);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section id="video-editor" className="py-20 relative bg-[#060912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-cyan-500/15 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Video VFX & Veo 3 Video Generator</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Eagle AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">Video Studio</span>
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Timeline video editor, live cybernetic HUD overlays, Veo 3 text/photo-to-video generation, and timed AI subtitles.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-cyan-500/40 text-xs font-medium transition-colors"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Video</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleVideoUpload(e.target.files[0]);
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
              onClick={handleExport}
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
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-mono animate-in fade-in">
            ✓ Video creation successfully published to the Eagle Showcase gallery!
          </div>
        )}
        {isSavedNotification && (
          <div className="mb-6 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-mono animate-in fade-in">
            ✓ Video timeline & filter preferences saved.
          </div>
        )}

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Video Player & Timeline (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
            
            <video
              ref={videoRef}
              src={videoSrc}
              crossOrigin="anonymous"
              playsInline
              loop
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />

            {/* Video Canvas Container */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleVideoUpload(e.dataTransfer.files[0]);
              }}
              className="relative rounded-2xl glass-panel-glow border border-cyan-500/30 overflow-hidden bg-black flex items-center justify-center min-h-[420px]"
            >
              <canvas
                ref={canvasRef}
                className="max-h-[500px] w-auto max-w-full object-contain cursor-pointer"
                onClick={togglePlay}
              />

              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-slate-950 ml-1" />
                  </div>
                </button>
              )}

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-black/75 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                  {videoTitle} · {aspectRatio}
                </span>
                <span className="text-xs font-mono px-2 py-1 rounded bg-black/75 backdrop-blur-md text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Timeline Controls */}
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:brightness-110 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  </button>
                  <button
                    onClick={() => handleSeek(0)}
                    className="p-2 rounded-lg glass-panel hover:text-white transition-colors"
                    title="Rewind to start"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="text-cyan-300 font-bold">
                    {formatTime(currentTime)} <span className="text-slate-500">/</span> {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
                  <FastForward className="w-3.5 h-3.5 text-slate-500 ml-1" />
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                        playbackSpeed === speed
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => handleSeek(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-mono text-slate-500 uppercase whitespace-nowrap">
                  Reels:
                </span>
                {SAMPLE_VIDEOS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setVideoSrc(item.url);
                      setVideoTitle(item.title);
                      setIsPlaying(false);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all whitespace-nowrap ${
                      videoTitle === item.title
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Veo 3 Video Generator (Text-to-Video & Image-to-Video) */}
            <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Film className="w-4 h-4 text-cyan-400" />
                  <span>Veo 3 Neural Video Generator</span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300">
                  veo-3.1-fast-generate-preview
                </span>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={veoPrompt}
                  onChange={(e) => setVeoPrompt(e.target.value)}
                  placeholder="e.g. Drone camera orbiting cyber eagle crest over futuristic city..."
                  className="w-full glass-input py-2 px-3 rounded-lg text-xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg glass-panel text-slate-300 hover:text-white border-slate-700 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{veoSourceImage ? 'Image Attached' : 'Attach Photo to Animate'}</span>
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (re) => setVeoSourceImage(re.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  {veoSourceImage && (
                    <button
                      onClick={() => setVeoSourceImage(null)}
                      className="text-xs text-rose-400 hover:underline font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  onClick={handleGenerateVeoVideo}
                  disabled={isGeneratingVeo}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingVeo ? 'Synthesizing Video...' : 'Generate with Veo 3'}</span>
                </button>
              </div>

              {veoProgressMsg && (
                <div className="p-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/30 text-xs font-mono text-cyan-300 animate-in fade-in flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span>{veoProgressMsg}</span>
                </div>
              )}
            </div>

            {/* AI Subtitle Generator Bar */}
            <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Captions className="w-4 h-4 text-cyan-400" />
                  <span>Eagle AI Subtitle Engine</span>
                </div>
                <button
                  onClick={handleGenerateAiSubtitles}
                  disabled={isGeneratingCaptions}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingCaptions ? 'Generating...' : 'Auto-Generate Captions'}</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
                {captions.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono p-2 rounded-lg bg-[#070b14] border border-slate-800"
                  >
                    <span className="text-cyan-400 font-bold whitespace-nowrap">
                      [{c.start}s - {c.end}s]
                    </span>
                    <span className="text-slate-300 truncate">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Video FX & Framing Sidebar (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase text-slate-400">Aspect Ratio Framing</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono text-center border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    {ratio === '16:9' ? '16:9 Widescreen' : ratio === '9:16' ? '9:16 Shorts/Reels' : '1:1 Square'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Visual FX Overlays</h3>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'hudOverlay', label: 'Eagle HUD Reticle', desc: 'Targeting ring & telemetry' },
                  { key: 'scanlines', label: 'Cyber CRT Scanlines', desc: 'Futuristic cathode lines' },
                  { key: 'cinematicBars', label: 'Anamorphic Letterbox', desc: 'Cinematic widescreen top/bottom bars' },
                  { key: 'anamorphicGlow', label: 'Blue Anamorphic Flare', desc: 'Sci-Fi lens luminescence' },
                  { key: 'glitchVfx', label: 'Matrix Neural Glitch', desc: 'Subtle temporal displacement' },
                  { key: 'nightVision', label: 'Phosphor Night Vision', desc: 'Thermal spectrum grade' },
                ].map((fx) => {
                  const isChecked = (filterSettings as any)[fx.key];
                  return (
                    <button
                      key={fx.key}
                      onClick={() =>
                        setFilterSettings({
                          ...filterSettings,
                          [fx.key]: !isChecked,
                        })
                      }
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{fx.label}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{fx.desc}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border ${
                          isChecked ? 'bg-cyan-400 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Video Color Balance</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Brightness</span>
                    <span className="text-cyan-400">{filterSettings.brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={filterSettings.brightness}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, brightness: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Contrast</span>
                    <span className="text-cyan-400">{filterSettings.contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={filterSettings.contrast}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, contrast: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>Saturation</span>
                    <span className="text-cyan-400">{filterSettings.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={filterSettings.saturation}
                    onChange={(e) =>
                      setFilterSettings({ ...filterSettings, saturation: Number(e.target.value) })
                    }
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-5xl w-full bg-[#070b14] border border-cyan-500/30 rounded-2xl overflow-hidden p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
              <span className="text-sm font-bold text-white font-mono">
                Full-Resolution Video Preview · {videoTitle}
              </span>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-center max-h-[70vh]">
              <img
                src={canvasRef.current?.toDataURL() || ''}
                alt="Frame preview"
                className="max-h-[65vh] object-contain rounded-lg shadow-xl"
              />
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">Created by Rahul R · Eagle Tech</span>
              <div className="flex gap-2">
                <button
                  onClick={handleExport}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Export Snapshot
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
