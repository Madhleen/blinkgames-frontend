// ============================================================
// 👾 Pac-Man Footer (animação discreta no rodapé)
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pacman-footer");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.bottom = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "40px";
  canvas.style.zIndex = "2";
  canvas.style.pointerEvents = "none";

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = 40;
  }
  window.addEventListener("resize", resize);
  resize();

  const pacman = { x: 0, y: 20, r: 8, speed: 2 };
  const dots = Array.from({ length: 80 }, (_, i) => ({
    x: i * 25 + 10,
    y: 20,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffde59"; // amarelo
    ctx.beginPath();
    ctx.moveTo(pacman.x, pacman.y);
    ctx.arc(pacman.x, pacman.y, pacman.r, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#00e0ff"; // azul bolinhas
    dots.forEach((dot) => {
      if (Math.abs(dot.x - pacman.x) > 10) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    pacman.x += pacman.speed;
    if (pacman.x > canvas.width + pacman.r) pacman.x = -pacman.r;
    requestAnimationFrame(draw);
  }

  draw();
});

