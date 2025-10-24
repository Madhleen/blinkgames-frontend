// BlinkGames — app.js
// Controla o cabeçalho, menu mobile, badge do carrinho e animações básicas

import { DEBUG } from './config.js';

// ===== MENU MOBILE =====
const menuBtn = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Fecha menu ao clicar em um link
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

// ===== CARRINHO BADGE =====
export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  try {
    const cart = JSON.parse(localStorage.getItem('blink_cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.qtd, 0);
    badge.textContent = count > 0 ? count : '0';
  } catch (err) {
    if (DEBUG) console.error('Erro ao atualizar badge:', err);
  }
}

updateCartBadge();

// ===== PAC-MAN TOGGLE =====
const toggleAnim = document.getElementById('toggle-animation');
if (toggleAnim) {
  const saved = localStorage.getItem('pacman_enabled');
  if (saved !== null) toggleAnim.checked = saved === 'true';

  toggleAnim.addEventListener('change', () => {
    localStorage.setItem('pacman_enabled', toggleAnim.checked);
    const event = new CustomEvent('pacman-toggle', { detail: toggleAnim.checked });
    window.dispatchEvent(event);
  });
}

// ===== HEADER SHADOW AO SCROLL =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (!header) return;
  header.style.boxShadow = window.scrollY > 20
    ? '0 2px 10px rgba(0, 0, 0, 0.6)'
    : 'none';
});

// ===== DEBUG =====
if (DEBUG) console.log('BlinkGames app.js inicializado');
