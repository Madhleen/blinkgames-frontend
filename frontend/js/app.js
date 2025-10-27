export function getToken(){ return localStorage.getItem('blink_token')||null; }
export function setToken(t){ localStorage.setItem('blink_token', t||''); }
export function getCart(){ return JSON.parse(localStorage.getItem('blink_cart')||'[]'); }
export function saveCart(c){ localStorage.setItem('blink_cart', JSON.stringify(c)); }
export function BRL(n){ return (n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }
export function updateBadge(){ const b=document.getElementById('cart-badge'); if(!b)return; const c=getCart().reduce((s,i)=>s+(i.quantity||0),0); b.textContent=c; }
function header(){ const h=document.getElementById('header'); const token=getToken(); h.innerHTML=`
  <div class="header-inner">
    <a class="brand" href="index.html">BlinkGames</a>
    <nav class="nav">
      <a href="index.html">Home</a>
      <a href="rifas.html">Rifas</a>
      <a href="conta.html">${token?'Minha Conta':'Entrar'}</a>
      <a href="carrinho.html">Carrinho <span id="cart-badge" class="badge">0</span></a>
    </nav>
  </div>`; updateBadge(); }
window.addEventListener('DOMContentLoaded', header);
