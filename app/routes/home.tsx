import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'LUKAIRO | 3D Data Globe' },
    {
      name: 'description',
      content: 'Interactive 3D data globe with luminous pathways and Cloudflare-powered content.',
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const message = context.cloudflare?.env?.VALUE_FROM_CLOUDFLARE ?? 'lukairo-edge';
  return { message };
}

function DataGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const nebulaGeometry = new THREE.PlaneGeometry(14, 8);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a1f33,
      transparent: true,
      opacity: 0.55,
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.set(0, 0, -4);
    scene.add(nebula);

    const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0f12,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x00ffcc,
      emissiveIntensity: 0.32,
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    const haloGeometry = new THREE.SphereGeometry(2.08, 48, 48);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffee,
      wireframe: true,
      opacity: 0.35,
      transparent: true,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    scene.add(halo);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 900;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40;
      starPositions[i + 1] = (Math.random() - 0.5) * 40;
      starPositions[i + 2] = -6 - Math.random() * 8;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0x66ffee,
      size: 0.04,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff });
    const lines: THREE.Line[] = [];
    for (let i = 0; i < 80; i++) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2),
        new THREE.Vector3(0, 0, Math.random() * 2),
        new THREE.Vector3(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2)
      );
      const points = curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, lineMaterial);
      lines.push(line);
      scene.add(line);
    }

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const orbitBands = [2.8, 3.3, 3.8];
    const orbiters: THREE.Mesh[] = [];
    const orbitGeometries: THREE.SphereGeometry[] = [];
    const orbitMaterials: THREE.Material[] = [];
    const ringGeometries: THREE.RingGeometry[] = [];
    const ringMaterials: THREE.Material[] = [];
    orbitBands.forEach((radius, idx) => {
      const ringGeometry = new THREE.RingGeometry(radius - 0.005, radius + 0.005, 90);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffee,
        opacity: 0.12,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = idx * 0.4;
      orbitGroup.add(ring);
      ringGeometries.push(ringGeometry);
      ringMaterials.push(ringMaterial);

      const orbGeometry = new THREE.SphereGeometry(0.09, 16, 16);
      const orbMaterial = new THREE.MeshStandardMaterial({
        color: 0x99ffee,
        emissive: 0x00ffee,
        emissiveIntensity: 0.8,
        metalness: 0.3,
      });
      orbitGeometries.push(orbGeometry);
      orbitMaterials.push(orbMaterial);

      for (let i = 0; i < 5; i++) {
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        const angle = (i / 5) * Math.PI * 2 + idx * 0.3;
        orb.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        orbitGroup.add(orb);
        orbiters.push(orb);
      }
    });

    const ambientLight = new THREE.AmbientLight(0x00ffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    camera.position.z = 5;

    let animationFrame: number;
    let t = 0;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      globe.rotation.y += 0.002;
      halo.rotation.y -= 0.0015;
      orbitGroup.rotation.y += 0.0012;
      nebula.rotation.z += 0.0006;
      stars.rotation.z -= 0.0004;
      t += 0.0015;
      orbiters.forEach((orb, idx) => {
        const radius = orbitBands[Math.floor(idx / 5)];
        const offset = (idx % 5) / 5;
        const angle = t * 0.8 + offset * Math.PI * 2;
        orb.position.x = Math.cos(angle) * radius;
        orb.position.z = Math.sin(angle) * radius;
      });
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth || window.innerWidth;
      renderer.setSize(newWidth, height);
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      lines.forEach((line) => line.geometry.dispose());
      lineMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      globeGeometry.dispose();
      globeMaterial.dispose();
      ringGeometries.forEach((geo) => geo.dispose());
      ringMaterials.forEach((mat) => mat.dispose());
      orbitGeometries.forEach((geo) => geo.dispose());
      orbitMaterials.forEach((mat) => mat.dispose());
      orbitGroup.clear();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(0,255,204,0.35),0_20px_70px_rgba(0,255,204,0.2)] border border-cyan-800/40 transition-all hover:shadow-[0_0_70px_rgba(0,255,204,0.5),0_30px_90px_rgba(0,255,204,0.3)] hover:border-cyan-700/60"
      style={{
        height: 500,
        background: 'radial-gradient(circle at 35% 30%, #001424, #000814, #00111f, #000)',
      }}
    />
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 space-y-12">
        <div className="space-y-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-medium animate-pulse">
            Lukairo Engine
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-cyan-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent">
            3D Data Globe
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed">
            A luminous, real-time canvas for data pathways, powered by Three.js and Cloudflare.
            Rotate, explore, and imagine your network coming alive.
          </p>
        </div>

        <DataGlobe />

        {/* Main Content Card */}
        <div className="grid gap-8 rounded-3xl border border-cyan-900/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-8 shadow-[0_20px_70px_rgba(0,255,204,0.15)] backdrop-blur-sm lg:grid-cols-[1.4fr_1fr] transition-all hover:shadow-[0_25px_90px_rgba(0,255,204,0.25)] hover:border-cyan-800/50">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400 font-semibold">
              What we do
            </p>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Data infrastructure built for speed and trust
            </h2>
            <p className="text-slate-300 text-base leading-relaxed">
              We fuse real-time pipelines, resilient governance, and AI inference into one
              programmable fabric. Ship faster, audit confidently, and see your network as one
              luminous surface.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {[
                'Streaming ingestion & CDC',
                'Observability with lineage',
                'AI/ML feature delivery',
                'Zero-trust access & policy',
              ].map((item) => (
                <div
                  key={item}
                  className="group flex items-center gap-3 rounded-xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-900/40 px-4 py-3 text-sm transition-all hover:border-cyan-700/60 hover:bg-gradient-to-br hover:from-slate-800/90 hover:to-slate-900/60 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_16px_rgba(0,255,204,0.8)] group-hover:shadow-[0_0_24px_rgba(0,255,204,1)] transition-shadow" />
                  <span className="text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400 font-semibold">
              Signal
            </p>
            <p className="text-base text-slate-300">
              Cloudflare value:{' '}
              <span className="font-semibold text-cyan-300">{loaderData.message}</span>
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Live telemetry fuels topology-aware routing, trust scoring, and adaptive guardrails
              across your data surface.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 pb-20 space-y-10">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="group rounded-3xl border border-cyan-900/30 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 transition-all hover:border-cyan-800/50 hover:shadow-[0_20px_60px_rgba(0,255,204,0.2)] hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400 font-semibold">
              Industries
            </p>
            <ul className="mt-6 space-y-4 text-slate-200">
              {['AI-native SaaS', 'Financial services', 'Logistics & mobility', 'Healthcare data platforms'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="group rounded-3xl border border-cyan-900/30 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-8 transition-all hover:border-cyan-800/50 hover:shadow-[0_20px_60px_rgba(0,255,204,0.2)] hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-400 font-semibold">
              Why it wins
            </p>
            <ul className="mt-6 space-y-4 text-slate-200">
              {[
                'Programmable governance baked into flows',
                'Low-latency edges with Cloudflare reach',
                'Unified lineage for audit and safety',
                'AI feature delivery without toil',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-base">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/60" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="group rounded-3xl border border-cyan-700/40 bg-gradient-to-br from-cyan-900/50 via-teal-900/40 to-slate-900/50 p-8 shadow-[0_20px_60px_rgba(0,255,204,0.2)] transition-all hover:border-cyan-600/60 hover:shadow-[0_25px_80px_rgba(0,255,204,0.3)] hover:-translate-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200 font-bold">
              Call to action
            </p>
            <h3 className="mt-4 text-2xl font-bold text-white leading-tight">
              See your data surface
            </h3>
            <p className="mt-3 text-base text-cyan-50/90 leading-relaxed">
              Schedule a walkthrough of the LUKAIRO data globe mapped to your domains, sources, and
              AI features.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button className="rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 px-6 py-3 text-slate-950 font-bold shadow-[0_10px_40px_rgba(0,255,204,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,255,204,0.6)] hover:scale-[1.02]">
                Book a demo
              </button>
              <button className="rounded-full border-2 border-cyan-400/70 px-6 py-3 text-cyan-100 font-semibold backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-white hover:shadow-[0_10px_30px_rgba(0,255,204,0.2)]">
                Download overview
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
