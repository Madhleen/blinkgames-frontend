import { updateBadge, getToken, getUser, clearAuth } from './state.js';
const LINKS=[{href:'index.html',label:'Home'},{href:'rifas.html',label:'Rifas'},{href:'vencedores.html',label:'Vencedores'},{href:'termos.html',label:'Termos'},{href:'sobre.html',label:'Sobre'}];
function isActive(h){const p=(location.pathname.split('/').pop()||'index.html');return p===h;}
export function mountHeader(){
  const el=document.getElementById('header'); if(!el) return;
  const user=getUser(); const logged=!!getToken();
  const right= logged?`<a href="minhas-rifas.html">Minhas Rifas</a><span class="small">Olá, ${user?.nome||user?.name||'usuário'}!</span><a href="#" id="logout">Sair</a><a href="carrinho.html">Carrinho <span id="cart-badge" class="badge">0</span></a>`:`<a href="conta.html">Minha Conta</a><a href="carrinho.html">Carrinho <span id="cart-badge" class="badge">0</span></a>`;
  el.innerHTML=`<header class="site"><div class="header-inner"><a class="brand" href="index.html">Blink<span>Games</span></a><nav class="nav">${LINKS.map(l=>`<a class="${isActive(l.href)?'active':''}" href="${l.href}">${l.label}</a>`).join('')}${right}</nav></div></header>`;
  const btn=document.getElementById('logout'); if(btn){btn.addEventListener('click',e=>{e.preventDefault();clearAuth();location.href='index.html';});}
  updateBadge();
}