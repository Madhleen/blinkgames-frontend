
import { mountHeader } from './header.js';
import { WinnersAPI } from './api.js';
mountHeader();
const box = document.getElementById('winners');
async function load(){
  try{
    const list = await WinnersAPI.list();
    if(!Array.isArray(list) || list.length===0){ box.innerHTML='<p>Nenhum vencedor publicado ainda.</p>'; return; }
    box.innerHTML = list.map(w => `
      <article class="card">
        <div class="body">
          <h3>${w.prize || 'Prêmio'}</h3>
          <p>Ganhador: <strong>${w.winnerName || w.nome || '—'}</strong></p>
          <small>Sorteio: ${w.date ? new Date(w.date).toLocaleDateString('pt-BR') : '—'}</small>
        </div>
      </article>
    `).join('');
  }catch(e){
    box.innerHTML='<p>Erro ao carregar vencedores.</p>';
  }
}
load();
