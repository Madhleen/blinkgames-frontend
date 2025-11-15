// ============================================================
// 🌐 BlinkGames — api.js (v6.0 FINAL — Produção Completa)
// ============================================================

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
      const message = json?.error || json?.message || `Erro ${res.status}`;
      throw new Error(message);
    }

    return json;
  } catch (err) {
    console.error("❌ Erro de rede na request:", err);
    throw new Error("Falha na comunicação com o servidor.");
  }
}

// ============================================================
// 🎟️ Rifas
// ============================================================
export const RafflesAPI = {
  list: () => request("/api/raffles"),
  byId: (id) => request(`/api/raffles/${id}`),

  // Gera números quando o usuário não escolhe manualmente
  generate: (id, quantidade = 1, token) =>
    request(`/api/raffles/${id}/generate`, "POST", { quantidade }, token),

  // Reserva números (aceita array de números ou quantidade)
  reserve: (id, numerosOrQty, token) => {
    const payload = Array.isArray(numerosOrQty)
      ? { numeros: numerosOrQty }
      : { quantidade: Number(numerosOrQty) || 1 };
    return request(`/api/raffles/${id}/reserve`, "POST", payload, token);
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
  register: (payload) => request("/api/auth/register", "POST", payload),
};

// ============================================================
// 💳 Checkout (Mercado Pago)
// ============================================================
export const CheckoutAPI = {
  create: async (payload, token) => {
    if (!token) throw new Error("Usuário não autenticado.");
    return request("/api/checkout", "POST", payload, token);
  },
};

// ============================================================
// 📦 Pedidos / Compras do Usuário
// ============================================================
export const OrdersAPI = {
  // Busca pedidos do usuário logado (usado em sucesso.js e aguardando.js)
  getMyOrders: async (token) => {
    if (!token) throw new Error("Usuário não autenticado.");
    return request("/api/orders/my", "GET", null, token);
  },

  // Busca pedido específico por ID (para futuros detalhes)
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

