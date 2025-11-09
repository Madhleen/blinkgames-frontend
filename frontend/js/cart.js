// ============================================================
// 🛒 BlinkGames — cart.js (v9.2 Produção Estável — Reserva + JWT Fix)
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
    // Reserva item a item
    for (const item of cart) {
      await ensureReservation(item, token);
    }

    // Atualiza storage e badge
    saveCart(cart);
    updateBadge();

    // Monta payload para checkout
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
      localStorage.clear(); // 🧹 limpa tudo pra evitar token travado
      window.location.href = "conta.html";
      return;
    }

    alert(err.message || "Erro ao reservar/criar checkout.");
  }
});

