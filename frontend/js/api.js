// ============================================================
// 🌐 BlinkGames — api.js (v5.0 PRODUÇÃO — base única)
// ============================================================

const BASE = "https://blinkgames-backend-p4as.onrender.com";

// Genérico
export async function request(path, method = "GET", data = null, token = null) {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (data) opts.body = JSON.stringify(data);

  const res = await fetch(url, opts);
  let json = null;
  try { json = await res.json(); } catch {}

  if (!res.ok) {
    const message = json?.error || json?.message || `Erro ${res.status}`;
    throw new Error(message);
  }
  return json;
}

// Rifas
export const RafflesAPI = {
  list: () => request("/api/raffles"),
  byId: (id) => request(`/api/raffles/${id}`),

  // Gera números quando o usuário não escolhe manualmente
  generate: (id, quantidade = 1, token) =>
    request(`/api/raffles/${id}/generate`, "POST", { quantidade }, token),

  // Reserva números. Aceita array de números OU quantidade.
  reserve: (id, numerosOrQty, token) => {
    const payload = Array.isArray(numerosOrQty)
      ? { numeros: numerosOrQty }
      : { quantidade: Number(numerosOrQty) || 1 };
    return request(`/api/raffles/${id}/reserve`, "POST", payload, token);
  },
};

// Vencedores
export const WinnersAPI = {
  list: () => request("/api/winners").catch(() => []),
};

// Auth
export const AuthAPI = {
  login: (email, password) => request("/api/auth/login", "POST", { email, password }),
  register: (payload) => request("/api/auth/register", "POST", payload),
};

// Checkout (sempre com usuário autenticado)
export const CheckoutAPI = {
  create: async (payload, token) => {
    if (!token) throw new Error("Usuário não autenticado.");
    return request("/api/checkout", "POST", payload, token);
  },
};

export default { RafflesAPI, WinnersAPI, AuthAPI, CheckoutAPI };

