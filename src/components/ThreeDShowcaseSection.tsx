import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Box, Layers, RotateCw, ZoomIn, ZoomOut, Eye, Sparkles, Sliders, Shield, Cpu, Compass, Activity, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';

type ModelType = 'eagle' | 'quantum-core' | 'drone' | 'hud-visor' | 'reactor';

interface ModelInfo {
  id: ModelType;
  name: string;
  category: string;
  polyCount: string;
  description: string;
  accentColor: number;
  specs: { label: string; value: string }[];
}

const MODELS_CATALOG: ModelInfo[] = [
  {
    id: 'eagle',
    name: 'Cybernetic Eagle MK-IV',
    category: 'Autonomous Aerial Vanguard',
    polyCount: '18,450 Quads',
    description: 'Flagship aerodynamic bio-mechanical eagle designed with titanium-carbide articulating wings, neural optical sensor beak, and ion energy stabilizers.',
    accentColor: 0x06b6d4,
    specs: [
      { label: 'Wingspan', value: '3.4m Active Geometry' },
      { label: 'Propulsion', value: 'Plasma Thruster Cores' },
      { label: 'Armor', value: 'Nanotech Carbon Lattice' },
      { label: 'Architect', value: 'Rahul R · Arunai Engg' },
    ],
  },
  {
    id: 'quantum-core',
    name: 'Neural Quantum Processor Core',
    category: 'Deep Reasoning Supercomputer',
    polyCount: '32,100 Polygons',
    description: 'Multi-nested geodesic quantum sphere with sub-atomic processing lattices, superconducting magnetic rings, and real-time photonic data conduits.',
    accentColor: 0x38bdf8,
    specs: [
      { label: 'Clock Speed', value: '128 PetaFLOPS Neural' },
      { label: 'Cooling', value: 'Liquid Helium Cryo-loop' },
      { label: 'Topology', value: '4D Geodesic Icosahedron' },
      { label: 'Architecture', value: 'Eagle Tensor-V' },
    ],
  },
  {
    id: 'drone',
    name: 'Stealth Orbital Recon Drone',
    category: 'Deep Space Scouting Craft',
    polyCount: '24,800 Polygons',
    description: 'Angular radar-deflecting stealth drone equipped with quad-vector directional thrusters, LIDAR gimbal targeting array, and long-range telemetry dishes.',
    accentColor: 0x818cf8,
    specs: [
      { label: 'Operational Range', value: '45,000 km Orbit' },
      { label: 'Sensors', value: 'Multispectral Thermal/LIDAR' },
      { label: 'Payload', value: 'Telemetry Relay Hub' },
      { label: 'Stealth Rating', value: 'Class-9 Anti-Reflective' },
    ],
  },
  {
    id: 'hud-visor',
    name: 'Eagle Vision Neural AR Visor',
    category: 'Spatial Holographic Interface',
    polyCount: '15,200 Polygons',
    description: 'Ergonomic cybernetic augmented reality headset with dual curved retina projection waveguides, spatial audio nodes, and biological neural sync bands.',
    accentColor: 0x10b981,
    specs: [
      { label: 'Field of View', value: '140° Stereoscopic' },
      { label: 'Refresh Rate', value: '240 Hz Micro-OLED' },
      { label: 'Tracking', value: '6-DoF Inside-Out SLAM' },
      { label: 'Battery Core', value: 'Solid-State Graphene' },
    ],
  },
  {
    id: 'reactor',
    name: 'Hyperdimensional Crystal Reactor',
    category: 'Zero-Point Energy Generator',
    polyCount: '28,900 Polygons',
    description: 'Floating crystalline octahedron energy matrix encased within rotating dual electromagnetic containment toruses, channeling zero-point quantum vacuum flux.',
    accentColor: 0xf59e0b,
    specs: [
      { label: 'Power Output', value: '4.8 Terawatts Pulse' },
      { label: 'Containment', value: 'Toroidal Magnetic Field' },
      { label: 'Resonance', value: '96.4 GHz Harmonic' },
      { label: 'Efficiency', value: '99.87% Energy Capture' },
    ],
  },
];

