// ============================================================
// ❌ BlinkGames — erro.js (v1.0 Pagamento Recusado ou Cancelado)
// ============================================================

import { mountHeader } from "./header.js";
mountHeader();

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById("msg");

  msg.innerHTML = `
    <h1>❌ Pagamento não foi concluído</h1>
    <p>Ocorreu um problema ao processar seu pagamento.</p>
    <p>Tente novamente ou entre em contato com o suporte BlinkGames.</p>
    <br>
    <a href="rifas.html" class="btn">Voltar às rifas</a>
  `;

  // 🧹 Garante que o carrinho local seja limpo para evitar duplicações
  localStorage.removeItem("blink_cart");
  localStorage.removeItem("checkoutCache");
});

