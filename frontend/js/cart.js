// ============================================================
// 🛒 BlinkGames — cart.js (v2.0 com controle de quantidade)
// ============================================================

import { mountHeader } from './header.js';
import { BRL, getCart, saveCart, updateBadge, getToken } from './state.js';
import { CheckoutAPI } from './api.js';

mountHeader();

const list = document.getElementById('list');
const empty = document.getElementById('empty');
const totalEl = document.getElementById('total');

// ============================================================
// 🔁 Renderiza carrinho
// ============================================================
function render() {
  const cart = getCart();
  list.innerHTML = '';

  if (cart.length === 0) {
    empty.style.display = 'block';
    totalEl.textContent = BRL(0);
    return;
  }

  empty.style.display = 'none';
  let total = 0;

  cart.forEach((item, idx) => {
    const sub = (item.price || 0) * (item.quantity || 0);
    total += sub;

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="panel" style="display:flex;gap:14px;align-items:center;margin-bottom:10px">
        <img src="${item.image || 'img/icons/placeholder.svg'}"
          style="width:70px;height:70px;object-fit:cover;border-radius:12px;border:1px solid rgba(255,0,200,.22)">
        
        <div style="flex:1">
          <strong>${item.title}</strong>
          <div style="margin:4px 0;">
            <button class="btn small" data-dec="${idx}">−</button>
            <span style="margin:0 8px;">${item.quantity}</span>
            <button class="btn small" data-inc="${idx}">+</button>
          </div>
          <div>${item.quantity}x — R$ ${BRL(sub)}</div>
          <small>Números: ${(item.numbers || []).slice(0, 8).join(', ')}${(item.numbers || []).length > 8 ? '…' : ''}</small>
        </div>

        <button class="btn" data-remove="${idx}">Remover</button>
      </div>
    `;

    list.appendChild(li);
  });

  totalEl.textContent = BRL(total);
}

// ============================================================
// 🧮 Controle de ações (adicionar, remover, alterar quantidade)
// ============================================================
list.addEventListener('click', (e) => {
  const cart = getCart();
  const inc = e.target.closest('button[data-inc]');
  const dec = e.target.closest('button[data-dec]');
  const remove = e.target.closest('button[data-remove]');

  if (inc) {
    const idx = Number(inc.dataset.inc);
    cart[idx].quantity++;
    saveCart(cart);
    updateBadge();
    render();
  }

  if (dec) {
    const idx = Number(dec.dataset.dec);
    if (cart[idx].quantity > 1) {
      cart[idx].quantity--;
    } else {
      cart.splice(idx, 1); // remove se zerar
    }
    saveCart(cart);
    updateBadge();
    render();
  }

  if (remove) {
    const idx = Number(remove.dataset.remove);
    cart.splice(idx, 1);
    saveCart(cart);
    updateBadge();
    render();
  }
});

// ============================================================
// 💳 Finalizar compra
// ============================================================
document.getElementById('checkout')?.addEventListener('click', async () => {
  const token = getToken();
  try {
    await CheckoutAPI.create(getCart(), token);
    alert('Pedido criado com sucesso!');
    localStorage.removeItem('blink_cart');
    updateBadge();
    location.href = 'minhas-rifas.html';
  } catch (err) {
    alert(err.message || 'Falha no checkout');
  }
});

// Inicializa
render();

