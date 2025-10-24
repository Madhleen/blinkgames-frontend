// BlinkGames — raffle-detail.js
// Página de detalhe da rifa, gera números e adiciona ao carrinho

import { RafflesAPI } from './api.js';
import { updateCartBadge } from './app.js';

// ===== Utilitários =====
function getCart() {
  return JSON.parse(localStorage.getItem('blink_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('blink_cart', JSON.stringify(cart));
  updateCartBadge();
}

// ===== Pega o ID da rifa =====
const params = new URLSearchParams(window.location.search);
const raffleId = params.get('id');

const raffleContainer = document.getElementById('raffle-detail');
const template = document.getElementById('raffle-template');
let raffleData = null;

// ===== Busca a rifa no backend =====
async function loadRaffle() {
  if (!raffleId) {
    raffleContainer.innerHTML = `<p>Rifa não encontrada.</p>`;
    return;
  }

  raffleContainer.innerHTML = `<p>Carregando...</p>`;
  const res = await RafflesAPI.getById(raffleId);

  if (!res || res.error) {
    raffleContainer.innerHTML = `<p>Erro ao carregar rifa.</p>`;
    return;
  }

  raffleData = res;

  const clone = template.content.cloneNode(true);
  clone.getElementById('raffle-img').src = res.imagem;
  clone.getElementById('raffle-title').textContent = res.titulo;
  clone.getElementById('raffle-desc').textContent = res.descricao;
  clone.getElementById('raffle-price').textContent = res.preco.toFixed(2);
  clone.getElementById('raffle-date').textContent = new Date(res.dataSorteio).toLocaleDateString('pt-BR');

  raffleContainer.innerHTML = '';
  raffleContainer.appendChild(clone);
}

loadRaffle();

// ===== Geração de números fictícios (simulação da reserva) =====
const numbersPreview = document.getElementById('numbers-preview');
const previewList = document.getElementById('preview-list');
let selectedNumbers = [];

function generateNumbers(qtd) {
  selectedNumbers = [];
  for (let i = 0; i < qtd; i++) {
    const num = Math.floor(Math.random() * 10000); // simulação local
    selectedNumbers.push(num);
  }

  previewList.innerHTML = selectedNumbers.map(n => `<span class="num">${n}</span>`).join('');
  numbersPreview.hidden = false;
}

// ===== Controles de quantidade =====
document.querySelectorAll('.qty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const qtd = parseInt(btn.dataset.add);
    generateNumbers(qtd);
  });
});

const customInput = document.getElementById('custom-qty');
if (customInput) {
  customInput.addEventListener('input', () => {
    const qtd = parseInt(customInput.value);
    if (qtd > 0) generateNumbers(qtd);
  });
}

// ===== Adicionar ao carrinho =====
const addBtn = document.getElementById('add-to-cart');
if (addBtn) {
  addBtn.addEventListener('click', () => {
    if (!raffleData) {
      alert('Rifa não carregada.');
      return;
    }

    if (selectedNumbers.length === 0) {
      alert('Escolha uma quantidade de números primeiro.');
      return;
    }

    const cart = getCart();
    const existing = cart.find(item => item.raffleId === raffleData._id);

    if (existing) {
      existing.qtd += selectedNumbers.length;
      existing.numeros.push(...selectedNumbers);
    } else {
      cart.push({
        raffleId: raffleData._id,
        titulo: raffleData.titulo,
        preco: raffleData.preco,
        qtd: selectedNumbers.length,
        numeros: selectedNumbers,
      });
    }

    saveCart(cart);
    alert(`Adicionado ${selectedNumbers.length} número(s) ao carrinho!`);
  });
}

updateCartBadge();
