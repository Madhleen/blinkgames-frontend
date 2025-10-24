// BlinkGames — raffles.js
// Controla a listagem de rifas (página rifas.html)

import { RafflesAPI } from './api.js';
import { updateCartBadge } from './app.js';

const container = document.querySelector('.grid-cards');

async function loadRaffles() {
  if (!container) return;

  container.innerHTML = `<p>Carregando rifas...</p>`;

  const res = await RafflesAPI.getAll();

  if (!res || res.error) {
    container.innerHTML = `<p>Erro ao carregar rifas. Tente novamente mais tarde.</p>`;
    return;
  }

  if (res.length === 0) {
    container.innerHTML = `<p>Nenhuma rifa disponível no momento.</p>`;
    return;
  }

  container.innerHTML = res
    .map(
      (r) => `
      <article class="card">
        <img src="${r.imagem}" alt="${r.titulo}">
        <div class="card-content">
          <h3>${r.titulo}</h3>
          <p>${r.descricao}</p>
          <p><strong>R$ ${r.preco.toFixed(2)}</strong></p>
          <p><small>Sorteio: ${new Date(r.dataSorteio).toLocaleDateString('pt-BR')}</small></p>
          <div class="card-actions">
            <a href="/rifa.html?id=${r._id}" class="btn-primary">Ver detalhes</a>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

loadRaffles();
updateCartBadge();
