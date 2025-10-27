export function BRL(n){return (n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
export function getCart(){return JSON.parse(localStorage.getItem('blink_cart')||'[]')}
export function saveCart(c){localStorage.setItem('blink_cart', JSON.stringify(c)); updateBadge()}
export function updateBadge(){const b=document.getElementById('cart-badge'); if(!b) return; const c=getCart().reduce((s,i)=>s+(i.quantity||0),0); b.textContent=c}
export function getToken(){return localStorage.getItem('blink_token')||null}
export function setToken(t){localStorage.setItem('blink_token',t||'')}
export function setUser(u){localStorage.setItem('blink_user', JSON.stringify(u||{}))}
export function getUser(){try{return JSON.parse(localStorage.getItem('blink_user')||'{}')}catch{return {}}}
export function clearAuth(){localStorage.removeItem('blink_token');localStorage.removeItem('blink_user')}