// BlinkGames — api.js
// Módulo central de comunicação com o backend (fetch simplificado)

import { BACKEND, DEBUG } from './config.js';

const headers = {
  'Content-Type': 'application/json',
};

// ====== Função genérica de requisição ======
async function request(path, method = 'GET', data = null, token = null) {
  const options = {
    method,
    headers: { ...headers },
  };

  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(`${BACKEND}${path}`, options);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return await res.json();
  } catch (err) {
    if (DEBUG) console.error('Erro na API:', err);
    return { error: true, message: err.message };
  }
}

// ====== Endpoints de Autenticação ======
export const AuthAPI = {
  register: (user) => request('/auth/register', 'POST', user),
  login: (credentials) => request('/auth/login', 'POST', credentials),
  forgot: (email) => request('/auth/forgot', 'POST', { email }),
  reset: (token, password) => request('/auth/reset', 'POST', { token, password }),
};

// ====== Rifas ======
export const RafflesAPI = {
  getAll: () => request('/rifas'),
  getById: (id) => request(`/rifas/${id}`),
};

// ====== Checkout / Pagamentos ======
export const CheckoutAPI = {
  create: (cart, token) => request('/order/checkout', 'POST', { cart }, token),
};

// ====== Admin ======
export const AdminAPI = {
  users: (token) => request('/admin/users', 'GET', null, token),
  payments: (token) => request('/admin/payments', 'GET', null, token),
  raffles: (token) => request('/admin/rifas', 'GET', null, token),
  createRaffle: (data, token) => request('/admin/rifas', 'POST', data, token),
};

// ====== Exportação padrão ======
export default { AuthAPI, RafflesAPI, CheckoutAPI, AdminAPI };

if (DEBUG) console.log('BlinkGames api.js carregado');
