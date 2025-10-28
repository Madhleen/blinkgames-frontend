// ============================================================
// 🎮 BlinkGames — home.js (v5.4 aprimorado com PS5 em primeiro)
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

    // 🥇 Coloca o PS5 no topo, sem alterar o resto da ordem
    const ps5 = cache.filter(
      (r) =>
        (r.titulo || r.title || '').toLowerCase().includes('ps5')
    );
    const others = cache.filter(
      (r) =>
        !(r.titulo || r.title || '').toLowerCase().includes('ps5')
    );
    const ordered = [...ps5, ...others];

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
                Comprar agora
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

// Carrega rifas ao iniciar
load();

// ============================================================
// 🛒 Adiciona rifa ao carrinho (gera número automaticamente)
// ============================================================
grid?.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn) return;

  const id = btn.dataset.id;
  let numbers = [];
  let reservationId = null;
  let expiresAt = null;

  try {
    const res = await RafflesAPI.reserve(id, 1, null);
    numbers = res?.numbers || [];
    reservationId = res?.reservationId || null;
    expiresAt = res?.expiresAt || null;
  } catch {
    numbers = [String(Math.floor(Math.random() * 10000)).padStart(4, '0')];
  }

  const r = cache.find((x) => String(x._id) === String(id));
  if (!r) return alert('Erro ao encontrar a rifa.');

  const cart = getCart();
  const existing = cart.find((i) => i._id === id);

  if (existing) {
    existing.quantity += 1;
    existing.numbers.push(...numbers);
  } else {
    cart.push({
      _id: id,
      title: r.titulo || r.title,
      price: r.preco || r.price,
      image: r.imagem || r.image,
      quantity: 1,
      numbers,
      reservationId,
      expiresAt,
    });
  }

  saveCart(cart);
  updateBadge();

  alert(
    `🎟️ Número ${numbers.join(', ')} reservado e adicionado ao carrinho!\nVocê tem 10 minutos para concluir o pagamento.`
  );
});

