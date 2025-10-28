// ============================================================
// 🎮 BlinkGames — header.js (v5.3)
// ============================================================

import { updateBadge, getToken, getUser, clearAuth, updateUserHeader } from './state.js';

const LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'rifas.html', label: 'Rifas' },
  { href: 'vencedores.html', label: 'Vencedores' },
  { href: 'termos.html', label: 'Termos' },
  { href: 'sobre.html', label: 'Sobre' }
];

// Verifica se a página atual é a ativa
function isActive(href) {
  const current = location.pathname.split('/').pop() || 'index.html';
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

  // Nav à direita (dinâmico)
  const right = logged
    ? `
        <div id="header-user" class="user-area">
          <span>Olá, <strong>${nome.split(' ')[0]}</strong>!</span>
          <a href="minhas-rifas.html" class="small">Minhas Rifas</a>
          <a href="carrinho.html" class="small">Carrinho <span id="cart-badge" class="badge">0</span></a>
          <button id="logout" class="btn small">Sair</button>
        </div>
      `
    : `
        <div id="header-auth" class="auth-area">
          <a href="conta.html" class="small">Minha Conta</a>
          <a href="carrinho.html" class="small">Carrinho <span id="cart-badge" class="badge">0</span></a>
        </div>
      `;

  // Monta HTML
  el.innerHTML = `
    <header class="site">
      <div class="header-inner">
        <a class="brand" href="index.html">Blink<span>Games</span></a>
        <nav class="nav">
          ${LINKS.map(
            (l) =>
              `<a href="${l.href}" class="${isActive(l.href) ? 'active' : ''}">${l.label}</a>`
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
      updateUserHeader(); // Atualiza header sem reload
    });
  }

  updateBadge();
}

