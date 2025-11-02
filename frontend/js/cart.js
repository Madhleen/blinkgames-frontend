// ============================================================
// 💳 Finalizar compra — v6.6 compatível com backend e webhook
// ============================================================
checkoutBtn?.addEventListener("click", async () => {
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

  // 🔹 Formata o carrinho com os campos esperados no backend e webhook
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
      alert("Erro inesperado ao criar checkout.");
      console.error("❌ Resposta inesperada:", result);
    }
  } catch (err) {
    console.error("❌ Erro no checkout:", err);
    alert(err.message || "Erro ao criar checkout");
  }
});

