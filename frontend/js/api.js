import { BACKEND, DEBUG } from './config.js';
async function request(path, method='GET', data=null, token=null){
  const url = `${BACKEND}${path.startsWith('/')?'':'/'}${path}`;
  const opt = { method, headers:{'Content-Type':'application/json'} };
  if(data) opt.body = JSON.stringify(data);
  if(token) opt.headers.Authorization = `Bearer ${token}`;
  try{ const res = await fetch(url,opt); const json = await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(json.message || res.statusText);
    if(DEBUG) console.log('[API]', method, url, json);
    return json;
  }catch(e){ if(DEBUG) console.error('[API ERROR]', method, url, e.message); return {error:true,message:e.message}; }
}
export const RafflesAPI = { getAll:()=>request('/api/raffles'), getById:(id)=>request(`/api/raffles/${id}`) };
export const AuthAPI = { login:(email,password)=>request('/api/auth/login','POST',{email,password}), register:(p)=>request('/api/auth/register','POST',p) };
export const CheckoutAPI = { create:(cart,token)=>request('/api/order/checkout','POST',{cart},token) };
