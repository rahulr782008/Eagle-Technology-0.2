import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Bot, Image, Video, Sparkles, CheckCircle2, ChevronRight, Play, ArrowRight, Lightbulb, BookOpen, Layers, Award, RotateCw, Eye } from 'lucide-react';

interface Interactive3DTutorialsProps {
  onNavigateToTool: (sectionId: string) => void;
}

interface TutorialStep {
  title: string;
  desc: string;
  actionHint: string;
  previewType: 'chat' | 'photo' | 'video';
  interactiveDemo: {
    label: string;
    sampleInput: string;
    sampleOutput: string;
  };
}

interface TutorialModule {
  id: 'chatbot' | 'photo' | 'video';
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  targetSection: string;
  steps: TutorialStep[];
}

const TUTORIAL_MODULES: TutorialModule[] = [
  {
    id: 'chatbot',
    title: 'AI Chatbot for Education & Problem Solving',
    subtitle: 'Master complex academic reasoning, STEM problem solving, and live grounded research',
    icon: Bot,
    color: '#06b6d4',
    targetSection: 'chatbot',
    steps: [
      {
        title: 'Step 1: Choose the Specialized Intelligence Engine',
        desc: 'Select the optimal model for your task: "gemini-3.1-pro-preview" for deep mathematical calculus and coding architecture, "gemini-3.5-flash" for balanced speed and reasoning, or "gemini-3.1-flash-lite" for rapid ideation.',
        actionHint: 'Click on the Engine selector in the chat console to switch models instantly.',
        previewType: 'chat',
        interactiveDemo: {
          label: 'Academic Reasoning Query',
          sampleInput: 'Solve the Fourier transform of a damped harmonic oscillator and show steps',
          sampleOutput: 'Eagle AI applies calculus integration with e^(-at)*cos(wt)... provides step-by-step algebraic breakdown with LaTeX notation.',
        },
      },
      {
        title: 'Step 2: Activate Live Google Search & Maps Grounding',
        desc: 'For academic literature, real-time tech benchmarks, or university campus locations (like Arunai Engineering College), toggle Google Search or Google Maps Grounding to receive verified, citation-backed answers.',
        actionHint: 'Enable the "Google Search" toggle above the chat box to cite real-time sources.',
        previewType: 'chat',
        interactiveDemo: {
          label: 'Grounded Research Demo',
          sampleInput: 'What are the latest 2026 IEEE advancements in WebGL 3D shaders?',
          sampleOutput: 'Verified Grounded Output: Direct citations from IEEE & WebGL WG, with hyperlinks to source publications.',
        },
      },
      {
        title: 'Step 3: Hands-Free Voice Dictation & Audio Transcription',
        desc: 'Speak your math or physics questions out loud. The integrated "gemini-3.5-transcribe" model converts spoken speech directly into structured queries, and Live Voice Mode reads answers aloud.',
        actionHint: 'Click the Microphone button to record your voice or toggle Live Voice mode.',
        previewType: 'chat',
        interactiveDemo: {
          label: 'Speech-to-Solution Workflow',
          sampleInput: '[Microphone Audio: "Explain time complexity of quicksort in best and worst cases"]',
          sampleOutput: 'Transcribed accurately: O(N log N) average, O(N^2) worst case when pivot selection degrades. Best practices explained.',
        },
      },
    ],
  },
  {
    id: 'photo',
    title: 'AI Photo Studio & Gemini 3.1 Flash Image',
    subtitle: 'Learn professional neural color grading, 1-click presets, and generative image editing',
    icon: Image,
    color: '#38bdf8',
    targetSection: 'photo-editor',
    steps: [
      {
        title: 'Step 1: Upload or Generate Concept Art',
        desc: 'Drag and drop any photograph from your device or use the built-in Gemini 3.1 Flash Image generator to synthesize a brand-new futuristic concept from a descriptive text prompt.',
        actionHint: 'Drag a photo into the viewport or click "Generate New Image" with gemini-3.1-flash-image.',
        previewType: 'photo',
        interactiveDemo: {
          label: 'Prompt-to-Canvas Synthesis',
          sampleInput: 'Prompt: "High-tech robotic eagle with glowing cyan plumage in flight"',
          sampleOutput: 'Renders 1K cinematic resolution canvas ready for hardware-accelerated adjustments.',
        },
      },
      {
        title: 'Step 2: Neural Grading & 1-Click Cyber Presets',
        desc: 'Enhance your image with tailored presets like "Eagle HDR Boost" for ultra dynamic range, "Cyberpunk 2099" for neon split-toning, or "Deep Obsidian" for moody contrast curves.',
        actionHint: 'Click any Neural Preset to apply complex multi-filter color curves simultaneously.',
        previewType: 'photo',
        interactiveDemo: {
          label: 'Preset Calibration',
          sampleInput: 'Selected: [Eagle HDR Boost]',
          sampleOutput: 'Canvas filters updated: Brightness 110% · Contrast 135% · Saturation 130% · Cyber Glow 15%',
        },
      },
      {
        title: 'Step 3: Interactive Split-View Comparison & Export',
        desc: 'Drag the interactive split-slider horizontally to inspect your raw photograph against the AI-enhanced grade in real-time. Export in high-res PNG or publish directly to the Eagle Showcase.',
        actionHint: 'Drag the split handle left and right, then click "Publish" to save to Firestore.',
        previewType: 'photo',
        interactiveDemo: {
          label: 'Hardware-Accelerated Export',
          sampleInput: 'Resolution: 1280x720 (16:9 Cinema Framing)',
          sampleOutput: 'Compressed to lossless PNG or published to public community gallery with real-time likes.',
        },
      },
    ],
  },
  {
    id: 'video',
    title: 'AI Video Studio & Veo 3 Neural VFX',
    subtitle: 'Master cinematic timeline editing, HUD overlays, Veo 3 generation, and timed AI subtitles',
    icon: Video,
    color: '#818cf8',
    targetSection: 'video-editor',
    steps: [
      {
        title: 'Step 1: Text-to-Video & Image Animation with Veo 3',
        desc: 'Generate futuristic video reels using the Google Veo 3 model ("veo-3.1-fast-generate-preview"). You can prompt from scratch or upload a still photo to animate into realistic motion.',
        actionHint: 'Enter a motion prompt in the Veo 3 panel and click "Generate with Veo 3".',
        previewType: 'video',
        interactiveDemo: {
          label: 'Veo 3 Synthesis Pipeline',
          sampleInput: 'Prompt: "Drone camera panning over neon Tokyo skyline with robotic eagle soaring"',
          sampleOutput: 'Veo neural pipeline renders 720p 60fps video and mounts directly into timeline player.',
        },
      },
      {
        title: 'Step 2: Real-Time HUD Reticle & Cybernetic VFX',
        desc: 'Toggle hardware-accelerated canvas overlays including the Eagle Targeting Reticle, CRT Scanlines, Anamorphic Letterboxing, and Phosphor Night Vision without re-rendering the file.',
        actionHint: 'Toggle "Eagle HUD Reticle" and "Cyber CRT Scanlines" in the VFX Overlays menu.',
        previewType: 'video',
        interactiveDemo: {
          label: 'Real-Time Canvas Shader',
          sampleInput: 'Active VFX: [HUD Reticle + CRT Scanlines + Anamorphic Glow]',
          sampleOutput: 'Telemetry text and animated targeting reticle rendered in sync with 60fps playback.',
        },
      },
      {
        title: 'Step 3: Automated Timed AI Subtitles & Publishing',
        desc: 'Click "Auto-Generate Captions" to formulate precisely timed subtitle cues using Gemini. When satisfied, publish your video creation to the community showcase for other users to inspect.',
        actionHint: 'Click "Auto-Generate Captions", inspect the timeline subtitle badges, and click "Publish".',
        previewType: 'video',
        interactiveDemo: {
          label: 'Timed AI Subtitle Sync',
          sampleInput: 'Duration: 15 seconds',
          sampleOutput: 'Generated 4 timed cues [0-3s, 3-7s, 7-11s, 11-15s] burned directly onto the viewport.',
        },
      },
    ],
  },
];

