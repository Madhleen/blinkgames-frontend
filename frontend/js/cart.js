// ============================================================
// 🛒 BlinkGames — cart.js (v9.5 Produção Corrigido — Quantidades + Badge vivo)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { RafflesAPI, CheckoutAPI } from "./api.js";

mountHeader();

// ============================================================
// 🧩 Limpa carrinho inválido
// ============================================================
try {
  const c = JSON.parse(localStorage.getItem("blink_cart") || "[]");
  if (!Array.isArray(c)) localStorage.removeItem("blink_cart");
} catch {
  localStorage.removeItem("blink_cart");
}
updateBadge();

// ============================================================
// 🧾 Renderiza o conteúdo do carrinho
// ============================================================
function renderCart() {
  const list = document.getElementById("list");
  const empty = document.getElementById("empty");
  const totalEl = document.getElementById("total");

  const cart = getCart();

  if (!cart.length) {
    list.innerHTML = "";
    empty.style.display = "block";
    totalEl.textContent = "R$ 0,00";
    updateBadge();
    return;
  }

  empty.style.display = "none";
  list.innerHTML = cart.map((item, i) => `
    <li class="panel" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div>
        <strong>${item.title}</strong><br>
        <small>${item.numbers?.join(", ") || "Números reservados"}</small><br>
        <div style="margin-top:6px;">
          <button class="btn-qty" data-action="minus" data-index="${i}">−</button>
          <span style="margin:0 8px;">${item.quantity}</span>
          <button class="btn-qty" data-action="plus" data-index="${i}">+</button>
          <button class="btn-remove" data-index="${i}" style="margin-left:10px;">🗑️</button>
        </div>
      </div>
      <strong>${BRL(item.price * item.quantity)}</strong>
    </li>
  `).join("");

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalEl.textContent = BRL(total);

  attachEvents();
}

// ============================================================
// ⚙️ Eventos de +, − e remover
// ============================================================
function attachEvents() {
  document.querySelectorAll(".btn-qty").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      const action = btn.dataset.action;
      const cart = getCart();

      if (action === "plus") cart[index].quantity++;
      if (action === "minus" && cart[index].quantity > 1) cart[index].quantity--;

      saveCart(cart);
      updateBadge();
      renderCart();
    });
  });

  document.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.index);
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      updateBadge();
      renderCart();
    });
  });
}

// ============================================================
// 🧩 Reserva dos números antes do checkout
// ============================================================
async function ensureReservation(item, token) {
  const raffleId = item._id || item.raffleId || item.id;
  if (!raffleId) throw new Error("Item sem raffleId válido");

  let numeros = Array.isArray(item.numbers) ? item.numbers : [];

  if (!numeros.length) {
    const gen = await RafflesAPI.generate(raffleId, item.quantity || 1, token);
    numeros = gen?.numeros || gen?.numbers || [];
  }

  const res = await RafflesAPI.reserve(raffleId, numeros, token);
  const reserved = res?.numeros || res?.numbers || numeros;
  item.numbers = reserved;
  return reserved;
}

// ============================================================
// 💳 Finalizar compra
// ============================================================
document.getElementById("checkout")?.addEventListener("click", async () => {
  const token = getToken();
  const cart = getCart();

  if (!token) {
    alert("⚠️ Você precisa estar logado para finalizar a compra!");
    localStorage.setItem("redirectAfterLogin", "carrinho.html");
    window.location.href = "conta.html";
    return;
  }
  if (!cart.length) {
    alert("Seu carrinho está vazio!");
    return;
  }

  try {
    for (const item of cart) await ensureReservation(item, token);
    saveCart(cart);

    const normalizedCart = cart.map((item) => ({
      raffleId: item._id || item.raffleId || item.id,
      title: item.title || "Rifa BlinkGames",
      price: Number(item.price) || 1,
      quantity: Number(item.quantity) || 1,
      numeros: item.numbers || [],
    }));

    const result = await CheckoutAPI.create({ cart: normalizedCart }, token);
    if (result?.init_point) {
      localStorage.setItem("checkoutCache", JSON.stringify(cart));
      window.location.href = result.init_point;
    } else {
      alert("Erro ao criar checkout.");
    }
  } catch (err) {
    console.error("❌ Erro no checkout/reserva:", err);
    const msg = String(err?.message || "").toLowerCase();
    if (msg.includes("unauthorized") || msg.includes("token")) {
      alert("Sessão expirada. Faça login novamente.");
      localStorage.clear();
      window.location.href = "conta.html";
      return;
    }
    alert(err.message || "Erro ao reservar/criar checkout.");
  }
});

// ============================================================
// 🚀 Inicializa
// ============================================================
document.addEventListener("DOMContentLoaded", renderCart);

