// 🎮 Pac-Man Footer Animation (BlinkGames Neon Edition)
const canvas = document.getElementById("pacman-footer");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 90; // altura maior que antes
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Pac-Man config
let pacman = {
  x: -50,
  y: canvas.height / 2,
  size: 24, // Pac-Man maior
  speed: 2.5,
  mouthOpen: true
};

// Bolinhas
let dots = [];
function createDots() {
  const spacing = 50;
  const count = Math.ceil(canvas.width / spacing);
  dots = [];
  for (let i = 0; i < count; i++) {
    dots.push({ x: i * spacing + 30, y: canvas.height / 2 });
  }
}
createDots();

// Desenha bolinhas
function drawDots() {
  ctx.fillStyle = "#00e0ff";
  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Desenha Pac-Man
function drawPacman() {
  ctx.fillStyle = "#ffde59";
  ctx.beginPath();

  const mouthAngle = pacman.mouthOpen ? 0.3 : 0.1;
  ctx.moveTo(pacman.x, pacman.y);
  ctx.arc(pacman.x, pacman.y, pacman.size, mouthAngle * Math.PI, (2 - mouthAngle) * Math.PI);
  ctx.lineTo(pacman.x, pacman.y);
  ctx.fill();
}

// Atualiza posição e anima
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawDots();
  drawPacman();

  pacman.x += pacman.speed;

  // Come bolinhas próximas
  dots = dots.filter(dot => Math.abs(dot.x - pacman.x) > pacman.size * 0.8);

  // Alterna boca
  if (Math.random() < 0.1) pacman.mouthOpen = !pacman.mouthOpen;

  // Quando sai da tela, volta e recria as bolinhas
  if (pacman.x - pacman.size > canvas.width) {
    pacman.x = -50;
    createDots();
  }

  requestAnimationFrame(update);
}

update();

