// ============================================================
// 🎉 BlinkGames — sucesso.js (v4.1 — Compatível com backend oficial)
// ============================================================

import { getToken, clearCart } from "./state.js";
import { OrdersAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const msg = document.getElementById("msg");
  const token = getToken();

  if (!token) {
    window.location.href = "conta.html";
    return;
  }

  msg.innerHTML = `
    <h1 class="loading">⏳ Confirmando pagamento...</h1>
    <p>Aguarde enquanto validamos com o Mercado Pago.</p>
  `;

  try {
    const orders = await OrdersAPI.getMyOrders(token);

    if (!orders.length) {
      msg.innerHTML = `
        <h1>⏳ Pagamento pendente</h1>
        <p>Estamos aguardando o retorno do Mercado Pago...</p>
      `;
      setTimeout(() => location.reload(), 4000);
      return;
    }

    const last = orders[0];

    // ==========================
    // 🔥 STATUS APROVADO
    // ==========================
    if (last.status === "approved") {
      clearCart();

      msg.innerHTML = `
        <h1 class="blink">✅ Pagamento aprovado!</h1>
        <p>Seu pedido <strong>${last._id}</strong> foi confirmado.</p>
        <p><a href="minhas-rifas.html">Ir para Minhas Rifas</a></p>
      `;

      setTimeout(() => {
        window.location.href = "minhas-rifas.html";
      }, 3500);

      return;
    }

    // ==========================
    // ⏳ PENDENTE
    // ==========================
    if (last.status === "pending") {
      msg.innerHTML = `
        <h1>⏳ Pagamento pendente</h1>
        <p>O Mercado Pago ainda não enviou a aprovação.</p>
        <p>A página será atualizada automaticamente.</p>
      `;
      setTimeout(() => location.reload(), 5000);
      return;
    }

    // ==========================
    // ❌ REJEITADO
    // ==========================
    msg.innerHTML = `
      <h1>❌ Pagamento não aprovado</h1>
      <p>Tente novamente no carrinho.</p>
      <p><a href="carrinho.html">Voltar ao carrinho</a></p>
    `;
  } catch (err) {
    console.error("Erro:", err);
    msg.innerHTML = `
      <h1>⚠️ Erro</h1>
      <p>Não foi possível confirmar o pagamento.</p>
      <p><a href="minhas-rifas.html">Minhas Rifas</a></p>
    `;
  }
});

