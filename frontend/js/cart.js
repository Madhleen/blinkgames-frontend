// ============================================================
// 🛒 BlinkGames — cart.js (v9.7 Produção — Reserva + Botões + Badge)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { RafflesAPI, CheckoutAPI } from "./api.js";

// Monta header e garante badge visível
mountHeader();
updateBadge();

// ⚡ Estilo mínimo (só uma vez)
(function injectCartStyles() {
  if (document.getElementById("cart-inline-styles")) return;
  const css = `
    .qty-wrap{display:flex;align-items:center;gap:8px;margin-top:6px}
    .qty-btn{
      border:0; outline:0; cursor:pointer; width:30px; height:30px;
      border-radius:8px; background:#1f0b35; color:#fff; font-size:16px;
      box-shadow:0 0 10px rgba(255,0,200,.15);
      transition:transform .08s ease, box-shadow .15s ease;
    }
    .qty-btn:hover{ transform:scale(1.04); box-shadow:0 0 14px rgba(0,224,255,.25) }
    .remove-btn{
      border:0; outline:0; cursor:pointer; padding:6px 10px;
      border-radius:8px; background:#2a0a1f; color:#fff; margin-left:6px;
      box-shadow:0 0 10px rgba(255,0,0,.15);
    }
    .remove-btn:hover{ box-shadow:0 0 14px rgba(255,0,0,.35) }
  `;
  const style = document.createElement("style");
  style.id = "cart-inline-styles";
  style.textContent = css;
  document.head.appendChild(style);
})();

// ============================================================
// 🧹 Sanitiza carrinho quebrado (evita itens não-array / NaN etc.)
// ============================================================
try {
  const raw = localStorage.getItem("blink_cart");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("bad cart");
    // normaliza campos essenciais
    const normalized = parsed.map((it) => ({
      title: it.title || "Rifa BlinkGames",
      price: Number(it.price) || 1,
      quantity: Math.max(1, Number(it.quantity) || 1),
      numbers: Array.isArray(it.numbers) ? it.numbers : [],
      _id: it._id || it.raffleId || it.id,
      raffleId: it.raffleId || it._id || it.id,
      id: it.id || it._id || it.raffleId,
    }));
    localStorage.setItem("blink_cart", JSON.stringify(normalized));
  }
} catch {
  localStorage.removeItem("blink_cart");
}
updateBadge();

// ============================================================
// 🔐 Reserva de números (gera se necessário)
// ============================================================
async function ensureReservation(item, token) {
  const raffleId = item._id || item.raffleId || item.id;
  if (!raffleId) throw new Error("Item sem raffleId válido");

  let numeros = Array.isArray(item.numbers) ? item.numbers : [];

  // Não tem números ainda? Gera conforme a quantidade atual
  if (!numeros.length) {
    const gen = await RafflesAPI.generate(raffleId, item.quantity || 1, token);
    numeros = gen?.numeros || gen?.numbers || [];
  }

  // Reserva os números gerados/atuais
  const res = await RafflesAPI.reserve(raffleId, numeros, token);
  const reserved = res?.numeros || res?.numbers || numeros;

  // Persiste no item
  item.numbers = reserved;
  return reserved;
}

// ============================================================
// 🧾 Renderiza o carrinho
// ============================================================
function renderCart() {
  const list = document.getElementById("list");
  const empty = document.getElementById("empty");
  const totalEl = document.getElementById("total");

  const cart = getCart();

  if (!cart || cart.length === 0) {
    if (list) list.innerHTML = "";
    if (empty) empty.style.display = "block";
    if (totalEl) totalEl.textContent = "R$ 0,00";
    updateBadge();
    return;
  }

  if (empty) empty.style.display = "none";

  if (list) {
    list.innerHTML = cart
      .map(
        (item, i) => `
      <li class="panel" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <div>
          <strong>${item.title}</strong><br>
          <small>${(item.numbers && item.numbers.length)
            ? item.numbers.join(", ")
            : "Números reservados serão gerados no checkout"}</small>
          <div class="qty-wrap">
            <button class="qty-btn" data-action="dec" data-index="${i}" aria-label="Diminuir">−</button>
            <span id="qty-${i}" style="min-width:24px;text-align:center">${item.quantity}</span>
            <button class="qty-btn" data-action="inc" data-index="${i}" aria-label="Aumentar">+</button>
            <button class="remove-btn" data-index="${i}" aria-label="Remover">🗑️</button>
          </div>
        </div>
        <strong>${BRL((Number(item.price)||1) * (Number(item.quantity)||1))}</strong>
      </li>`
      )
      .join("");
  }

  // Total
  const total = cart.reduce(
    (sum, it) => sum + (Number(it.price) || 1) * (Number(it.quantity) || 1),
    0
  );
  if (totalEl) totalEl.textContent = BRL(total);

  // Eventos: + / −
  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      const action = e.currentTarget.dataset.action;
      const items = getCart();

      if (!items[idx]) return;

      const current = Number(items[idx].quantity) || 1;

      if (action === "inc") items[idx].quantity = current + 1;
      if (action === "dec") items[idx].quantity = Math.max(1, current - 1);

      saveCart(items);      // persiste
      updateBadge();        // atualiza badge do header
      renderCart();         // re-render
    });
  });

  // Evento: remover
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      const items = getCart();
      if (!items[idx]) return;
      items.splice(idx, 1);
      saveCart(items);
      updateBadge();
      renderCart();
    });
  });

  // Garante badge coerente toda vez que renderiza
  updateBadge();
}

// Render inicial
document.addEventListener("DOMContentLoaded", renderCart);

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
    // Reserva (gera se faltar)
    for (const item of cart) {
      await ensureReservation(item, token);
    }

    // Persiste e atualiza UI
    saveCart(cart);
    updateBadge();

    // Payload normalizado
    const normalizedCart = cart.map((item) => ({
      raffleId: item._id || item.raffleId || item.id,
      title: item.title || "Rifa BlinkGames",
      price: Number(item.price) || 1,
      quantity: Math.max(1, Number(item.quantity) || 1),
      numeros: Array.isArray(item.numbers) ? item.numbers : [],
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
      localStorage.clear(); // limpa para evitar estado travado
      window.location.href = "conta.html";
      return;
    }

    alert(err.message || "Erro ao reservar/criar checkout.");
  }
});

