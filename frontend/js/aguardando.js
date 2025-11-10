// ============================================================
// ⏳ BlinkGames — aguardando.js (v2.0 Produção — Pagamento Pendente Monitorado)
// ============================================================

import { mountHeader } from "./header.js";
import { getToken } from "./state.js";
import { OrdersAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  mountHeader();

  const msg = document.getElementById("msg");
  if (!msg) return;

  const token = getToken();
  if (!token) {
    msg.innerHTML = `
      <h1>⚠️ Sessão expirada</h1>
      <p>Faça login novamente para acompanhar seu pagamento.</p>
      <a href="conta.html" class="btn">Ir para login</a>
    `;
    return;
  }

  msg.innerHTML = `
    <h1>⏳ Pagamento em processamento...</h1>
    <p>O Mercado Pago ainda está confirmando o seu pagamento.</p>
    <p>Assim que for aprovado, suas rifas aparecerão em <a href="minhas-rifas.html">Minhas Rifas</a>.</p>
    <p style="color:#ffde59;">Atualizando automaticamente...</p>
    <br>
    <a href="rifas.html" class="btn" style="color:#fff;background:#ff00c8;padding:10px 20px;border-radius:8px;text-decoration:none;">Voltar às rifas</a>
  `;

  // ============================================================
  // 🔁 Verifica status de pagamento a cada 10s
  // ============================================================
  async function checkPayment() {
    try {
      const orders = await OrdersAPI.getMyOrders(token);
      const hasApproved = orders?.some((o) => o.status === "approved");

      if (hasApproved) {
        msg.innerHTML = `
          <h1 class="blink">✅ Pagamento aprovado!</h1>
          <p>Seus números foram registrados com sucesso.</p>
          <p><a href="minhas-rifas.html">Ver Minhas Rifas</a></p>
          <small style="color:#888;">Redirecionando automaticamente...</small>
        `;
        setTimeout(() => {
          window.location.href = "minhas-rifas.html";
        }, 3500);
      }
    } catch (err) {
      console.error("❌ Erro ao verificar pagamento:", err);
    }
  }

  // Executa imediatamente e repete a cada 10 segundos
  checkPayment();
  setInterval(checkPayment, 10000);
});

