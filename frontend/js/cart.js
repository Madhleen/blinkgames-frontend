// ============================================================
// 🛒 BlinkGames — cart.js (v8.0 Produção Final — Reserva + JWT)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { CheckoutAPI } from "./api.js";

mountHeader();

// ============================================================
// 🧾 Reserva dos números antes do checkout
// ============================================================
async function reservarNumeros(raffleId, numeros, token) {
  try {
    const res = await fetch(`https://blinkgames-backend-p4as.onrender.com/api/raffles/${raffleId}/reserve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ numeros }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erro ao reservar números");
    }

    const data = await res.json();
    console.log("✅ Reserva confirmada:", data);
    return data;
  } catch (err) {
    console.error("❌ Erro ao reservar:", err);
    alert("Erro ao reservar números. Tente novamente.");
    throw err;
  }
}

// ============================================================
// 🧾 Evento de finalizar compra
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

  // Reserva todos os números do carrinho antes de criar o checkout
  for (const item of cart) {
    const raffleId = item._id || item.raffleId || item.id;
    const numeros = item.numbers || [];

    try {
      await reservarNumeros(raffleId, numeros, token);
    } catch {
      alert(`Erro ao reservar números da rifa ${item.title || "sem título"}.`);
      return;
    }
  }

  const normalizedCart = cart.map((item) => ({
    raffleId: item._id || item.raffleId || item.id,
    title: item.title || "Rifa BlinkGames",
    price: Number(item.price) || 1,
    quantity: Number(item.quantity) || 1,
    numeros: item.numbers || [],
  }));

  try {
    console.log("🧾 Enviando carrinho:", normalizedCart);
    const result = await CheckoutAPI.create({ cart: normalizedCart }, token);
    console.log("💳 Resposta:", result);

    if (result?.init_point) {
      localStorage.setItem("checkoutCache", JSON.stringify(cart));
      window.location.href = result.init_point;
    } else {
      alert("Erro ao criar checkout.");
    }
  } catch (err) {
    console.error("❌ Erro no checkout:", err);
    alert(err.message || "Erro ao criar checkout");
  }
});