export const Interactive3DTutorials: React.FC<Interactive3DTutorialsProps> = ({ onNavigateToTool }) => {
  const [activeModuleId, setActiveModuleId] = useState<'chatbot' | 'photo' | 'video'>('chatbot');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const activeModule = TUTORIAL_MODULES.find((m) => m.id === activeModuleId) || TUTORIAL_MODULES[0];
  const currentStep = activeModule.steps[currentStepIndex];

  // Three.js 3D Hologram Stage
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Point Lights
    const ambientLight = new THREE.AmbientLight(0x06b6d4, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 15);
    pointLight.position.set(3, 3, 4);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0x818cf8, 2, 15);
    accentLight.position.set(-3, -2, 3);
    scene.add(accentLight);

    // 3D Objects Group
    const stageGroup = new THREE.Group();
    scene.add(stageGroup);

    // 1. Central Rotating Polyhedral Hologram Core
    const coreGeom = new THREE.IcosahedronGeometry(1.4, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    stageGroup.add(coreMesh);

    // Wireframe Cage
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const wireMesh = new THREE.Mesh(coreGeom, wireMat);
    wireMesh.scale.setScalar(1.03);
    stageGroup.add(wireMesh);

    // Orbiting Tutorial Data Ring 1
    const ringGeom1 = new THREE.TorusGeometry(2.4, 0.03, 16, 80);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.5 });
    const ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    stageGroup.add(ring1);

    // Orbiting Tutorial Data Ring 2
    const ringGeom2 = new THREE.TorusGeometry(2.8, 0.02, 16, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    ring2.rotation.x = Math.PI * 0.4;
    stageGroup.add(ring2);

    // Floating Interactive 3D Node Satellites (Chat, Photo, Video nodes)
    const nodeGeom = new THREE.OctahedronGeometry(0.35, 0);
    
    // Node 1: Chatbot (Left)
    const node1Mat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.7 });
    const node1 = new THREE.Mesh(nodeGeom, node1Mat);
    node1.position.set(-2.5, 0.5, 0);
    stageGroup.add(node1);

    // Node 2: Photo (Top)
    const node2Mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 0.7 });
    const node2 = new THREE.Mesh(nodeGeom, node2Mat);
    node2.position.set(0, 2.5, 0);
    stageGroup.add(node2);

    // Node 3: Video (Right)
    const node3Mat = new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x818cf8, emissiveIntensity: 0.7 });
    const node3 = new THREE.Mesh(nodeGeom, node3Mat);
    node3.position.set(2.5, -0.5, 0);
    stageGroup.add(node3);

    // Particle Matrix
    const particlesCount = 180;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 10;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.05, color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const particles = new THREE.Points(pGeom, pMat);
    stageGroup.add(particles);

    // Mouse Tracking
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = y * 0.35;
      targetY = x * 0.45;
    };
    container.addEventListener('mousemove', handleMouseMove);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      stageGroup.rotation.x += (targetX - stageGroup.rotation.x) * 0.05;
      stageGroup.rotation.y += (targetY - stageGroup.rotation.y) * 0.05;

      coreMesh.rotation.y = time * 0.4;
      coreMesh.rotation.x = time * 0.2;
      wireMesh.rotation.y = time * 0.4;
      wireMesh.rotation.x = time * 0.2;

      ring1.rotation.z = time * 0.3;
      ring2.rotation.y = -time * 0.25;

      node1.position.y = 0.5 + Math.sin(time * 2) * 0.2;
      node2.position.x = Math.sin(time * 2 + 1) * 0.2;
      node3.position.y = -0.5 + Math.sin(time * 2 + 2) * 0.2;

      node1.rotation.y = time;
      node2.rotation.y = time;
      node3.rotation.y = time;

      particles.rotation.y = time * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      wireMat.dispose();
      ringGeom1.dispose();
      ringGeom2.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      nodeGeom.dispose();
      node1Mat.dispose();
      node2Mat.dispose();
      node3Mat.dispose();
      pGeom.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const markStepComplete = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: true }));
    if (currentStepIndex < activeModule.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const totalSteps = TUTORIAL_MODULES.reduce((acc, m) => acc + m.steps.length, 0);
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPct = Math.round((completedCount / totalSteps) * 100);

  return (
    <section id="tutorials" className="py-24 relative bg-[#05070d] cyber-grid overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Simulation & Guided Walkthrough</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Eagle 3D <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">Interactive Tutorials</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Master the Eagle AI Chatbot for complex education and coding, and unlock the full potential of our neural photo and video editing suites within this futuristic 3D interface.
          </p>

          {/* Progress Tracker Pill */}
          <div className="pt-2 flex items-center justify-center gap-3">
            <div className="w-48 sm:w-64 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(progressPct, 8)}%` }}
              />
            </div>
            <span className="text-xs font-mono text-cyan-300 font-bold">
              {completedCount}/{totalSteps} Steps Complete ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Module Selector Segmented Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {TUTORIAL_MODULES.map((mod) => {
            const Icon = mod.icon;
            const isActive = activeModuleId === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModuleId(mod.id);
                  setCurrentStepIndex(0);
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex items-start gap-4 ${
                  isActive
                    ? 'glass-panel-glow border-cyan-400/60 shadow-xl shadow-cyan-500/15 translate-y-[-2px]'
                    : 'glass-panel border-cyan-500/15 text-slate-300 hover:border-cyan-500/40'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                    isActive ? 'bg-cyan-500 text-slate-950 scale-105 shadow-md shadow-cyan-500/30' : 'bg-slate-900 text-cyan-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                    Module // 0{TUTORIAL_MODULES.indexOf(mod) + 1}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {mod.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main 3D Hologram & Step Walkthrough Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive 3D Hologram Simulator (5 Columns) */}
          <div className="lg:col-span-5 rounded-3xl glass-panel-glow border border-cyan-500/30 p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#060912] to-[#070d1a]">
            {/* Top Status */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono text-cyan-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>3D SIMULATION MATRIX</span>
              </div>
              <span>WEBGL 60FPS</span>
            </div>

            {/* Three.js Interactive Canvas Container */}
            <div
              ref={canvasContainerRef}
              className="w-full h-[320px] sm:h-[380px] my-3 relative rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center"
            >
              {/* Corner HUD Reticles */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 pointer-events-none bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-slate-800">
                Move cursor over 3D core to rotate orbit
              </div>
            </div>

            {/* Bottom Module Summary */}
            <div className="pt-3 border-t border-cyan-500/15 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">{activeModule.title}</p>
                <p className="text-[11px] font-mono text-cyan-400">Step {currentStepIndex + 1} of {activeModule.steps.length}</p>
              </div>

              <button
                onClick={() => onNavigateToTool(activeModule.targetSection)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 hover:brightness-110 transition-all"
              >
                <span>Open in Live Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Step-by-Step Interactive Guide & Sandbox (7 Columns) */}
          <div className="lg:col-span-7 rounded-3xl glass-panel border border-cyan-500/25 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Step Navigation Pill Indicators */}
            <div className="flex items-center gap-2">
              {activeModule.steps.map((step, idx) => {
                const isCurrent = currentStepIndex === idx;
                const isDone = completedSteps[`${activeModule.id}-${idx}`];
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      isCurrent
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                        : isDone
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>0{idx + 1}</span>}
                    <span className="hidden sm:inline">Step {idx + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Current Step Instruction Content */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{currentStep.title}</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {currentStep.desc}
              </p>
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>Pro-Tip: {currentStep.actionHint}</span>
              </div>
            </div>

            {/* Interactive Simulation Sandbox Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#070b14] border border-cyan-500/20 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Interactive Simulation // {currentStep.interactiveDemo.label}
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  REAL-TIME PREVIEW
                </span>
              </div>

              {/* Simulated Input */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Input Command / Configuration:</span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-mono">
                  {currentStep.interactiveDemo.sampleInput}
                </div>
              </div>

              {/* Simulated Output */}
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Simulated AI Processing Result:</span>
                <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/25 text-xs text-cyan-200 font-mono leading-relaxed">
                  {currentStep.interactiveDemo.sampleOutput}
                </div>
              </div>
            </div>

            {/* Navigation and Completion Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <button
                onClick={() => markStepComplete(`${activeModule.id}-${currentStepIndex}`)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedSteps[`${activeModule.id}-${currentStepIndex}`]
                    ? 'Step Verified ✓'
                    : 'Mark Step as Understood'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <button
                    onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
                    className="px-3.5 py-2 rounded-xl glass-panel text-slate-300 text-xs font-mono hover:text-white"
                  >
                    Previous
                  </button>
                )}
                {currentStepIndex < activeModule.steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                    className="px-4 py-2 rounded-xl glass-panel text-cyan-300 border-cyan-500/40 text-xs font-mono hover:text-white flex items-center gap-1"
                  >
                    <span>Next Step</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateToTool(activeModule.targetSection)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Launch {activeModule.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
