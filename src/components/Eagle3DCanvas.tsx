import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, Palette, Zap, RotateCcw } from 'lucide-react';

interface Eagle3DCanvasProps {
  interactive?: boolean;
  className?: string;
}

export const Eagle3DCanvas: React.FC<Eagle3DCanvasProps> = ({
  interactive = true,
  className = 'w-full h-full min-h-[420px]',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [currentColorScheme, setCurrentColorScheme] = useState<'cyan' | 'purple' | 'emerald' | 'gold'>('cyan');
  const [wingSpeedMultiplier, setWingSpeedMultiplier] = useState(1);

  // References to dynamic Three.js objects
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const wireMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const pointLight1Ref = useRef<THREE.PointLight | null>(null);
  const pointLight2Ref = useRef<THREE.PointLight | null>(null);
  const wingSpeedRef = useRef(1);

  useEffect(() => {
    wingSpeedRef.current = wingSpeedMultiplier;
  }, [wingSpeedMultiplier]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x06b6d4, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x38bdf8, 3.5, 25);
    pointLight1.position.set(4, 4, 5);
    scene.add(pointLight1);
    pointLight1Ref.current = pointLight1;

    const pointLight2 = new THREE.PointLight(0x818cf8, 2.8, 25);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);
    pointLight2Ref.current = pointLight2;

    const coreLight = new THREE.PointLight(0x00f2fe, 4.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 3. Procedural Futuristic Eagle Group
    const eagleGroup = new THREE.Group();
    scene.add(eagleGroup);

    // Core Eagle Diamond / Body
    const bodyGeometry = new THREE.OctahedronGeometry(1.2, 0);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: false,
      emissive: 0x0369a1,
      emissiveIntensity: 0.45,
    });
    bodyMaterialRef.current = bodyMaterial;

    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.scale.set(0.8, 1.8, 0.6);
    eagleGroup.add(bodyMesh);

    // Wireframe overlay for cyber look
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    wireMaterialRef.current = wireframeMaterial;

    const bodyWireMesh = new THREE.Mesh(bodyGeometry, wireframeMaterial);
    bodyWireMesh.scale.set(0.82, 1.82, 0.62);
    eagleGroup.add(bodyWireMesh);

    // Eagle Head & Beak
    const headGeom = new THREE.ConeGeometry(0.5, 1.1, 4);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.65,
    });
    const headMesh = new THREE.Mesh(headGeom, headMat);
    headMesh.position.set(0, 1.8, 0.3);
    headMesh.rotation.x = Math.PI * 0.15;
    eagleGroup.add(headMesh);

    // Eagle Crown Crest
    const crestGeom = new THREE.ConeGeometry(0.2, 0.8, 3);
    const crestMesh = new THREE.Mesh(crestGeom, wireframeMaterial);
    crestMesh.position.set(0, 2.3, 0);
    crestMesh.rotation.z = Math.PI;
    eagleGroup.add(crestMesh);

    // Left & Right Wings (Multi-segment cyber feathers)
    const wingGroupLeft = new THREE.Group();
    const wingGroupRight = new THREE.Group();

    const wingSegments = 6;
    for (let i = 0; i < wingSegments; i++) {
      const featherGeom = new THREE.ConeGeometry(0.25, 2.4 - i * 0.25, 4);
      const featherMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x0284c7 : 0x06b6d4,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0x0891b2,
        emissiveIntensity: 0.35 + i * 0.08,
      });

      // Left feather
      const featherL = new THREE.Mesh(featherGeom, featherMat);
      featherL.position.set(-0.6 - i * 0.45, 0.6 - i * 0.2, -i * 0.1);
      featherL.rotation.z = Math.PI * 0.45 + i * 0.12;
      featherL.rotation.y = -0.2 - i * 0.05;
      featherL.scale.set(1 - i * 0.08, 1 - i * 0.05, 0.3);
      wingGroupLeft.add(featherL);

      const featherWireL = new THREE.Mesh(featherGeom, wireframeMaterial);
      featherWireL.position.copy(featherL.position);
      featherWireL.rotation.copy(featherL.rotation);
      featherWireL.scale.copy(featherL.scale).multiplyScalar(1.02);
      wingGroupLeft.add(featherWireL);

      // Right feather (mirrored)
      const featherR = new THREE.Mesh(featherGeom, featherMat);
      featherR.position.set(0.6 + i * 0.45, 0.6 - i * 0.2, -i * 0.1);
      featherR.rotation.z = -Math.PI * 0.45 - i * 0.12;
      featherR.rotation.y = 0.2 + i * 0.05;
      featherR.scale.set(1 - i * 0.08, 1 - i * 0.05, 0.3);
      wingGroupRight.add(featherR);

      const featherWireR = new THREE.Mesh(featherGeom, wireframeMaterial);
      featherWireR.position.copy(featherR.position);
      featherWireR.rotation.copy(featherR.rotation);
      featherWireR.scale.copy(featherR.scale).multiplyScalar(1.02);
      wingGroupRight.add(featherWireR);
    }

    eagleGroup.add(wingGroupLeft);
    eagleGroup.add(wingGroupRight);

    // Orbiting Futuristic Gyro Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.03, 16, 100), ringMat1);
    scene.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.02, 16, 100), ringMat2);
    ring2.rotation.x = Math.PI * 0.4;
    scene.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.015, 16, 100), ringMat3);
    ring3.rotation.y = Math.PI * 0.35;
    scene.add(ring3);

    // Particle Cloud
    const particleCount = 320;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.065,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse Tracking
    let targetRotationX = 0;
    let targetRotationY = 0;

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = x * 0.75;
      targetRotationX = -y * 0.55;
    };

    container.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * wingSpeedRef.current;

      eagleGroup.rotation.y += (targetRotationY - eagleGroup.rotation.y) * 0.06;
      eagleGroup.rotation.x += (targetRotationX - eagleGroup.rotation.x) * 0.06;

      eagleGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.22;

      const flap = Math.sin(elapsedTime * 2.2) * 0.2;
      wingGroupLeft.rotation.z = flap;
      wingGroupRight.rotation.z = -flap;

      headMesh.rotation.y = Math.sin(elapsedTime * 0.8) * 0.15;

      ring1.rotation.z = elapsedTime * 0.25;
      ring1.rotation.x = Math.sin(elapsedTime * 0.15) * 0.3;
      ring2.rotation.y = -elapsedTime * 0.3;
      ring3.rotation.x = elapsedTime * 0.18;

      particles.rotation.y = elapsedTime * 0.05;
      coreLight.intensity = 3 + Math.sin(elapsedTime * 3) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);

      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      wireframeMaterial.dispose();
      headGeom.dispose();
      headMat.dispose();
      crestGeom.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      ring1.geometry.dispose();
      ring2.geometry.dispose();
      ring3.geometry.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  // Handle color palette change
  const applyColorScheme = (scheme: 'cyan' | 'purple' | 'emerald' | 'gold') => {
    setCurrentColorScheme(scheme);
    const colors: Record<string, { body: number; wire: number; light1: number; light2: number }> = {
      cyan: { body: 0x0284c7, wire: 0x38bdf8, light1: 0x38bdf8, light2: 0x818cf8 },
      purple: { body: 0x7c3aed, wire: 0xc084fc, light1: 0xa855f7, light2: 0xec4899 },
      emerald: { body: 0x059669, wire: 0x34d399, light1: 0x10b981, light2: 0x06b6d4 },
      gold: { body: 0xd97706, wire: 0xfbbf24, light1: 0xf59e0b, light2: 0xf97316 },
    };
    const c = colors[scheme];
    if (bodyMaterialRef.current) bodyMaterialRef.current.color.setHex(c.body);
    if (wireMaterialRef.current) wireMaterialRef.current.color.setHex(c.wire);
    if (pointLight1Ref.current) pointLight1Ref.current.color.setHex(c.light1);
    if (pointLight2Ref.current) pointLight2Ref.current.color.setHex(c.light2);
  };

  const toggleWireframe = () => {
    const next = !wireframeMode;
    setWireframeMode(next);
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.wireframe = next;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
    >
      {/* Interactive HUD Top Info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span className="text-xs font-mono text-cyan-400/90 uppercase tracking-widest">
          3D Eagle Hologram · Interactive
        </span>
      </div>

      {/* Interactive On-Canvas 3D Tuning Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Wireframe toggle */}
        <button
          onClick={toggleWireframe}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border backdrop-blur-md transition-all ${
            wireframeMode
              ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
              : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Toggle Wireframe Matrix"
        >
          {wireframeMode ? 'Wireframe: ON' : 'Wireframe: OFF'}
        </button>

        {/* Speed multiplier */}
        <button
          onClick={() => setWingSpeedMultiplier(wingSpeedMultiplier === 1 ? 1.8 : 1)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border backdrop-blur-md transition-all ${
            wingSpeedMultiplier > 1
              ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
              : 'bg-black/60 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Flight Speed Acceleration"
        >
          <Zap className="w-3 h-3 inline mr-1" />
          <span>{wingSpeedMultiplier > 1 ? 'Hyperspeed' : 'Normal'}</span>
        </button>
      </div>

      {/* Bottom Color Scheme Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
        <span className="text-[10px] font-mono text-slate-400 px-1">Glow:</span>
        {(['cyan', 'purple', 'emerald', 'gold'] as const).map((scheme) => (
          <button
            key={scheme}
            onClick={() => applyColorScheme(scheme)}
            className={`w-4 h-4 rounded-full border transition-transform ${
              scheme === 'cyan'
                ? 'bg-cyan-400'
                : scheme === 'purple'
                ? 'bg-purple-400'
                : scheme === 'emerald'
                ? 'bg-emerald-400'
                : 'bg-amber-400'
            } ${currentColorScheme === scheme ? 'scale-125 border-white' : 'border-transparent opacity-60'}`}
            title={`Switch to ${scheme} energy glow`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 z-10 pointer-events-none text-right">
        <p className="text-[11px] font-mono text-slate-400/80 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
          {isHovered ? 'Drag / Move cursor to rotate orbit' : 'Move cursor over 3D model'}
        </p>
      </div>
    </div>
  );
};
