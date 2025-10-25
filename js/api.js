// ============================================================
// 🔥 BlinkGames — api.js
// Camada central de comunicação com o backend (fetch simplificado)
// ============================================================

import { BACKEND, DEBUG } from './config.js';

const headers = {
  'Content-Type': 'application/json',
};

// ============================================================
// 🧠 Função genérica de requisição
// ============================================================
async function request(path, method = 'GET', data = null, token = null) {
  // Garante que sempre haja uma barra separando a base e o path
  const url = `${BACKEND}${path.startsWith('/') ? '' : '/'}${path}`;

  const options = {
    method,
    headers: { ...headers },
  };

  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(url, options);

    // Tenta ler o payload como JSON, mas aceita texto se não for
    let payload;
    try {
      payload = await res.clone().json();
    } catch {
      payload = await res.text();
    }

    // Trata erros HTTP
    if (!res.ok) {
      const msg = (payload && payload.message) || payload || `Erro ${res.status}`;
      if (DEBUG)
        console.error(`[BlinkGames API ${method}] ${url} — ${res.status} — ${msg}`);
      return { error: true, status: res.status, message: msg };
    }

    if (DEBUG)
      console.log(`[BlinkGames API ${method}] ✅ OK: ${url}`, payload);

    return payload;
  } catch (err) {
    if (DEBUG)
      console.error(`[BlinkGames API ❌ ERRO] ${method} ${url} — ${err.message}`);
    return { error: true, message: err.message };
  }
}

// ============================================================
// 🔐 Autenticação (Login, Cadastro, Reset)
// ============================================================
export const AuthAPI = {
  register: (user) => request('/api/auth/register', 'POST', user),
  login: (credentials) => request('/api/auth/login', 'POST', credentials),
  forgot: (email) => request('/api/auth/forgot', 'POST', { email }),
  reset: (token, password) => request('/api/auth/reset', 'POST', { token, password }),
};

// ============================================================
// 🎟️ Rifas
// ============================================================
export const RafflesAPI = {
  getAll: () => request('/api/rifas'),
  getById: (id) => request(`/api/rifas/${id}`),
};

// ============================================================
// 💳 Checkout / Pagamentos
// ============================================================
export const CheckoutAPI = {
  create: (cart, token) => request('/api/order/checkout', 'POST', { cart }, token),
};

// ============================================================
// 🛠️ Painel Admin
// ============================================================
export const AdminAPI = {
  users: (token) => request('/api/admin/users', 'GET', null, token),
  payments: (token) => request('/api/admin/payments', 'GET', null, token),
  raffles: (token) => request('/api/admin/rifas', 'GET', null, token),
  createRaffle: (data, token) => request('/api/admin/rifas', 'POST', data, token),
};

// ============================================================
// ✅ Exportação padrão (para debug e imports globais)
// ============================================================
export default { AuthAPI, RafflesAPI, CheckoutAPI, AdminAPI };

if (DEBUG) console.log('[BlinkGames] api.js carregado — BACKEND:', BACKEND);

