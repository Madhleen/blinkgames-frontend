// ============================================================
// 🛒 BlinkGames — cart.js (v7.1 Corrigido — JWT e Redirect)
// ============================================================

import { mountHeader } from "./header.js";
import { BRL, getCart, saveCart, updateBadge, getToken } from "./state.js";
import { CheckoutAPI } from "./api.js";

mountHeader();

// ... (mantém as funções render, attachEvents e genNumber iguais)

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

