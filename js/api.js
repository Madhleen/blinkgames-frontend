// ============================================================
// 🔥 BlinkGames — api.js
// Camada central de comunicação com o backend (fetch simplificado)
// ============================================================

import { BACKEND, DEBUG } from './config.js';

const headers = {
  'Content-Type': 'application/json',
};

// ====== Função genérica de requisição ======
async function request(path, method = 'GET', data = null, token = null) {
  const url = `${BACKEND}${path.startsWith('/') ? '' : '/'}${path}`;
  const options = {
    method,
    headers: { ...headers },
  };

  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  if (data) options.body = JSON.stringify(data);

  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }

    if (!res.ok) {
      const msg = payload?.message || `Erro ${res.status}`;
      if (DEBUG) console.error(`[API] ${method} ${url} — ${msg}`);
      return { error: true, message: msg, status: res.status };
    }

    if (DEBUG) console.log(`[API OK] ${method} ${url}`, payload);
    return payload;
  } catch (err) {
    if (DEBUG) console.error(`[API FAIL] ${method} ${url} —`, err.message);
    return { error: true, message: err.message };
  }
}

// 🔐 Autenticação (Login, Cadastro, Reset)
export const AuthAPI = {
  register: (user) => request("/api/auth/register", "POST", user),
  login: (credentials) => request("/api/auth/login", "POST", credentials),
  forgot: (email) => request("/api/auth/forgot", "POST", { email }),
  reset: (token, password) =>
    request("/api/auth/reset", "POST", { token, password }),
};


// ============================================================
// 🎟️ Rifas
// ============================================================
export const RafflesAPI = {
  getAll: () => request('/rifas'),
  getById: (id) => request(`/rifas/${id}`),
};

// ============================================================
// 💳 Checkout / Pagamentos
// ============================================================
export const CheckoutAPI = {
  create: (cart, token) => request('/order/checkout', 'POST', { cart }, token),
};

// ============================================================
// 🛠️ Admin
// ============================================================
export const AdminAPI = {
  users: (token) => request('/admin/users', 'GET', null, token),
  payments: (token) => request('/admin/payments', 'GET', null, token),
  raffles: (token) => request('/admin/rifas', 'GET', null, token),
  createRaffle: (data, token) => request('/admin/rifas', 'POST', data, token),
};

// ============================================================
// ✅ Exportação padrão
// ============================================================
export default { AuthAPI, RafflesAPI, CheckoutAPI, AdminAPI };

if (DEBUG) console.log('[BlinkGames] api.js carregado — BACKEND:', BACKEND);

