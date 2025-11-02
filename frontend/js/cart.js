// ============================================================
// 🛒 BlinkGames — cart.js (v6.7 — compatível com backend + webhook)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { CheckoutAPI } from "./api.js";

mountHeader();

const list = document.getElementById("list");
const empty = document.getElementById("empty");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout");

// ============================================================
// 🔢 Gera e sincroniza números do carrinho
// ============================================================
function genNumber() {
  return String(Math.floor(Math.random() * 10000)).padStart(4, "0");
}

function syncNumbers(item) {
  if (!Array.isArray(item.numbers)) item.numbers = [];
  const qtd = Number(item.quantity || 0);
  while (item.numbers.length < qtd) {
    let n;
    do n = genNumber(); while (item.numbers.includes(n));
    item.numbers.push(n);
  }
  while (item.numbers.length > qtd) item.numbers.pop();
}

// ============================================================
// 🔁 Renderiza carrinho
// ============================================================
function render() {
  const cart = getCart();
  list.innerHTML = "";

  if (!cart || cart.length === 0) {
    empty.style.display = "block";
    totalEl.textContent = BRL(0);
    updateBadge();
    return;
  }

  empty.style.display = "none";
  let total = 0;

  cart.forEach((item, idx) => {
    syncNumbers(item);

    const price = Number(item.price || 0);
    const quantity = Number(item.quantity || 0);
    const sub = price * quantity;
    total += sub;

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="panel" style="display:flex;gap:14px;align-items:center;margin-bottom:10px">
        <img src="${item.image || "img/icons/placeholder.svg"}"
          style="width:70px;height:70px;object-fit:cover;border-radius:12px;border:1px solid rgba(255,0,200,.22)">
        <div style="flex:1">
          <strong>${item.title}</strong>
          <div style="margin:4px 0;">
            <button class="btn small" data-dec="${idx}">−</button>
            <span style="margin:0 8px;">${quantity}</span>
            <button class="btn small" data-inc="${idx}">+</button>
          </div>
          <div>${quantity}x — ${BRL(sub)}</div>
          <small>Números: ${(item.numbers || []).join(", ")}</small>
        </div>
        <button class="btn" data-remove="${idx}">Remover</button>
      </div>
    `;

    list.appendChild(li);
  });

  saveCart(cart);
  updateBadge();
  totalEl.textContent = BRL(total);
}

// ============================================================
// 💳 Finalizar compra — compatível com backend e webhook
// ============================================================
checkoutBtn?.addEventListener("click", async () => {
  const token = getToken();

  if (!token) {
    alert("⚠️ Você precisa estar logado para finalizar a compra!");
    localStorage.setItem("redirectAfterLogin", "carrinho.html");
    window.location.href = "conta.html";
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    alert("Seu carrinho está vazio!");
    return;
  }

  const normalizedCart = cart.map((item) => ({
    raffleId: item._id || item.raffleId || item.id,
    title: item.title || "Rifa BlinkGames",
    price: Number(item.price) || 1,
    quantity: Number(item.quantity) || 1,
    numeros: item.numbers || [],
    precoUnit: Number(item.price) || 1,
  }));

  try {
    console.log("🧾 Enviando carrinho ao backend:", normalizedCart);
    const result = await CheckoutAPI.create({ cart: normalizedCart }, token);
    console.log("💳 Resposta do backend:", result);

    if (result?.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    } else {
      alert("Erro inesperado ao criar checkout.");
    }
  } catch (err) {
    console.error("❌ Erro no checkout:", err);
    alert(err.message || "Erro ao criar checkout");
  }
});

// ============================================================
// 🚀 Inicializa o carrinho
// ============================================================
render();

