
const BASE = "https://blinkgames-backend-p4as.onrender.com";

async function request(path, method='GET', data=null, token=null){
  const url = `${BASE}${path.startsWith('/')?'':'/'}${path}`;
  const opt = { method, headers:{'Content-Type':'application/json'} };
  if(data) opt.body = JSON.stringify(data);
  if(token) opt.headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, opt);
  const json = await res.json().catch(() => ({}));
  if(!res.ok) throw new Error(json.message || res.statusText);
  return json;
}

export const RafflesAPI = {
  list: () => request('/api/raffles'),
  byId: (id) => request(`/api/raffles/${id}`),
};

export const WinnersAPI = {
  list: () => request('/api/winners').catch(() => []),
};

export const AuthAPI = {
  login: (email, password) => request('/api/auth/login','POST',{email,password}),
  register: (payload) => request('/api/auth/register','POST', payload),
};

export const CheckoutAPI = {
  create: (cart, token) => request('/api/order/checkout','POST',{cart}, token),
};
