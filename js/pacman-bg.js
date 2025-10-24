// === BlinkGames - Pac-Man Neon (Fundo Transparente, Cores Vivas) ===

// Cria o canvas e adiciona ao corpo da página
const canvas = document.createElement("canvas");
canvas.classList.add("background-animation");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  resetDots();
});

// === Configurações ===
let pacman = { x: 0, y: canvas.height - 60, size: 25, speed: 2, mouth: 0 };
let dots = [];
const spacing = 60;

// Gera bolinhas
function resetDots() {
  dots = [];
  for (let i = 0; i < canvas.width; i += spacing) {
    dots.push({ x: i + 20, y: canvas.height - 50, eaten: false });
  }
}
resetDots();

function drawPacman() {
  ctx.beginPath();
  const angle = Math.abs(Math.sin(pacman.mouth)) * 0.4 + 0.2; // abre/fecha boca
  ctx.moveTo(pacman.x, pacman.y);
  ctx.arc(pacman.x, pacman.y, pacman.size, angle * Math.PI, (2 - angle) * Math.PI);
  ctx.lineTo(pacman.x, pacman.y);

  // cor neon viva
  ctx.fillStyle = "#ffde59";
  ctx.shadowBlur = 25;
  ctx.shadowColor = "#ffde59";
  ctx.fill();
}

function drawDots() {
  ctx.fillStyle = "#00e0ff";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00e0ff";
  dots.forEach((dot) => {
    if (!dot.eaten) ctx.fillRect(dot.x, dot.y, 8, 8);
  });
}

function animate() {
  // limpa só o desenho, mas mantém fundo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawDots();
  drawPacman();

  pacman.x += pacman.speed;
  pacman.mouth += 0.15;

  dots.forEach((dot) => {
    if (!dot.eaten && Math.abs(dot.x - pacman.x) < 20) dot.eaten = true;
  });

  if (pacman.x - pacman.size > canvas.width) {
    pacman.x = -50;
    dots.forEach((d) => (d.eaten = false));
  }

  requestAnimationFrame(animate);
}

animate();

