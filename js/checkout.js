// BlinkGames — checkout.js
// Gerencia o fluxo pós-checkout e atualiza status de compra

import { updateCartBadge } from './app.js';
import { BACKEND } from './config.js';

async function checkPaymentStatus(paymentId) {
  try {
    const res = await fetch(`${BACKEND}/order/status/${paymentId}`);
    if (!res.ok) throw new Error('Falha ao verificar status');
    const data = await res.json();
    return data.status;
  } catch (err) {
    console.error('Erro ao verificar pagamento:', err);
    return null;
  }
}

function showStatusMessage(status) {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  if (status === 'approved') {
    container.innerHTML = `
      <h1>✅ Pagamento Aprovado</h1>
      <p>Seus números foram confirmados e adicionados à sua conta.</p>
      <a href="/conta.html" class="btn-primary">Ver minhas rifas</a>
    `;
  } else if (status === 'pending') {
    container.innerHTML = `
      <h1>⏳ Pagamento Pendente</h1>
      <p>Seu pagamento ainda está sendo processado. Assim que for aprovado, seus números serão confirmados.</p>
      <a href="/conta.html" class="btn-secondary">Ver minha conta</a>
    `;
  } else if (status === 'rejected') {
    container.innerHTML = `
      <h1>❌ Pagamento Rejeitado</h1>
      <p>O pagamento não foi aprovado. Nenhum número foi reservado.</p>
      <a href="/carrinho.html" class="btn-secondary">Tentar novamente</a>
    `;
  } else {
    container.innerHTML = `
      <h1>⚠️ Status Desconhecido</h1>
      <p>Não foi possível confirmar o status do pagamento.</p>
      <a href="/conta.html" class="btn-secondary">Ver minha conta</a>
    `;
  }
}

(async function init() {
  updateCartBadge();

  const params = new URLSearchParams(window.location.search);
  const paymentId = params.get('payment_id');

  if (!paymentId) {
    console.warn('Sem payment_id na URL — redirecionando.');
    window.location.href = '/';
    return;
  }

  const status = await checkPaymentStatus(paymentId);
  showStatusMessage(status);
})();
