// ============================================================
// 💳 Finalizar compra — v6.7 (corrigido e compatível com backend e webhook)
// ============================================================

// 🔹 Garante que o botão realmente existe antes de registrar evento
const checkoutBtn = document.getElementById("checkout");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", async () => {
    const token = getToken();

    // ⚠️ Verifica login
    if (!token) {
      alert("⚠️ Você precisa estar logado para finalizar a compra!");
      localStorage.setItem("redirectAfterLogin", "carrinho.html");
      window.location.href = "conta.html";
      return;
    }

    // 🛒 Verifica carrinho
    const cart = getCart();
    if (!cart || cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    // 🔹 Normaliza formato do carrinho para backend + webhook
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
      } else if (result?.init_point) {
        window.location.href = result.init_point;
      } else {
        console.error("❌ Resposta inesperada do backend:", result);
        alert("Erro inesperado ao criar checkout.");
      }
    } catch (err) {
      console.error("❌ Erro no checkout:", err);
      alert(err.message || "Erro ao criar checkout");
    }
  });
} else {
  console.warn("⚠️ Botão de checkout não encontrado na página.");
}

