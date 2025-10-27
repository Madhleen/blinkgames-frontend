
import { updateBadge } from './state.js';

const LINKS = [
  { href:'index.html', label:'Home' },
  { href:'rifas.html', label:'Rifas' },
  { href:'vencedores.html', label:'Vencedores' },
  { href:'termos.html', label:'Termos' },
  { href:'sobre.html', label:'Sobre' },
  { href:'conta.html', label:'Minha Conta' },
  { href:'carrinho.html', label:'Carrinho', badge:true },
];

function isActive(href){
  const p = location.pathname.split('/').pop() || 'index.html';
  return p === href;
}

export function mountHeader(){
  const el = document.getElementById('header');
  if(!el) return;
  el.innerHTML = `
    <header class="site">
      <div class="header-inner container">
        <a class="brand" href="index.html">Blin<span>kGames</span></a>
        <nav class="nav">
          ${LINKS.map(l => `<a href="${l.href}" class="${isActive(l.href)?'active':''}">${l.label}${l.badge? ' <span id="cart-badge" class="badge">0</span>':''}</a>`).join('')}
        </nav>
      </div>
    </header>
  `;
  updateBadge();
}
