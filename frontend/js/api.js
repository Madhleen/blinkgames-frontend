// ============================================================
// 🌐 BlinkGames — api.js (v4.4 FINAL — compatível e estável)
// ============================================================

const BASE = "https://blinkgames-backend-p4as.onrender.com";

// ============================================================
// 🔧 Função genérica de requisições HTTP
// ============================================================
export async function request(path, method = "GET", data = null, token = null) {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers = { "Content-Type": "application/json" };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(url, options);
  let json = null;

  try {
    json = await res.json();
  } catch {
    // ignora se não for JSON
  }

  if (!res.ok) {
    const message =
      json?.error ||
      json?.message ||
      `Erro ${res.status}: ${res.statusText || "Falha na requisição"}`;
    throw new Error(message);
  }

  return json;
}

// ============================================================
// 🎟️ Rifas
// ============================================================
export const RafflesAPI = {
  list: () => request("/api/raffles"),
  byId: (id) => request(`/api/raffles/${id}`),
  reserve: (id, qty, token) =>
    request(`/api/raffles/${id}/reserve`, "POST", { qty }, token),
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
// 💳 Checkout
// ============================================================
export const CheckoutAPI = {
  create: async (payload, token) => {
    if (!token) {
      throw new Error("Usuário não autenticado. Faça login para prosseguir.");
    }
    return await request("/api/checkout", "POST", payload, token);
  },
};

// ============================================================
// ✅ Export default opcional
// ============================================================
export default { RafflesAPI, WinnersAPI, AuthAPI, CheckoutAPI };

