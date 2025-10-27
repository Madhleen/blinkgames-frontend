import { RafflesAPI } from './api.js'; import { BRL } from './app.js';
const grid=document.getElementById('raffles');
function card(r){return `<article class="card">
  <img src="${r.imagem||r.image||'img/icons/placeholder.svg'}" alt="${r.titulo||r.title}">
  <h3>${r.titulo||r.title}</h3>
  <p>R$ ${BRL(r.preco||r.price)}</p>
  <a class="btn btn-primary" href="rifa.html?id=${r._id}">Ver detalhes</a></article>`;}
async function init(){ if(!grid) return; const res=await RafflesAPI.getAll(); const arr=Array.isArray(res)?res:[]; grid.innerHTML=arr.map(card).join('')||'<p>Sem rifas.</p>'; }
init();
