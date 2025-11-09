// ============================================================
// 🛒 BlinkGames — cart.js (v9.3 Produção Final — Render + Reserva + JWT)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { RafflesAPI, CheckoutAPI } from "./api.js";

mountHeader();

// ============================================================
// 🧩 Garante que o carrinho inválido seja limpo automaticamente
// ============================================================
try {
  const c = JSON.parse(localStorage.getItem("blink_cart") || "[]");
  if (!Array.isArray(c)) localStorage.removeItem("blink_cart");
} catch {
  localStorage.removeItem("blink_cart");
}
updateBadge();

// ============================================================
// 🔐 Função para garantir reserva dos números
// ============================================================
async function ensureReservation(item, token) {
  const raffleId = item._id || item.raffleId || item.id;
  if (!raffleId) throw new Error("Item sem raffleId válido");

  let numeros = Array.isArray(item.numbers) ? item.numbers : [];

  // Se não tem números, gera
  if (!numeros.length) {
    const gen = await RafflesAPI.generate(raffleId, item.quantity || 1, token);
    numeros = gen?.numeros || gen?.numbers || [];
  }

  // Reserva os números
  const res = await RafflesAPI.reserve(raffleId, numeros, token);
  const reserved = res?.numeros || res?.numbers || numeros;
  item.numbers = reserved;

  return reserved;
}

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
    return;
  }

  empty.style.display = "none";

  list.innerHTML = cart
    .map(
      (item, i) => `
    <li class="panel" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
      <div>
        <strong>${item.title}</strong><br>
        <small>${item.numbers?.join(", ") || "Números reservados"}</small><br>
        <small>Qtd: ${item.quantity}</small>
      </div>
      <div>
        <strong>${BRL(item.price * item.quantity)}</strong><br>
        <button class="btn small" data-remove="${i}">🗑️ Remover</button>
      </div>
    </li>
  `
    )
    .join("");

  // Remove item do carrinho
  list.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.remove);
      const updated = getCart().filter((_, i) => i !== idx);
      saveCart(updated);
      renderCart();
    });
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = BRL(total);
}

// ============================================================
// 🧹 Limpar o carrinho inteiro
// ============================================================
function clearCart() {
  localStorage.removeItem("blink_cart");
  updateBadge();
  renderCart();
}

// ============================================================
// 🛍️ Finalizar compra
// ============================================================
document.getElementById("checkout")?.addEventListener("click", async () => {
  const token = getToken();
  const cart = getCart();

  console.log("🔐 Token atual:", token);
  console.log("🛒 Carrinho atual:", cart);

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
    for (const item of cart) {
      await ensureReservation(item, token);
    }

    saveCart(cart);
    updateBadge();

    const normalizedCart = cart.map((item) => ({
      raffleId: item._id || item.raffleId || item.id,
      title: item.title || "Rifa BlinkGames",
      price: Number(item.price) || 1,
      quantity: Number(item.quantity) || 1,
      numeros: item.numbers || [],
    }));

    console.log("📦 Enviando checkout:", normalizedCart);

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
// 🚀 Render inicial
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  // Botão limpar carrinho (se existir)
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) clearBtn.addEventListener("click", clearCart);
});

