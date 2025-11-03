// ============================================================
// 🛒 BlinkGames — cart.js (v7.0 Estável — fluxo sincronizado com pagamento)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { CheckoutAPI } from "./api.js";

mountHeader();

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
// 🔁 Renderiza carrinho (corrigido e otimizado)
// ============================================================
function render() {
  const cart = getCart();
  const list = document.getElementById("list");
  const empty = document.getElementById("empty");
  const totalEl = document.getElementById("total");

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
    li.className = "panel";
    li.innerHTML = `
      <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:10px;">
        <img src="${item.image || "img/icons/placeholder.svg"}"
          style="width:70px;height:70px;object-fit:cover;border-radius:12px;border:1px solid rgba(255,0,200,.22)">
        <div style="flex:1;min-width:180px;">
          <strong>${item.title}</strong>
          <div style="margin:4px 0;">
            <button class="btn small dec" data-index="${idx}">−</button>
            <span style="margin:0 8px;">${quantity}</span>
            <button class="btn small inc" data-index="${idx}">+</button>
          </div>
          <div>${quantity}x — ${BRL(sub)}</div>
          <small>Números: ${(item.numbers || []).slice(0, 8).join(", ")}${(item.numbers || []).length > 8 ? "…" : ""}</small>
        </div>
        <button class="btn remove" data-index="${idx}">Remover</button>
      </div>
    `;

    list.appendChild(li);
  });

  saveCart(cart);
  updateBadge();
  totalEl.textContent = BRL(total);

  attachEvents();
}

// ============================================================
// 🧮 Eventos locais corrigidos
// ============================================================
function attachEvents() {
  document.querySelectorAll(".inc").forEach((btn) =>
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      const cart = getCart();
      cart[idx].quantity++;
      saveCart(cart);
      render();
    })
  );

  document.querySelectorAll(".dec").forEach((btn) =>
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      const cart = getCart();
      if (cart[idx].quantity > 1) cart[idx].quantity--;
      else cart.splice(idx, 1);
      saveCart(cart);
      render();
    })
  );

  document.querySelectorAll(".remove").forEach((btn) =>
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.index);
      const cart = getCart();
      cart.splice(idx, 1);
      saveCart(cart);
      render();
    })
  );
}

// ============================================================
// 💳 Finalizar compra
// ============================================================
document.getElementById("checkout")?.addEventListener("click", async () => {
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
    console.log("🧾 Enviando carrinho:", normalizedCart);
    const result = await CheckoutAPI.create({ cart: normalizedCart }, token);
    console.log("💳 Resposta:", result);

    if (result?.checkoutUrl) {
      // 💥 Salva backup temporário para evitar inconsistência
      localStorage.setItem("checkoutCache", JSON.stringify(cart));
      window.location.href = result.checkoutUrl;
    } else {
      alert("Erro ao criar checkout.");
    }
  } catch (err) {
    console.error("❌ Erro no checkout:", err);
    alert(err.message || "Erro ao criar checkout");
  }
});

// ============================================================
// 🚀 Inicializa
// ============================================================
render();

