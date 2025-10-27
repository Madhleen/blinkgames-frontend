const BASE="https://blinkgames-backend-p4as.onrender.com";
async function request(path,method='GET',data=null,token=null){const url=`${BASE}${path.startsWith('/')?'':'/'}${path}`;const opt={method,headers:{'Content-Type':'application/json'}};if(data) opt.body=JSON.stringify(data); if(token) opt.headers.Authorization=`Bearer ${token}`; const r=await fetch(url,opt);let j=null;try{j=await r.json();}catch{} if(!r.ok) throw new Error(j?.message||r.statusText);return j;}
export const RafflesAPI={list:()=>request('/api/raffles'),byId:(id)=>request(`/api/raffles/${id}`),reserve:(id,qty,token)=>request(`/api/raffles/${id}/reserve`,'POST',{qty},token)};
export const WinnersAPI={list:()=>request('/api/winners').catch(()=>[])};
export const AuthAPI={login:(email,password)=>request('/api/auth/login','POST',{email,password}),register:(p)=>request('/api/auth/register','POST',p)};
export const CheckoutAPI={create:(cart,token)=>request('/api/order/checkout','POST',{cart},token)};