// ============================================================
// ⏳ BlinkGames — aguardando.js (v1.0 Pagamento Pendente)
// ============================================================

import { mountHeader } from "./header.js";
mountHeader();

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById("msg");

  msg.innerHTML = `
    <h1>⏳ Pagamento em processamento...</h1>
    <p>O Mercado Pago ainda está confirmando o seu pagamento.</p>
    <p>Assim que for aprovado, suas rifas aparecerão em <a href="minhas-rifas.html">Minhas Rifas</a>.</p>
    <br>
    <a href="rifas.html" class="btn">Voltar às rifas</a>
  `;

  // 🔁 Atualiza status a cada 10 segundos (opcional)
  setInterval(() => {
    console.log("⏳ Verificando status...");
  }, 10000);
});

