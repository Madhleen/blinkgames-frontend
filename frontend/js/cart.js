// ============================================================
// 🛒 BlinkGames — cart.js (v9.0 Reserva + Fallback + JWT)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { RafflesAPI, CheckoutAPI } from "./api.js";

mountHeader();

// Garante reserva para um item do carrinho
async function ensureReservation(item, token) {
  const raffleId = item._id || item.raffleId || item.id;
  if (!raffleId) throw new Error("Item sem raffleId");

  // 1) se não há números, tenta gerar no backend
  let numeros = Array.isArray(item.numbers) ? item.numbers : [];
  if (!numeros.length) {
    const gen = await RafflesAPI.generate(raffleId, item.quantity || 1, token);
    numeros = gen?.numeros || gen?.numbers || [];
  }

  // 2) reserva de fato
  const res = await RafflesAPI.reserve(raffleId, numeros, token);
  const reserved = res?.numeros || res?.numbers || numeros;

  // 3) persiste no item
  item.numbers = reserved;
  return reserved;
}

// Finalizar compra
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
    // Reserva item a item (gera se necessário)
    for (const item of cart) {
      await ensureReservation(item, token);
    }
    // salva números reservados no armazenamento local
    saveCart(cart);

    // Normaliza payload do checkout
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
      localStorage.setItem("redirectAfterLogin", "carrinho.html");
      window.location.href = "conta.html";
      return;
    }
    alert(err.message || "Erro ao reservar/criar checkout.");
  }
});

