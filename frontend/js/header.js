// ============================================================
// 🎮 BlinkGames — header.js (v6.0 SINCRONIZADO + DESIGN LIMPO)
// ============================================================

import { updateBadge, getToken, getUser, clearAuth } from "./state.js";

// ============================================================
// 🔗 Links fixos do menu
// ============================================================
const LINKS = [
  { href: "index.html", label: "Home" },
  { href: "rifas.html", label: "Rifas" },
  { href: "vencedores.html", label: "Vencedores" },
  { href: "termos.html", label: "Termos" },
  { href: "sobre.html", label: "Sobre" },
];

// ============================================================
// 🧱 Monta o cabeçalho dinâmico
// ============================================================
export function mountHeader() {
  const header = document.getElementById("header");
  if (!header) return;

  const user = getUser();
  const logged = !!getToken();
  const nome = user?.nome || user?.name || "Blink";

  const linksHTML = LINKS.map(
    (l) =>
      `<a href="${l.href}" class="${
        isActive(l.href) ? "active" : ""
      }">${l.label}</a>`
  ).join("");

  const userSection = logged
    ? `
      <div id="header-user" class="user-area">
        <span>Olá, <strong>${nome.split(" ")[0]}</strong>!</span>
        <a href="minhas-rifas.html" class="small">Minhas Rifas</a>
        <a href="carrinho.html" class="small">
          Carrinho <span id="cart-badge" class="badge">0</span>
        </a>
        <button id="logout" class="btn small">Sair</button>
      </div>
    `
    : `
      <div id="header-auth" class="auth-area">
        <a href="conta.html" class="small">Entrar</a>
        <a href="carrinho.html" class="small">
          Carrinho <span id="cart-badge" class="badge">0</span>
        </a>
      </div>
    `;

  header.innerHTML = `
    <header class="site">
      <div class="header-inner">
        <a class="brand" href="index.html">
          Blink<span>Games</span>
        </a>
        <nav class="nav">
          ${linksHTML}
          ${userSection}
        </nav>
      </div>
    </header>
  `;

  // ============================================================
  // 🚪 Logout
  // ============================================================
  const logoutBtn = document.getElementById("logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      clearAuth();
      window.location.href = "index.html";
    });
  }

  // ============================================================
  // 🔢 Atualiza badge inicial
  // ============================================================
  updateBadge();

  // ============================================================
  // 🌀 Mantém contador do carrinho atualizado em tempo real
  // ============================================================
  window.addEventListener("storage", (e) => {
    if (e.key === "blink_cart") updateBadge();
  });
}

// ============================================================
// 📍 Detecta página ativa
// ============================================================
function isActive(href) {
  const current = window.location.pathname.split("/").pop() || "index.html";
  return current === href;
}

// ============================================================
// 🚀 Monta automaticamente no load
// ============================================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountHeader);
} else {
  mountHeader();
}

