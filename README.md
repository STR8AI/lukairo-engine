
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LUKAIRO | Delivering Control. Returning Time.</title>

  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: #000;
      color: #fff;
      font-family: 'Inter','SF Pro Display',-apple-system,BlinkMacSystemFont,sans-serif;
      overflow: hidden;
    }

    #lukairo-scene {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100vh;
      z-index: 1;
      background: radial-gradient(circle at center,#040404,#000);
    }

    .overlay {
      position: fixed;
      top: 50%; left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      color: #00E5D1;
      z-index: 5;
    }

    .overlay h1 {
      font-size: clamp(3rem,6vw,5rem);
      margin-bottom: 1rem;
      text-shadow: 0 0 40px rgba(0,229,209,0.4);
      letter-spacing: 0.05em;
    }

    .overlay p {
      color: #b0b0b0;
      font-size: 1.2rem;
      line-height: 1.6;
    }

    .maple{font-size:1.3rem;margin-left:.3rem;}

    footer {
      position: fixed;
      bottom: 1rem; left: 50%;
      transform: translateX(-50%);
      color: #444;
      font-size: 0.9rem;
      z-index: 10;
    }

    .label {
      position: absolute;
      color: #00E5D1;
      font-size: 0.9rem;
      text-shadow: 0 0 8px #00E5D1;
      pointer-events: none;
      font-weight: 500;
      transition: opacity 0.3s ease;
    }
  </style>
</head>
<body>

  <!-- 3D Scene -->
  <div id="lukairo-scene"></div>

  <!-- Branding Overlay -->
  <div class="overlay">
    <h1>LUKAIRO</h1>
    <p>Delivering Control. Returning Time.<br>Proudly Canadian <span class="maple">🍁</span></p>
  </div>

  <footer>© 2025 LUKAIRO LDB INC.</footer>

  <script src="https://unpkg.com/three@0.158.0/build/three.min.js"
          integrity="sha384-+QnQn6l0e6QFq6gk6QnQn6l0e6QFq6gk6QnQn6l0e6QFq6gk6QnQn6l0e6QFq6gk"
          crossorigin="anonymous"></script>

  <script>
    window.addEventListener("load", () => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      document.getElementById("lukairo-scene").appendChild(renderer.domElement);

      // Lights
      const ambient = new THREE.AmbientLight(0x00e5d1, 0.4);
      scene.add(ambient);
      const mainLight = new THREE.PointLight(0x00e5d1, 1.6, 100);
      scene.add(mainLight);
      const rotatingLight = new THREE.PointLight(0x00ffff, 1.0, 50);
      scene.add(rotatingLight);

      // Core Gear Sphere
      const loader = new THREE.TextureLoader();
      let texture = null;
      // Try to load the texture, handle error gracefully
      texture = loader.load(
        "LUKAIRO.png", // must be in same folder
        undefined, // onLoad (not needed here)
        undefined, // onProgress (not needed)
        function onError(err) {
          console.error("Failed to load texture 'LUKAIRO.png':", err);
          // Fallback: use a simple white texture
          const fallbackCanvas = document.createElement('canvas');
          fallbackCanvas.width = fallbackCanvas.height = 64;
          const ctx = fallbackCanvas.getContext('2d');
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, 64, 64);
          texture.image = fallbackCanvas;
          texture.needsUpdate = true;
        }
      );
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(3, 64, 64),
        new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 1,
          roughness: 0.25,
          emissive: 0x001111,
          emissiveIntensity: 0.6
        })
      );
      scene.add(core);

      // Connected Platforms
      const systems = [
        { name: "Jobber", orbit: 8, color: 0x00e5d1 },
        { name: "Housecall Pro", orbit: 10, color: 0x00bfff },
        { name: "ServiceTitan", orbit: 12, color: 0x33aaff },
        { name: "Workiz", orbit: 9, color: 0x00ffaa },
        { name: "Others", orbit: 11, color: 0x00ffcc }
      ];

      const nodes = [];
      const beams = [];
      const labels = [];

      const orbMat = new THREE.MeshStandardMaterial({
        emissive: 0x00e5d1,
        emissiveIntensity: 2,
        color: 0x001010,
        metalness: 0.9,
        roughness: 0.2
      });

      // Create orbiting nodes and labels
      systems.forEach((sys, i) => {
        const orb = new THREE.Mesh(new THREE.SphereGeometry(0.4, 32, 32), orbMat.clone());
        orb.material.emissive.setHex(sys.color);
        orb.userData = { orbit: sys.orbit, phase: i, scale: 1, dir: 1, color: sys.color, connected: false };
        scene.add(orb);
        nodes.push(orb);

        // Connection beam
        const beamGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
        const beamMat = new THREE.LineBasicMaterial({ color: sys.color, transparent: true, opacity: 0 });
        const beam = new THREE.Line(beamGeom, beamMat);
        scene.add(beam);
        beams.push(beam);

        // Label
        const lbl = document.createElement("div");
        lbl.className = "label";
        lbl.innerText = sys.name;
        document.body.appendChild(lbl);
        labels.push(lbl);
      });

      // Particle Field
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(2500);
      for (let i = 0; i < pos.length; i++) pos[i] = (Math.random() - 0.5) * 100;
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const particles = new THREE.Points(
        geo,
        new THREE.PointsMaterial({ color: 0x00e5d1, size: 0.05, transparent: true, opacity: 0.4 })
      );
      scene.add(particles);

      camera.position.z = 22;

      // Animate
      function animate() {
        requestAnimationFrame(animate);
        const t = Date.now() * 0.001;

        // Core rotation
        core.rotation.y += 0.0025;
        core.rotation.x += 0.0012;

        // Rotating shimmer light
        rotatingLight.position.set(Math.sin(t*0.8)*10, Math.cos(t*0.6)*5, Math.cos(t*0.9)*10);

        // Particles
        particles.rotation.y += 0.0004;

        // Nodes orbit
        nodes.forEach((n, i) => {
          const angle = t*0.6 + i;
          const pull = Math.sin(t*0.4 + i)*0.3;
          const r = n.userData.orbit - pull;
          n.position.x = Math.sin(angle)*r;
          n.position.y = Math.cos(angle)*r;
          n.position.z = Math.sin(t*0.2 + i)*1.5;

          // Scale pulse
          n.userData.scale += 0.002 * n.userData.dir;
          if (n.userData.scale > 1.1 || n.userData.scale < 0.9) n.userData.dir *= -1;
          n.scale.setScalar(n.userData.scale);

          // Connection beam (reactive)
          const distance = n.position.length();
          const beam = beams[i];
          if (distance < 9) {
            beam.material.opacity = 0.6;
            beam.geometry.setFromPoints([new THREE.Vector3(), n.position.clone()]);
            n.userData.connected = true;
          } else if (n.userData.connected) {
            beam.material.opacity *= 0.9;
            if (beam.material.opacity < 0.05) {
              n.userData.connected = false;
              beam.material.opacity = 0;
            }
          }

          // Label positioning
          const vector = n.position.clone().project(camera);
          const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
          const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
          labels[i].style.left = `${x}px`;
          labels[i].style.top = `${y}px`;
          labels[i].style.opacity = n.userData.connected ? 1 : 0.6;
        });

        renderer.render(scene, camera);
      }
      animate();

      // Resize
      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });
    });
  </script>
</body>
</html>
