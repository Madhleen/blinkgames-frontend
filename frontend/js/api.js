// ============================================================
// 🌐 BlinkGames — api.js (v6.1 — Compatível com Checkout FIX)
// ============================================================

// 🔗 URL do backend em produção
const BASE = "https://blinkgames-backend-p4as.onrender.com";

// ============================================================
// 🧩 Função genérica de requisições
// ============================================================
export async function request(path, method = "GET", data = null, token = null) {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const opts = { method, headers };
  if (data) opts.body = JSON.stringify(data);

  try {
    const res = await fetch(url, opts);

    let json = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      console.error("❌ ERRO HTTP:", json);
      throw new Error(json?.error || json?.message || `Erro ${res.status}`);
    }

    return json;
  } catch (err) {
    console.error("❌ Erro de rede:", err);
    throw new Error(err.message || "Erro de comunicação com o servidor.");
  }
}

// ============================================================
// 🎟️ Rifas
// ============================================================
export const RafflesAPI = {
  list: () => request("/api/raffles"),
  byId: (id) => request(`/api/raffles/${id}`),

  generate: (raffleId, quantidade = 1, token) =>
    request(`/api/raffles/${raffleId}/generate`, "POST", { quantidade }, token),

  reserve: (raffleId, numerosOrQty, token) => {
    const payload = Array.isArray(numerosOrQty)
      ? { numeros: numerosOrQty }
      : { quantidade: Number(numerosOrQty) || 1 };

    return request(`/api/raffles/${raffleId}/reserve`, "POST", payload, token);
  },
};

// ============================================================
// 🏆 Vencedores
// ============================================================
export const WinnersAPI = {
  list: () => request("/api/winners").catch(() => []),
};

// ============================================================
// 👤 Autenticação
// ============================================================
export const AuthAPI = {
  login: (email, password) =>
    request("/api/auth/login", "POST", { email, password }),

  register: (payload) =>
    request("/api/auth/register", "POST", payload),
};

// ============================================================
// 💳 Checkout — 100% compatível com cart.js
// ============================================================
export const CheckoutAPI = {
  create: async (payload, token) => {
    if (!token) throw new Error("Usuário não autenticado.");

    // Backend espera { cart: [...] }
    // Seu cart.js já manda assim, então só repasso:
    const res = await request("/api/checkout", "POST", payload, token);

    // LOG IMPORTANTE
    console.log("📦 CheckoutAPI → Backend respondeu:", res);

    // Retorno padronizado para o cart.js
    return {
      init_point: res?.init_point || null,
      sandbox_init_point: res?.sandbox_init_point || null,
      preference_id: res?.preference_id || null,
      raw: res,
    };
  },
};

// ============================================================
// 📦 Pedidos
// ============================================================
export const OrdersAPI = {
  getMyOrders: async (token) => {
    if (!token) throw new Error("Usuário não autenticado.");
    return request("/api/orders/my", "GET", null, token);
  },

  getById: async (id, token) => {
    if (!token) throw new Error("Usuário não autenticado.");
    return request(`/api/orders/${id}`, "GET", null, token);
  },
};

// ============================================================
// 🔚 Exportação única
// ============================================================
export default {
  RafflesAPI,
  WinnersAPI,
  AuthAPI,
  CheckoutAPI,
  OrdersAPI,
};

