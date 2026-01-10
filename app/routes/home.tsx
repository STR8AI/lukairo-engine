import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'LUKAIRO • Neural Core' },
    {
      name: 'description',
      content: 'LUKAIRO Neural Core visualization with three layered spheres and ambient starfield.',
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const message = context.cloudflare?.env?.VALUE_FROM_CLOUDFLARE ?? 'lukairo-edge';
  return { message };
}

function NeuralCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const GEARS_URL = '/assets/lukairo_gears.png';
    const CIRCUITS_URL = '/assets/lukairo_circuits.png';
    const GLOBE_URL = '/assets/lukairo_globe.png';

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let gearsCore: THREE.Mesh;
    let circuitShell: THREE.Mesh;
    let globeShell: THREE.Mesh;
    let wireMesh: THREE.Mesh;
    let starField: THREE.Points;
    const clock = new THREE.Clock();
    let isAnimating = true;

    function init() {
      scene = new THREE.Scene();
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width || window.innerWidth));
      const h = Math.max(1, Math.floor(rect.height || window.innerHeight));

      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
      camera.position.set(0, 0.5, 2.7);

      const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, motionReduced ? 1 : 2);

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(w, h, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);

      scene.add(new THREE.AmbientLight(0x66ffcc, 0.35));
      const keyLight = new THREE.PointLight(0x4cffc4, 1.4, 10);
      keyLight.position.set(2.2, 2.3, 3.2);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight(0x00ffaa, 0.8, 8);
      rimLight.position.set(-2.6, -1.4, -2.7);
      scene.add(rimLight);

      const texLoader = new THREE.TextureLoader();

      // Inner Core: Gears
      const coreGeo = new THREE.SphereGeometry(0.45, 96, 96);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.35,
        metalness: 0.85,
        emissive: new THREE.Color(0x22ffbb),
        emissiveIntensity: 0.7,
      });
      gearsCore = new THREE.Mesh(coreGeo, coreMat);
      scene.add(gearsCore);

      texLoader.load(
        GEARS_URL,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);
          gearsCore.material.map = tex;
          gearsCore.material.emissiveIntensity = 0.9;
          gearsCore.material.needsUpdate = true;
        },
        undefined,
        (err) => console.warn('GEARS texture load failed (non-fatal)', err)
      );

      // Mid Layer: Circuits
      const circGeo = new THREE.SphereGeometry(0.65, 96, 96);
      const circMat = new THREE.MeshStandardMaterial({
        color: 0x031015,
        roughness: 0.55,
        metalness: 0.3,
        emissive: new THREE.Color(0x1bffc0),
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.9,
      });
      circuitShell = new THREE.Mesh(circGeo, circMat);
      scene.add(circuitShell);

      texLoader.load(
        CIRCUITS_URL,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);
          circuitShell.material.map = tex;
          circuitShell.material.needsUpdate = true;
        },
        undefined,
        (err) => console.warn('CIRCUITS texture load failed (non-fatal)', err)
      );

      // Outer Layer: Data Globe
      const globeGeo = new THREE.SphereGeometry(0.85, 96, 96);
      const globeMat = new THREE.MeshPhongMaterial({
        color: 0x020b11,
        emissive: 0x0cf0b0,
        emissiveIntensity: 0.55,
        shininess: 16,
        transparent: true,
        opacity: 0.55,
      });
      globeShell = new THREE.Mesh(globeGeo, globeMat);
      scene.add(globeShell);

      texLoader.load(
        GLOBE_URL,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy?.() || 1, 8);
          globeShell.material.map = tex;
          globeShell.material.needsUpdate = true;
        },
        undefined,
        (err) => console.warn('GLOBE texture load failed (non-fatal)', err)
      );

      // Wireframe overlay on globe
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x36ffca,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
      });
      wireMesh = new THREE.Mesh(globeGeo, wireMat);
      scene.add(wireMesh);

      // Starfield backdrop
      starField = createStarfield(1200, 6.5);
      scene.add(starField);
    }

    function createStarfield(count: number, radius: number) {
      const geom = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = radius * (0.6 + Math.random() * 0.4);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
      }
      geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: 0x66ffcc,
        size: 0.01,
        transparent: true,
        opacity: 0.6,
      });
      return new THREE.Points(geom, mat);
    }

    let animationFrame: number;
    function animate() {
      if (!isAnimating) return;
      animationFrame = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      gearsCore.rotation.y += 0.6 * dt;
      circuitShell.rotation.y -= 0.5 * dt;
      globeShell.rotation.y += 0.3 * dt;
      wireMesh.rotation.y += 0.3 * dt;
      renderer.render(scene, camera);
    }

    function onResize() {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width || window.innerWidth));
      const h = Math.max(1, Math.floor(rect.height || window.innerHeight));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function setupVisibilityHandling() {
      const handleVisibilityChange = () => {
        isAnimating = !document.hidden;
        if (isAnimating) {
          clock.getDelta();
          animate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    init();
    animate();
    const cleanupVisibility = setupVisibilityHandling();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', onResize);
      cleanupVisibility();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Three rotating layered spheres representing gears, circuits, and a data globe with starfield backdrop"
      className="w-full h-full"
    />
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main
      className="relative overflow-hidden"
      style={{
        minHeight: '110vh',
        background: 'radial-gradient(circle at 50% 0%, #07121e 0%, #020409 60%, #000000 100%)',
      }}
    >
      {/* Neural Core Visualization */}
      <section
        className="relative w-screen"
        style={{
          height: '110vh',
          marginLeft: 'calc(50% - 50vw)',
          marginRight: 'calc(50% - 50vw)',
        }}
        role="region"
        aria-label="LUKAIRO Neural Core"
      >
        {/* HUD Overlay */}
        <div className="absolute top-[6%] left-0 right-0 text-center z-10 pointer-events-none">
          <h1
            className="m-0 uppercase"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              letterSpacing: '0.30em',
              color: '#ddfaff',
              textShadow: '0 0 14px rgba(91,255,200,.8), 0 0 40px rgba(61,255,185,.6)',
            }}
          >
            LUK<span style={{ color: '#48ffc8' }}>AIRO</span>
          </h1>
          <p
            className="mt-[0.65rem] uppercase"
            style={{
              fontSize: '0.82rem',
              letterSpacing: '0.36em',
              color: '#80ffc7',
              opacity: 0.85,
            }}
          >
            THE NEURAL CORE · CONNECTING EVERYTHING
          </p>
        </div>

        {/* Core Glow Effect */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: '34vmin',
            height: '34vmin',
            top: '58%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle at 50% 50%, rgba(76,255,196,0.9) 0%, rgba(76,255,196,0.0) 55%)',
            filter: 'blur(18px)',
            opacity: 0.6,
            animation: 'breathe 3.4s ease-in-out infinite',
          }}
        />

        {/* 3D Canvas Container */}
        <div className="absolute inset-0">
          <NeuralCore />
        </div>
      </section>

      {/* Content Below */}
      <section className="container mx-auto px-4 py-16 space-y-10 relative z-10">
        <div className="grid gap-6 rounded-2xl border border-cyan-900/40 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-[0_10px_50px_rgba(0,255,204,0.1)] lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">What we do</p>
            <h2 className="text-2xl font-semibold text-slate-50">
              Data infrastructure built for speed and trust
            </h2>
            <p className="text-slate-300">
              We fuse real-time pipelines, resilient governance, and AI inference into one
              programmable fabric. Ship faster, audit confidently, and see your network as one
              luminous surface.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Streaming ingestion & CDC',
                'Observability with lineage',
                'AI/ML feature delivery',
                'Zero-trust access & policy',
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm text-slate-50"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,255,204,0.7)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-800/80 bg-slate-900/50 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Signal</p>
            <p className="text-sm text-slate-300">
              Cloudflare value: <span className="text-cyan-300">{loaderData.message}</span>
            </p>
            <p className="text-sm text-slate-400">
              Live telemetry fuels topology-aware routing, trust scoring, and adaptive guardrails
              across your data surface.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 space-y-10 relative z-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-cyan-900/40 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Industries</p>
            <ul className="mt-4 space-y-3 text-slate-200">
              <li>AI-native SaaS</li>
              <li>Financial services</li>
              <li>Logistics & mobility</li>
              <li>Healthcare data platforms</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-cyan-900/40 bg-slate-900/60 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Why it wins</p>
            <ul className="mt-4 space-y-3 text-slate-200">
              <li>Programmable governance baked into flows</li>
              <li>Low-latency edges with Cloudflare reach</li>
              <li>Unified lineage for audit and safety</li>
              <li>AI feature delivery without toil</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-cyan-900/40 bg-gradient-to-br from-cyan-900/40 to-teal-800/30 p-6 shadow-[0_10px_50px_rgba(0,255,204,0.15)]">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-100">Call to action</p>
            <h3 className="mt-3 text-xl font-semibold text-white">See your data surface</h3>
            <p className="mt-2 text-sm text-cyan-50/80">
              Schedule a walkthrough of the LUKAIRO data globe mapped to your domains, sources, and
              AI features.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-full bg-cyan-400 px-4 py-2 text-slate-950 font-semibold shadow-[0_10px_30px_rgba(0,255,204,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,255,204,0.45)]">
                Book a demo
              </button>
              <button className="rounded-full border border-cyan-400/60 px-4 py-2 text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:text-white">
                Download overview
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes breathe {
          0% { transform: translate(-50%, -50%) scale(0.93); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.07); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(0.93); opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
