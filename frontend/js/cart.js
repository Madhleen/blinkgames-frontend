
import { mountHeader } from './header.js';
import { BRL, getCart, saveCart, updateBadge, getToken } from './state.js';
import { CheckoutAPI } from './api.js';
mountHeader();

const list = document.getElementById('list');
const empty = document.getElementById('empty');
const totalEl = document.getElementById('total');

function render(){
  const cart = getCart();
  list.innerHTML = '';
  if(cart.length===0){ empty.style.display='block'; totalEl.textContent=BRL(0); return; }
  empty.style.display='none';
  let total=0;
  cart.forEach((i,idx)=>{
    const sub=(i.price||0)*(i.quantity||0); total+=sub;
    const li = document.createElement('li');
    li.className='cart-item';
    li.innerHTML = `
      <img src="${i.image||'img/icons/placeholder.svg'}" alt="${i.title}">
      <div><strong>${i.title}</strong><div>${i.quantity}x — R$ ${BRL(sub)}</div><small>${(i.numbers||[]).slice(0,8).join(', ')}</small></div>
      <div>
        <button data-a="dec" data-i="${idx}">−</button>
        <button data-a="inc" data-i="${idx}">+</button>
        <button data-a="rem" data-i="${idx}">Remover</button>
      </div>`;
    list.appendChild(li);
  });
  totalEl.textContent = BRL(total);
}
render();

list.addEventListener('click', e=>{
  const a=e.target.dataset.a; if(!a) return;
  const i=+e.target.dataset.i; const cart=getCart();
  if(a==='inc') cart[i].quantity++;
  if(a==='dec') cart[i].quantity = Math.max(1, cart[i].quantity-1);
  if(a==='rem') cart.splice(i,1);
  saveCart(cart); render(); updateBadge();
});

document.getElementById('checkout').onclick = async ()=>{
  const token = getToken();
  if(!token){ alert('Faça login para continuar.'); location.href='conta.html'; return; }
  const res = await CheckoutAPI.create(getCart(), token);
  if(res && res.init_point) location.href = res.init_point;
  else alert('Não foi possível iniciar o checkout.');
};
