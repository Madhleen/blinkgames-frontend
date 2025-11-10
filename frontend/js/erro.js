// ============================================================
// ❌ BlinkGames — erro.js (v2.0 Produção — Pagamento Recusado ou Cancelado)
// ============================================================

import { mountHeader } from "./header.js";
import { clearCart } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  mountHeader();

  const msg = document.getElementById("msg");
  if (!msg) return;

  msg.innerHTML = `
    <h1 style="color:#ff4b4b;">❌ Pagamento não foi concluído</h1>
    <p>Ocorreu um problema ao processar seu pagamento.</p>
    <p>Isso pode ter acontecido por saldo insuficiente, cartão expirado ou erro de conexão.</p>
    <p>Tente novamente ou entre em contato com o suporte BlinkGames.</p>
    <br>
    <a href="rifas.html" class="btn" style="color:#fff;background:#ff00c8;padding:10px 20px;border-radius:8px;text-decoration:none;">Voltar às rifas</a>
  `;

  // 🧹 Limpa o carrinho e cache local para evitar duplicações
  clearCart();
  localStorage.removeItem("checkoutCache");

  // 🔁 Redireciona automaticamente após 6 segundos
  setTimeout(() => {
    window.location.href = "rifas.html";
  }, 6000);
});

