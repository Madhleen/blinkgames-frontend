// ============================================================
// 🛒 BlinkGames — cart.js (v10.0 Final — Checkout Corrigido + Neon UI)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { RafflesAPI, CheckoutAPI } from "./api.js";

// ============================================================
// 🚀 Monta header e garante badge visível
// ============================================================
mountHeader();
updateBadge();

// ============================================================
// 🎨 Estilo inline — botões estilizados neon
// ============================================================
(function injectCartStyles() {
  if (document.getElementById("cart-inline-styles")) return;
  const css = `
    .qty-wrap{display:flex;align-items:center;gap:8px;margin-top:6px}
    .qty-btn{
      border:0; outline:0; cursor:pointer; width:34px; height:34px;
      border-radius:10px; background:linear-gradient(135deg,#ff00c8,#00e0ff);
      color:#fff; font-size:18px; font-weight:bold;
      box-shadow:0 0 10px rgba(255,0,200,.3);
      transition:transform .08s ease, box-shadow .15s ease;
    }
    .qty-btn:hover{ transform:scale(1.05); box-shadow:0 0 18px rgba(0,224,255,.4) }
    .remove-btn{
      border:0; outline:0; cursor:pointer; padding:7px 12px;
      border-radius:8px; background:#320015; color:#fff; font-size:14px;
      margin-left:6px; transition:0.2s; box-shadow:0 0 10px rgba(255,0,0,.25);
    }
    .remove-btn:hover{ background:#ff0033; box-shadow:0 0 16px rgba(255,0,0,.5) }
  `;
  const style = document.createElement("style");
  style.id = "cart-inline-styles";
  style.textContent = css;
  document.head.appendChild(style);
})();

// ============================================================
// 🧹 Sanitiza carrinho (garante consistência dos itens)
// ============================================================
try {
  const raw = localStorage.getItem("blink_cart");
  if (raw) {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("bad cart");
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
// 🔐 Reserva dinâmica de números
// ============================================================
async function ensureReservation(item, token) {
  const raffleId = item._id || item.raffleId || item.id;
  if (!raffleId) throw new Error("Item sem raffleId válido");

  let numerosAtuais = Array.isArray(item.numbers) ? item.numbers : [];
  const qtdDesejada = item.quantity || 1;

  console.log(`🎲 Atualizando reserva da rifa ${raffleId}: ${numerosAtuais.length} → ${qtdDesejada}`);

  if (numerosAtuais.length < qtdDesejada) {
    const faltando = qtdDesejada - numerosAtuais.length;
    const gen = await RafflesAPI.generate(raffleId, faltando, token);
    const novos = gen?.numeros || gen?.numbers || [];
    numerosAtuais.push(...novos);
  }

  if (numerosAtuais.length > qtdDesejada) {
    numerosAtuais = numerosAtuais.slice(0, qtdDesejada);
  }

  const res = await RafflesAPI.reserve(raffleId, numerosAtuais, token);
  const reserved = res?.numeros || res?.numbers || numerosAtuais;

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
          <small style="color:#aaa;">${
            item.numbers?.length
              ? item.numbers.join(", ")
              : "Números reservados serão gerados"
          }</small>
          <div class="qty-wrap">
            <button class="qty-btn" data-action="dec" data-index="${i}">−</button>
            <span id="qty-${i}" style="min-width:28px;text-align:center">${item.quantity}</span>
            <button class="qty-btn" data-action="inc" data-index="${i}">+</button>
            <button class="remove-btn" data-index="${i}">🗑️</button>
          </div>
        </div>
        <strong>${BRL((Number(item.price)||1) * (Number(item.quantity)||1))}</strong>
      </li>`
      )
      .join("");
  }

  const total = cart.reduce(
    (sum, it) => sum + (Number(it.price) || 1) * (Number(it.quantity) || 1),
    0
  );
  if (totalEl) totalEl.textContent = BRL(total);

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idx = Number(e.currentTarget.dataset.index);
      const action = e.currentTarget.dataset.action;
      const items = getCart();
      if (!items[idx]) return;

      const current = Number(items[idx].quantity) || 1;
      const newQty = action === "inc" ? current + 1 : Math.max(1, current - 1);
      items[idx].quantity = newQty;

      const token = getToken();
      if (token) await ensureReservation(items[idx], token);

      saveCart(items);
      updateBadge();
      renderCart();
    });
  });

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

  updateBadge();
}

document.addEventListener("DOMContentLoaded", renderCart);

// ============================================================
// 💳 Finalizar compra (compatível com orderController v8.6)
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
    updateBadge();

    const normalizedCart = cart.map((item) => ({
      raffleId: item._id || item.raffleId || item.id,
      title: item.title || "Rifa BlinkGames",
      price: Number(item.price) || 1,
      quantity: Math.max(1, Number(item.quantity) || 1),
      numeros: Array.isArray(item.numbers) ? item.numbers : [],
    }));

    const result = await CheckoutAPI.create({ cart: normalizedCart }, token);
    console.log("🧾 Retorno do backend:", result);

    // 🔁 Corrigido para resposta do backend v8.6 (init_point + preference_id)
    const initPoint =
      result?.init_point ||
      result?.body?.init_point ||
      result?.sandbox_init_point ||
      result?.preference?.init_point ||
      result?.initPoint ||
      null;

    const prefId =
      result?.preference_id ||
      result?.id ||
      result?.body?.id ||
      null;

    if (initPoint) {
      console.log("✅ Checkout pronto:", { prefId, initPoint });
      localStorage.setItem("checkoutCache", JSON.stringify(cart));
      window.location.href = initPoint;
    } else {
      console.error("❌ Checkout inválido:", result);
      alert("Erro ao criar checkout. O servidor não retornou o link de pagamento.");
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

