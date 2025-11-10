// ============================================================
// 🎉 BlinkGames — sucesso.js (v3.5 Estável — Valida com backend)
// ============================================================

import { getToken, clearAuth } from "./state.js";
import { AuthAPI } from "./api.js"; // ✅ usa AuthAPI, pois as compras estão em /api/auth/me

async function verificarPagamento() {
  const token = getToken();
  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    clearAuth();
    window.location.href = "conta.html";
    return;
  }

  const msg = document.getElementById("msg");
  msg.innerHTML = `
    <h1 class="loading">⏳ Confirmando pagamento...</h1>
    <p>Aguarde enquanto validamos seu status no servidor.</p>
  `;

  try {
    // 🔍 Busca dados do usuário e suas compras
    const user = await AuthAPI.me(token);
    const purchases = user?.purchases || [];

    const hasPaid = purchases.some((p) => {
      if (Array.isArray(p.items)) {
        return p.items.some((i) => i && i.status === "approved");
      }
      return p.status === "approved";
    });

    if (hasPaid) {
      // ✅ Pagamento confirmado
      localStorage.removeItem("blink_cart");
      localStorage.removeItem("checkoutCache");

      msg.innerHTML = `
        <h1 class="blink">✅ Pagamento aprovado!</h1>
        <p>Seus números foram registrados com sucesso.</p>
        <p><a href="minhas-rifas.html">Ir para Minhas Rifas</a></p>
        <small style="color:#888;">Você será redirecionado automaticamente...</small>
      `;

      setTimeout(() => {
        window.location.href = "minhas-rifas.html";
      }, 3500);
    } else {
      // 🕓 Pagamento ainda pendente
      msg.innerHTML = `
        <h1>⏳ Pagamento pendente</h1>
        <p>Estamos aguardando a confirmação do Mercado Pago...</p>
        <p><a href="minhas-rifas.html">Ver Minhas Rifas</a></p>
      `;

      // 🔁 tenta novamente em 5s
      setTimeout(verificarPagamento, 5000);
    }
  } catch (err) {
    console.error("❌ Erro ao confirmar pagamento:", err);
    msg.innerHTML = `
      <h1>⚠️ Erro</h1>
      <p>Não foi possível verificar o status do pagamento.</p>
      <p><a href="minhas-rifas.html">Minhas Rifas</a></p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", verificarPagamento);

