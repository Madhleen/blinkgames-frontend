import { RafflesAPI } from './api.js';
import { BRL, getCart, saveCart, updateBadge } from './app.js';
const id=new URLSearchParams(location.search).get('id');
const img=document.getElementById('raffle-img'); const titleEl=document.getElementById('raffle-title'); const descEl=document.getElementById('raffle-desc'); const priceEl=document.getElementById('raffle-price'); const dateEl=document.getElementById('raffle-date'); const qtyEl=document.getElementById('qty'); const genBtn=document.getElementById('gen'); const addBtn=document.getElementById('add'); const numbersEl=document.getElementById('numbers');
function generateNumbers(qty,taken=[]){ const set=new Set(taken); const out=[]; while(out.length<qty){ const n=Math.floor(Math.random()*10000).toString().padStart(4,'0'); if(!set.has(n)){set.add(n); out.push(n);} } return out; }
let raffle=null; let preview=[];
async function load(){ raffle=await RafflesAPI.getById(id); if(!raffle||raffle.error){ titleEl.textContent='Rifa não encontrada'; return; }
  img.src=raffle.imagem||raffle.image||'img/icons/placeholder.svg'; img.alt=raffle.titulo||raffle.title;
  titleEl.textContent=raffle.titulo||raffle.title; descEl.textContent=raffle.descricao||raffle.description||'';
  priceEl.textContent=BRL(raffle.preco||raffle.price); dateEl.textContent=raffle.drawDate?new Date(raffle.drawDate).toLocaleDateString('pt-BR'):'—';
} load();
document.getElementById('plus').onclick=()=> qtyEl.value=Math.max(1,(+qtyEl.value||1)+1);
document.getElementById('minus').onclick=()=> qtyEl.value=Math.max(1,(+qtyEl.value||1)-1);
genBtn.onclick=()=>{ const cart=getCart(); const taken=cart.filter(i=>i._id===id).flatMap(i=>i.numbers||[]); preview=generateNumbers(+qtyEl.value||1,taken); numbersEl.textContent='Números: '+preview.join(', '); };
addBtn.onclick=()=>{ const cart=getCart(); let item=cart.find(i=>i._id===id); const price=raffle.preco||raffle.price||0; if(item){ item.quantity+=(+qtyEl.value||1); item.numbers.push(...preview); } else { item={_id:id,title:raffle.titulo||raffle.title,price,image:raffle.imagem||raffle.image,quantity:(+qtyEl.value||1),numbers:preview.slice()}; cart.push(item);} saveCart(cart); updateBadge(); alert('Adicionado ao carrinho!'); };
