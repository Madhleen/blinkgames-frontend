// ============================================================
// 🎉 BlinkGames — sucesso.js (v2.0 Integrado ao Backend)
// ============================================================

import { getToken, clearAuth } from "./state.js";
import { OrdersAPI } from "./api.js";

async function initSuccess() {
  const token = getToken();
  if (!token) {
    alert("Sessão expirada. Faça login novamente.");
    clearAuth();
    window.location.href = "conta.html";
    return;
  }

  try {
    // 🔍 Verifica se há pedidos confirmados no backend
    const orders = await OrdersAPI.getMyOrders(token);
    const hasPaid = orders?.some(o => o.status === "approved");

    if (hasPaid) {
      // 🧹 Limpa cache local
      localStorage.removeItem("blink_cart");
      localStorage.removeItem("checkoutCache");

      document.getElementById("msg").innerHTML = `
        <h1 class="blink">✅ Pagamento aprovado!</h1>
        <p>Seus números foram registrados com sucesso.</p>
        <p><a href="minhas-rifas.html">Ir para Minhas Rifas</a></p>
        <small style="color:#888;">Você será redirecionado automaticamente...</small>
      `;

      setTimeout(() => {
        window.location.href = "minhas-rifas.html";
      }, 3500);
    } else {
      document.getElementById("msg").innerHTML = `
        <h1>⏳ Pagamento pendente</h1>
        <p>Estamos aguardando a confirmação do Mercado Pago...</p>
        <p><a href="minhas-rifas.html">Ver Minhas Rifas</a></p>
      `;
    }
  } catch (err) {
    console.error("Erro ao confirmar pagamento:", err);
    alert("Erro ao verificar pagamento. Tente novamente mais tarde.");
  }
}

document.addEventListener("DOMContentLoaded", initSuccess);

