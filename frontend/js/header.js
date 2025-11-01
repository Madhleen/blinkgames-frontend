// ============================================================
// 🎮 BlinkGames — header.js (v5.5 ROBUSTO FINAL)
// ============================================================

import { updateBadge, getToken, getUser, clearAuth } from './state.js';

const LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'rifas.html', label: 'Rifas' },
  { href: 'vencedores.html', label: 'Vencedores' },
  { href: 'termos.html', label: 'Termos' },
  { href: 'sobre.html', label: 'Sobre' },
];

// ============================================================
// 🔎 Detecta página ativa (funciona em Render/Vercel)
// ============================================================
function isActive(href) {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  return current === href;
}

// ============================================================
// 🧱 Monta o cabeçalho
// ============================================================
export function mountHeader() {
  const el = document.getElementById('header');
  if (!el) return;

  const user = getUser();
  const logged = !!getToken();
  const nome = user?.nome || user?.name || '';

  const right = logged
    ? `
        <div id="header-user" class="user-area">
          <span>Olá, <strong>${nome.split(' ')[0]}</strong>!</span>
          <a href="minhas-rifas.html" class="small">Minhas Rifas</a>
          <a href="carrinho.html" class="small">
            Carrinho <span id="cart-badge" class="badge">0</span>
          </a>
          <button id="logout" class="btn small">Sair</button>
        </div>
      `
    : `
        <div id="header-auth" class="auth-area">
          <a href="conta.html" class="small">Minha Conta</a>
          <a href="carrinho.html" class="small">
            Carrinho <span id="cart-badge" class="badge">0</span>
          </a>
        </div>
      `;

  el.innerHTML = `
    <header class="site">
      <div class="header-inner">
        <a class="brand" href="index.html">
          Blink<span>Games</span>
        </a>
        <nav class="nav">
          ${LINKS.map(
            (l) =>
              `<a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">
                ${l.label}
              </a>`
          ).join('')}
          ${right}
        </nav>
      </div>
    </header>
  `;

  // ============================================================
  // 🚪 Logout
  // ============================================================
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearAuth();
      mountHeader(); // 🔄 Recarrega o header após logout
    });
  }

  // ============================================================
  // 🧩 Badge
  // ============================================================
  updateBadge();
}

// ============================================================
// 🚀 Garante que o header é montado em TODAS as páginas
// ============================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountHeader);
} else {
  mountHeader();
}

