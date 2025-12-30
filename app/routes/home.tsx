import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "LUKAIRO | 3D Data Globe" },
		{
			name: "description",
			content:
				"Interactive 3D data globe with luminous pathways and Cloudflare-powered content.",
		},
	];
}

export function loader({ context }: Route.LoaderArgs) {
	const message = context.cloudflare?.env?.VALUE_FROM_CLOUDFLARE ?? "lukairo-edge";
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
















  return (
	<section className="hero">
	  <h1>LUKAIRO ENGINE</h1>
	  <p>Modern full-stack platform. Powered by Cloudflare, React, and AI.</p>
	  <p style={{ marginTop: 32, fontSize: "1.1rem", opacity: 0.7 }}>
		Welcome to your new home page! Edit <code>app/routes/home.tsx</code> to customize.
	  </p>
	</section>
  );
	return (
		<main className="min-h-screen bg-slate-950 text-slate-50">
			<section className="container mx-auto px-4 py-16 space-y-10">
				<div className="space-y-4">
					<p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Lukairo</p>
					<h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
						3D Data Globe
					</h1>
					<p className="max-w-3xl text-slate-300">
						A luminous, real-time canvas for data pathways, powered by Three.js and
							Cloudflare. Rotate, explore, and imagine your network coming alive.
					</p>
				</div>

				<DataGlobe />

				<div className="grid gap-6 rounded-2xl border border-cyan-900/40 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-[0_10px_50px_rgba(0,255,204,0.1)] lg:grid-cols-[1.4fr_1fr]">
					<div className="space-y-3">
						<p className="text-xs uppercase tracking-[0.25em] text-cyan-300">What we do</p>
						<h2 className="text-2xl font-semibold">Data infrastructure built for speed and trust</h2>
						<p className="text-slate-300">
							We fuse real-time pipelines, resilient governance, and AI inference into one programmable fabric. Ship faster, audit confidently, and see your network as one luminous surface.
						</p>
						<div className="grid gap-3 sm:grid-cols-2">
							{[
								"Streaming ingestion & CDC",
								"Observability with lineage",
								"AI/ML feature delivery",
								"Zero-trust access & policy",
							].map((item) => (
								<div
									key={item}
									className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 text-sm"
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
							Live telemetry fuels topology-aware routing, trust scoring, and adaptive guardrails across your data surface.
						</p>
					</div>
				</div>
			</section>

			<section className="container mx-auto px-4 pb-16 space-y-10">
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
							Schedule a walkthrough of the LUKAIRO data globe mapped to your domains, sources, and AI features.
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
		</main>
	);
}
