// ============================================================
// 🛒 BlinkGames — cart.js (v4.0 FINAL)
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
// 🔁 Renderiza carrinho
// ============================================================
function render() {
  const cart = getCart();
  list.innerHTML = "";

  if (cart.length === 0) {
    empty.style.display = "block";
    totalEl.textContent = BRL(0);
    return;
  }

  empty.style.display = "none";
  let total = 0;

  cart.forEach((item, idx) => {
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
          <small>Números: ${(item.numbers || [])
            .slice(0, 8)
            .join(", ")}${(item.numbers || []).length > 8 ? "…" : ""}</small>
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
list.addEventListener("click", (e) => {
  const cart = getCart();
  const inc = e.target.closest("button[data-inc]");
  const dec = e.target.closest("button[data-dec]");
  const remove = e.target.closest("button[data-remove]");

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
      cart.splice(idx, 1);
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
checkoutBtn?.addEventListener("click", async () => {
  const token = getToken();

  // 🔒 Exige login antes de prosseguir
  if (!token) {
    alert("⚠️ Você precisa estar logado para finalizar a compra!");
    window.location.href = "login.html";
    return;
  }

  const cart = getCart();
  if (!cart.length) {
    alert("Seu carrinho está vazio!");
    return;
  }

  // 🧩 Normaliza o formato para o backend
  const normalizedCart = cart.map((item) => ({
    raffleId: item._id || item.raffleId || item.id,
    qtd: item.quantity || 1,
  }));

  console.log("🧾 Enviando carrinho normalizado:", normalizedCart);

  try {
    const result = await CheckoutAPI.create(normalizedCart, token);

    if (result?.init_point) {
      // ✅ Redireciona para o checkout do Mercado Pago
      window.location.href = result.init_point;
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

