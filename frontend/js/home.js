// ============================================================
// 🎮 BlinkGames — home.js (v5.5 final: PS5 primeiro + adicionar ao carrinho)
// ============================================================

import { mountHeader } from './header.js';
import { RafflesAPI } from './api.js';
import { BRL, getCart, saveCart, updateBadge } from './state.js';

// Monta o cabeçalho
mountHeader();

const grid = document.getElementById('featured');
let cache = [];

// ============================================================
// 🔄 Carrega rifas do backend (PS5 primeiro + fallback)
// ============================================================
async function load() {
  try {
    cache = await RafflesAPI.list();
    if (!Array.isArray(cache) || cache.length === 0)
      throw new Error('Sem rifas ativas.');

    // 🥇 PS5 primeiro
    const ps5 = cache.filter((r) =>
      (r.titulo || r.title || '').toLowerCase().includes('ps5')
    );
    const others = cache.filter(
      (r) =>
        !(r.titulo || r.title || '').toLowerCase().includes('ps5')
    );
    const ordered = [...ps5, ...others];

    // Monta cards
    grid.innerHTML = ordered
      .slice(0, 6)
      .map(
        (r) => `
        <article class="card">
          <img src="${r.imagem || r.image || 'img/icons/placeholder.svg'}" alt="${r.titulo || r.title}">
          <div class="body">
            <h3>${r.titulo || r.title}</h3>
            <div class="price">R$ ${BRL(r.preco || r.price)}</div>
            <div class="actions">
              <a class="btn" href="rifa.html?id=${r._id}">Ver detalhes</a>
              <button class="btn btn-primary" data-id="${r._id}">
                Adicionar ao carrinho
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join('');
  } catch (e) {
    grid.innerHTML = `<p>⚠️ Erro ao carregar rifas ou nenhuma ativa.</p>`;
    console.error(e);
  }
}

// Carrega rifas
load();

// ============================================================
// 🛒 Adiciona rifa ao carrinho (acumula quantidades)
// ============================================================
grid?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;

  const id = btn.dataset.id;
  let numbers = [];
  let reservationId = null;
  let expiresAt = null;

  try {
    // 🔢 Reserva múltiplos números (3 por vez — pode mudar)
    const res = await RafflesAPI.reserve(id, 3, null);
    numbers = res?.numbers || [];
    reservationId = res?.reservationId || null;
    expiresAt = res?.expiresAt || null;
  } catch {
    // fallback: 3 números aleatórios
    numbers = Array.from({ length: 3 }, () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    );
  }

  const r = cache.find((x) => String(x._id) === String(id));
  if (!r) return alert('Erro ao encontrar a rifa.');

  const cart = getCart();
  const existing = cart.find((i) => i._id === id);

  if (existing) {
    existing.quantity += numbers.length;
    existing.numbers.push(...numbers);
  } else {
    cart.push({
      _id: id,
      title: r.titulo || r.title,
      price: r.preco || r.price,
      image: r.imagem || r.image,
      quantity: numbers.length,
      numbers,
      reservationId,
      expiresAt,
    });
  }

  saveCart(cart);
  updateBadge();

  alert(
    `🛒 ${numbers.length} número(s) adicionado(s) ao carrinho!\nFinalize sua compra antes que expire a reserva.`
  );
});

