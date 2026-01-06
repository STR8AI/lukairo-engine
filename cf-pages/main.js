// BASIC ROTATING GLOBE (canvas-based placeholder)
// Replace later with Three.js if desired

const canvas = document.getElementById('globe');
if (!canvas) {
  console.error('Canvas element with id="globe" not found');
} else {
  const ctx = canvas.getContext('2d');

  function resize() {
    // Set canvas size to match its CSS dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  resize();
  window.addEventListener('resize', resize);

  let angle = 0;

  function drawGlobe() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radius = Math.min(canvas.width, canvas.height) * 0.4;
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Rotating latitude lines
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      // Ensure radiusY is always positive (0 or greater)
      const radiusY = Math.max(0, radius * Math.cos(angle + i * 0.4));
      ctx.ellipse(x, y, radius, radiusY, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    angle += 0.01;
    requestAnimationFrame(drawGlobe);
  }

  // Mark canvas as loaded on first successful render
  try {
    drawGlobe();
    // Mark the parent wrapper to help with CSS targeting
    canvas.closest('.globe-wrapper')?.classList.add('canvas-active');
  } catch (e) {
    console.error('Failed to initialize canvas globe:', e);
  }
}
