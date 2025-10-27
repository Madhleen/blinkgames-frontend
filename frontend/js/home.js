
import { mountHeader } from './header.js';
import { RafflesAPI } from './api.js';
import { BRL, getCart, saveCart, updateBadge } from './state.js';

mountHeader();
const grid = document.getElementById('featured');

async function load(){
  try{
    const list = await RafflesAPI.list();
    grid.innerHTML = (list||[]).slice(0,6).map(r => `
      <article class="card">
        <img src="${r.imagem||r.image||'img/icons/placeholder.svg'}" alt="${r.titulo||r.title}">
        <div class="body">
          <h3>${r.titulo||r.title}</h3>
          <div class="price">R$ ${BRL(r.preco||r.price)}</div>
          <div style="display:flex; gap:10px; margin-top:8px">
            <a class="btn" href="rifa.html?id=${r._id}">Ver</a>
            <button class="btn btn-primary" data-id="${r._id}">Adicionar</button>
          </div>
        </div>
      </article>
    `).join('') || '<p>Nenhuma rifa disponível.</p>';

    grid.querySelectorAll('button[data-id]').forEach(b => {
      b.addEventListener('click', () => add(b.dataset.id, list));
    });
  }catch(e){
    grid.innerHTML = '<p>Falha ao carregar rifas.</p>';
  }
}

function add(id, list){
  const r = (list||[]).find(x => String(x._id)===String(id)); if(!r) return;
  const cart = getCart(); const f = cart.find(i=>i._id===r._id);
  if(f) f.quantity++; else cart.push({_id:r._id, title:r.titulo||r.title, price:r.preco||r.price, image:r.imagem||r.image, quantity:1, numbers:[]});
  saveCart(cart); updateBadge(); alert('Adicionado ao carrinho!');
}
load();
