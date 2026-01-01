// BASIC ROTATING GLOBE (canvas-based placeholder)
// Replace later with Three.js if desired

const canvas = document.getElementById('globe');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

let angle = 0;

function drawGlobe() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const radius = Math.min(canvas.width, canvas.height) * 0.25;
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
    ctx.ellipse(x, y, radius, radius * Math.cos(angle + i * 0.4), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  angle += 0.01;
  requestAnimationFrame(drawGlobe);
}

drawGlobe();
