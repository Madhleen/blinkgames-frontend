// BlinkGames — winners.js
// Página de vencedores das rifas (exibição pública)

import { RafflesAPI } from './api.js';
import { formatarDataBR } from './utils.js';
import { updateCartBadge } from './app.js';

const winnersContainer = document.getElementById('winners-list');

async function loadWinners() {
  if (!winnersContainer) return;

  winnersContainer.innerHTML = `<p>Carregando vencedores...</p>`;

  const rifas = await RafflesAPI.getAll();

  if (!rifas || rifas.error) {
    winnersContainer.innerHTML = `<p>Erro ao carregar vencedores.</p>`;
    return;
  }

  const vencedores = rifas
    .filter(r => r.vencedor)
    .map(r => `
      <article class="winner-card">
        <img src="${r.imagem}" alt="${r.titulo}">
        <div class="winner-info">
          <h3>${r.titulo}</h3>
          <p><strong>Vencedor:</strong> ${r.vencedor}</p>
          <p><strong>Número:</strong> ${r.numeroVencedor}</p>
          <p><small>Sorteio: ${formatarDataBR(r.dataSorteio)}</small></p>
        </div>
      </article>
    `);

  winnersContainer.innerHTML = vencedores.length
    ? vencedores.join('')
    : '<p>Nenhum vencedor disponível ainda.</p>';
}

loadWinners();
updateCartBadge();