export const ThreeDShowcaseSection: React.FC = () => {
  const [activeModel, setActiveModel] = useState<ModelType>('eagle');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(7);
  const [explosionAmount, setExplosionAmount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const selectedModelInfo = MODELS_CATALOG.find((m) => m.id === activeModel) || MODELS_CATALOG[0];

  // Helper to build model meshes
  const buildModel = (type: ModelType, group: THREE.Group, isWire: boolean) => {
    // Clear existing children
    while (group.children.length > 0) {
      const obj = group.children[0] as any;
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose());
        else obj.material.dispose();
      }
      group.remove(obj);
    }

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });

    if (type === 'eagle') {
      // Procedural Cyber Eagle
      const bodyGeom = new THREE.OctahedronGeometry(1.2, 0);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.9,
        roughness: 0.15,
        wireframe: isWire,
        emissive: 0x0369a1,
        emissiveIntensity: 0.5,
      });
      const body = new THREE.Mesh(bodyGeom, isWire ? wireMat : bodyMat);
      body.scale.set(0.7, 1.8, 0.6);
      group.add(body);

      // Head
      const headGeom = new THREE.ConeGeometry(0.5, 1.2, 4);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: isWire,
      });
      const head = new THREE.Mesh(headGeom, isWire ? wireMat : headMat);
      head.position.set(0, 1.8, 0.3);
      head.rotation.x = Math.PI * 0.15;
      group.add(head);

      // Wings with exploded view capability
      const wingL = new THREE.Group();
      const wingR = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const featherGeom = new THREE.ConeGeometry(0.25, 2.2 - i * 0.25, 4);
        const featherMat = new THREE.MeshStandardMaterial({
          color: i % 2 === 0 ? 0x0284c7 : 0x06b6d4,
          metalness: 0.85,
          roughness: 0.2,
          wireframe: isWire,
        });
        const fL = new THREE.Mesh(featherGeom, isWire ? wireMat : featherMat);
        fL.position.set(-0.6 - i * 0.45, 0.6 - i * 0.2, -i * 0.1);
        fL.rotation.z = Math.PI * 0.45 + i * 0.12;
        wingL.add(fL);

        const fR = new THREE.Mesh(featherGeom, isWire ? wireMat : featherMat);
        fR.position.set(0.6 + i * 0.45, 0.6 - i * 0.2, -i * 0.1);
        fR.rotation.z = -Math.PI * 0.45 - i * 0.12;
        wingR.add(fR);
      }
      wingL.position.x = -explosionAmount * 0.8;
      wingR.position.x = explosionAmount * 0.8;
      group.add(wingL);
      group.add(wingR);

    } else if (type === 'quantum-core') {
      // 1. Geodesic Sphere
      const sphereGeom = new THREE.IcosahedronGeometry(1.6, 2);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.95,
        roughness: 0.1,
        wireframe: isWire,
        emissive: 0x0369a1,
        emissiveIntensity: 0.6,
      });
      const sphere = new THREE.Mesh(sphereGeom, isWire ? wireMat : sphereMat);
      group.add(sphere);

      // Inner Core
      const innerGeom = new THREE.OctahedronGeometry(0.8, 1);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      const inner = new THREE.Mesh(innerGeom, innerMat);
      group.add(inner);

      // Orbital Magnetic Rings
      const ring1Geom = new THREE.TorusGeometry(2.3 + explosionAmount * 0.6, 0.04, 16, 80);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
      const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
      group.add(ring1);

      const ring2Geom = new THREE.TorusGeometry(2.7 + explosionAmount * 0.8, 0.03, 16, 80);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x818cf8, wireframe: true });
      const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
      ring2.rotation.x = Math.PI * 0.5;
      group.add(ring2);

    } else if (type === 'drone') {
      // Angular stealth hull
      const hullGeom = new THREE.CylinderGeometry(0.2, 1.4, 3.2, 4);
      const hullMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.2,
        wireframe: isWire,
      });
      const hull = new THREE.Mesh(hullGeom, isWire ? wireMat : hullMat);
      hull.rotation.x = Math.PI * 0.5;
      group.add(hull);

      // Swept Wings
      const wingGeom = new THREE.BoxGeometry(4.2 + explosionAmount * 1.2, 0.08, 1.2);
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.3,
        wireframe: isWire,
      });
      const wings = new THREE.Mesh(wingGeom, isWire ? wireMat : wingMat);
      group.add(wings);

      // Twin Ion Thrusters
      const thrusterGeom = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
      const thrusterMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        wireframe: isWire,
      });
      const tL = new THREE.Mesh(thrusterGeom, isWire ? wireMat : thrusterMat);
      tL.position.set(-0.8 - explosionAmount * 0.4, 0, -1.6);
      tL.rotation.x = Math.PI * 0.5;
      group.add(tL);

      const tR = new THREE.Mesh(thrusterGeom, isWire ? wireMat : thrusterMat);
      tR.position.set(0.8 + explosionAmount * 0.4, 0, -1.6);
      tR.rotation.x = Math.PI * 0.5;
      group.add(tR);

    } else if (type === 'hud-visor') {
      // Curved Visor Waveguide
      const visorGeom = new THREE.TorusGeometry(1.6, 0.45, 16, 50, Math.PI * 0.8);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x10b981,
        metalness: 0.95,
        roughness: 0.05,
        wireframe: isWire,
        emissive: 0x059669,
        emissiveIntensity: 0.5,
      });
      const visor = new THREE.Mesh(visorGeom, isWire ? wireMat : visorMat);
      visor.rotation.x = Math.PI * 0.5;
      visor.rotation.z = Math.PI * 0.6;
      group.add(visor);

      // Headset Band
      const bandGeom = new THREE.TorusGeometry(1.8 + explosionAmount * 0.5, 0.12, 16, 60, Math.PI * 1.2);
      const bandMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.3, wireframe: isWire });
      const band = new THREE.Mesh(bandGeom, isWire ? wireMat : bandMat);
      band.rotation.x = Math.PI * 0.5;
      band.rotation.z = Math.PI * 0.4;
      group.add(band);

      // Side Optical Nodes
      const nodeGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.6, 16);
      const nodeMat = new THREE.MeshStandardMaterial({ color: 0x34d399, emissive: 0x059669, emissiveIntensity: 0.7, wireframe: isWire });
      const nL = new THREE.Mesh(nodeGeom, isWire ? wireMat : nodeMat);
      nL.position.set(-1.8 - explosionAmount * 0.5, 0, 0);
      nL.rotation.z = Math.PI * 0.5;
      group.add(nL);

      const nR = new THREE.Mesh(nodeGeom, isWire ? wireMat : nodeMat);
      nR.position.set(1.8 + explosionAmount * 0.5, 0, 0);
      nR.rotation.z = Math.PI * 0.5;
      group.add(nR);

    } else if (type === 'reactor') {
      // Dual nested floating octahedron crystal
      const crystalGeom = new THREE.OctahedronGeometry(1.5, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.1,
        wireframe: isWire,
        emissive: 0xd97706,
        emissiveIntensity: 0.7,
      });
      const crystal = new THREE.Mesh(crystalGeom, isWire ? wireMat : crystalMat);
      crystal.scale.set(0.9, 1.6, 0.9);
      group.add(crystal);

      // Outer Toroidal Magnetic Containment
      const torGeom1 = new THREE.TorusGeometry(2.4 + explosionAmount * 0.7, 0.08, 16, 80);
      const torMat1 = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.1, wireframe: isWire });
      const tor1 = new THREE.Mesh(torGeom1, isWire ? wireMat : torMat1);
      group.add(tor1);

      const torGeom2 = new THREE.TorusGeometry(2.8 + explosionAmount * 0.9, 0.05, 16, 80);
      const torMat2 = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true });
      const tor2 = new THREE.Mesh(torGeom2, torMat2);
      tor2.rotation.x = Math.PI * 0.45;
      group.add(tor2);
    }
  };

  // Setup Three.js Stage
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, zoomLevel);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambLight);

    const keyLight = new THREE.PointLight(0x06b6d4, 3, 20);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x818cf8, 2.5, 20);
    fillLight.position.set(-4, -4, 4);
    scene.add(fillLight);

    // Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    buildModel(activeModel, modelGroup, wireframe);

    // Background Particles
    const pCount = 200;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) {
      pPos[i] = (Math.random() - 0.5) * 12;
    }
    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.04, color: 0x38bdf8, transparent: true, opacity: 0.5 });
    const pPoints = new THREE.Points(pGeom, pMat);
    scene.add(pPoints);

    // Mouse Interaction Drag & Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroup) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && modelGroup) {
        modelGroup.rotation.y += delta * 0.45 * rotationSpeed;
      }
      pPoints.rotation.y += delta * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      pGeom.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeModel]);

  // Update wireframe / explosion dynamically
  useEffect(() => {
    if (modelGroupRef.current) {
      buildModel(activeModel, modelGroupRef.current, wireframe);
    }
  }, [wireframe, explosionAmount, activeModel]);

  // Update zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevel;
    }
  }, [zoomLevel]);

  return (
    <section id="3d-models" className="py-24 relative bg-[#05070d] cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Box className="w-3.5 h-3.5" />
            <span>Interactive WebGL 3D Model Explorer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Eagle <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">3D Models & Assets</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Inspect, rotate, explode, and examine real-time procedural 3D models engineered by Rahul R for the Eagle Technology ecosystem.
          </p>
        </div>

        {/* Model Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-8">
          {MODELS_CATALOG.map((mod) => {
            const isActive = activeModel === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModel(mod.id);
                  setExplosionAmount(0);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-500/20 scale-[1.02]'
                    : 'glass-panel text-slate-400 hover:text-slate-200 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">
                    0{MODELS_CATALOG.indexOf(mod) + 1}
                  </span>
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isActive ? '#38bdf8' : '#475569' }}
                  />
                </div>
                <h4 className="text-xs font-bold truncate text-white">{mod.name}</h4>
                <p className="text-[10px] text-slate-500 truncate font-mono">{mod.category}</p>
              </button>
            );
          })}
        </div>

        {/* Main 3D Viewport & Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main 3D Viewport (8 Columns) */}
          <div className="lg:col-span-8 rounded-3xl glass-panel-glow border border-cyan-500/30 p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#070b14] to-[#04060b]">
            
            {/* Top Telemetry Overlay */}
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 text-xs font-mono text-cyan-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-bold">{selectedModelInfo.name}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>POLYS: {selectedModelInfo.polyCount}</span>
                <span>ZOOM: {zoomLevel.toFixed(1)}x</span>
                <span className="text-emerald-400">FPS: 60 STABLE</span>
              </div>
            </div>

            {/* Canvas Container */}
            <div
              ref={containerRef}
              className="w-full h-[400px] sm:h-[460px] relative my-2 cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden flex items-center justify-center"
            >
              {/* Corner Viewport Reticles */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-400 pointer-events-none bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800">
                Click & drag mouse to freely rotate 3D object
              </div>
            </div>

            {/* Bottom 3D Viewport Controls */}
            <div className="pt-3 border-t border-cyan-500/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                {/* Auto Rotate Toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                    autoRotate
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'glass-panel text-slate-300 border-slate-800'
                  }`}
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
                </button>

                {/* Wireframe Mode */}
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    wireframe
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'glass-panel text-slate-300 border-slate-800'
                  }`}
                >
                  <span>Wireframe: {wireframe ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Zoom In / Out */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Zoom:</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 1, 4))}
                  className="p-1.5 rounded-lg glass-panel hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 1, 11))}
                  className="p-1.5 rounded-lg glass-panel hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Inspector & Technical Spec Sheet (4 Columns) */}
          <div className="lg:col-span-4 rounded-3xl glass-panel border border-cyan-500/20 p-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                  Asset Spec Sheet // MK-4
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedModelInfo.name}
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedModelInfo.description}
                </p>
              </div>

              {/* Exploded View Slider */}
              <div className="p-3.5 rounded-2xl bg-[#070b14] border border-cyan-500/20 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Exploded Assembly View:</span>
                  <span className="text-cyan-400 font-bold">{Math.round(explosionAmount * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={explosionAmount}
                  onChange={(e) => setExplosionAmount(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Technical Matrix Specs */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400">Specifications:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedModelInfo.specs.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <span className="text-slate-400">{s.label}</span>
                      <span className="text-cyan-300 font-bold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Creator Attribution */}
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-bold text-sm shrink-0">
                RR
              </div>
              <div>
                <p className="text-xs font-bold text-white">Engineered by Rahul R</p>
                <p className="text-[10px] text-cyan-300 font-mono">Arunai Engineering College · B.Tech IT</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
