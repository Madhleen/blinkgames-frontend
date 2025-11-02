// ============================================================
// 🌐 BlinkGames — api.js (v4.2 FINAL — compatível com backend v6.4)
// ============================================================

const BASE = "https://blinkgames-backend-p4as.onrender.com";

// ============================================================
// 🧠 Função genérica de requisições HTTP
// ============================================================
async function request(path, method = "GET", data = null, token = null) {
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
// 💳 Checkout (compatível com o backend v6.4)
// ============================================================
// ✅ Recebe já o objeto completo { cart: [...] } preparado pelo cart.js
// ✅ Inclui o token JWT corretamente no header Authorization
export const CheckoutAPI = {
  create: (payload, token) =>
    request("/api/checkout", "POST", payload, token),
};

// ============================================================
// ✅ Export default (caso queira importar tudo de uma vez)
// ============================================================
// export default { RafflesAPI, WinnersAPI, AuthAPI, CheckoutAPI };

