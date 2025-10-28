// ============================================================
// 🎮 BlinkGames — rifa.js (v3.0 corrigido)
// ============================================================

import { mountHeader } from './header.js';
import { RafflesAPI } from './api.js';
import { BRL, getCart, saveCart, updateBadge } from './state.js';

// Monta cabeçalho
mountHeader();

// Seletores principais
const id = new URLSearchParams(location.search).get('id');
const img = document.getElementById('raffle-img');
const titleEl = document.getElementById('raffle-title');
const descEl = document.getElementById('raffle-desc');
const priceEl = document.getElementById('raffle-price');
const dateEl = document.getElementById('raffle-date');
const qtyInput = document.getElementById('qty');
const addBtn = document.getElementById('add');

let raffle = null;

// ============================================================
// 🔄 Carrega os dados da rifa
// ============================================================
async function load() {
  try {
    raffle = await RafflesAPI.byId(id);

    img.src = raffle.imagem || raffle.image || 'img/icons/placeholder.svg';
    img.alt = raffle.titulo || raffle.title || 'Rifa BlinkGames';

    titleEl.textContent = raffle.titulo || raffle.title;
    descEl.textContent = raffle.descricao || raffle.description || 'Sem descrição disponível.';
    priceEl.textContent = BRL(raffle.preco || raffle.price);

    // Formata data para padrão BR (DD/MM/AAAA)
    const rawDate = raffle.dataSorteio || raffle.drawDate || '2025-12-31T23:59:00.000Z';
    const dataFormatada = new Date(rawDate).toLocaleDateString('pt-BR');
    dateEl.textContent = dataFormatada;
  } catch (e) {
    console.error('Erro ao carregar rifa:', e);
    titleEl.textContent = 'Rifa não encontrada';
  }
}
load();

// ============================================================
// 🛒 Adicionar ao carrinho com quantidade real
// ============================================================
addBtn?.addEventListener('click', async () => {
  if (!raffle) return alert('Erro: rifa não carregada.');

  const quantidade = Math.max(1, parseInt(qtyInput.value) || 1);

  let numbers = [];
  let reservationId = null;
  let expiresAt = null;

  try {
    // Reserva múltiplos números conforme a quantidade
    const res = await RafflesAPI.reserve(id, quantidade, null);
    numbers = res?.numbers || [];
    reservationId = res?.reservationId || null;
    expiresAt = res?.expiresAt || null;
  } catch {
    // Fallback local se o backend falhar
    numbers = Array.from({ length: quantidade }, () =>
      String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    );
  }

  const cart = getCart();
  const existing = cart.find((i) => i._id === id);

  if (existing) {
    existing.quantity += quantidade;
    existing.numbers.push(...numbers);
  } else {
    cart.push({
      _id: id,
      title: raffle.titulo || raffle.title,
      price: raffle.preco || raffle.price,
      image: raffle.imagem || raffle.image,
      quantity: quantidade,
      numbers,
      reservationId,
      expiresAt,
    });
  }

  saveCart(cart);
  updateBadge();

  alert(`🎟️ ${quantidade} número(s) reservado(s) e adicionado(s) ao carrinho!`);
});

