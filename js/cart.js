// BlinkGames — cart.js
// Gerencia o carrinho, reservas e integração com o checkout Mercado Pago

import { CheckoutAPI } from './api.js';
import { updateCartBadge } from './app.js';
import { BACKEND } from './config.js';

// ===== Utilidades =====
function getCart() {
  return JSON.parse(localStorage.getItem('blink_cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('blink_cart', JSON.stringify(cart));
  updateCartBadge();
}

// ===== Renderização =====
const cartList = document.getElementById('cart-list');
const cartEmpty = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const cartTotalEl = document.getElementById('cart-total');

function renderCart() {
  if (!cartList) return;
  const cart = getCart();
  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.hidden = false;
    cartSummary.hidden = true;
    return;
  }

  cartEmpty.hidden = true;
  cartSummary.hidden = false;

  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <h3>${item.titulo}</h3>
      <p><strong>Quantidade:</strong> ${item.qtd}</p>
      <p><strong>Preço unitário:</strong> R$ ${item.preco.toFixed(2)}</p>
      <p><strong>Subtotal:</strong> R$ ${(item.qtd * item.preco).toFixed(2)}</p>
      <button class="btn-secondary remove-item" data-index="${index}">Remover</button>
    `;
    cartList.appendChild(div);
    total += item.qtd * item.preco;
  });

  cartTotalEl.textContent = total.toFixed(2);

  document.querySelectorAll('.remove-item').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.target.dataset.index);
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });
}

renderCart();

// ===== Checkout =====
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('blink_token');
    if (!token) {
      alert('Você precisa estar logado para finalizar a compra.');
      window.location.href = '/conta.html';
      return;
    }

    const cart = getCart();
    if (cart.length === 0) {
      alert('Carrinho vazio.');
      return;
    }

    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processando...';

    const res = await CheckoutAPI.create(cart, token);

    if (res && res.init_point) {
      saveCart([]); // limpa o carrinho local
      window.location.href = res.init_point; // redireciona pro checkout do Mercado Pago
    } else {
      alert('Erro ao iniciar o pagamento. Tente novamente.');
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = 'Pagar agora';
    }
  });
}
