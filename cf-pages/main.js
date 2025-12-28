console.log("MAIN.JS RUNNING");

// Grab canvas
const canvas = document.getElementById("globe");
if (!canvas) {
  console.error("No #globe canvas found");
} else {
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // Big red block so we can't miss it
  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 200, 200);
}
