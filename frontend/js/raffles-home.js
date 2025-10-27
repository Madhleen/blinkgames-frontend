import { RafflesAPI } from './api.js';
import { BRL, getCart, saveCart, updateBadge } from './app.js';
const featured=document.getElementById('featured');
function card(r){return `<article class="card">
  <img src="${r.imagem||r.image||'img/icons/placeholder.svg'}" alt="${r.titulo||r.title}">
  <h3>${r.titulo||r.title}</h3>
  <p>R$ ${BRL(r.preco||r.price)}</p>
  <div style="display:flex;gap:8px">
    <a class="btn" href="rifa.html?id=${r._id}">Ver</a>
    <button class="btn btn-primary" data-id="${r._id}">Adicionar</button>
  </div></article>`;}
async function init(){ if(!featured) return; const res=await RafflesAPI.getAll(); const arr=Array.isArray(res)?res:[];
  featured.innerHTML = arr.slice(0,4).map(card).join('')||'<p>Sem rifas.</p>';
  featured.querySelectorAll('button[data-id]').forEach(btn=>btn.addEventListener('click',()=>add(btn.dataset.id,arr)));
}
function add(id,arr){ const r=arr.find(x=>String(x._id)===String(id)); if(!r) return;
  const cart=getCart(); const f=cart.find(i=>i._id===r._id);
  if(f) f.quantity+=1; else cart.push({_id:r._id,title:r.titulo||r.title,price:r.preco||r.price,image:r.imagem||r.image,quantity:1,numbers:[]});
  saveCart(cart); updateBadge(); alert('Adicionado ao carrinho!');
}
init();
