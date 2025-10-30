// ============================================================
// 🌐 BlinkGames — api.js (v3.0 revisado e otimizado)
// ============================================================

const BASE = "https://blinkgames-backend-p4as.onrender.com";

// ============================================================
// 🧠 Função genérica de requisições HTTP
// ============================================================
async function request(path, method = "GET", data = null, token = null) {
  const url = `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  // 🔹 Headers base
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`; // ✅ JWT no header

  // 🔹 Configuração da requisição
  const options = { method, headers };
  if (data) options.body = JSON.stringify(data);

  // 🔹 Executa o fetch
  const res = await fetch(url, options);

  // 🔹 Tenta converter resposta em JSON
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* se não for JSON, ignora */
  }

  // 🔹 Trata erros
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
// 🎯 APIs específicas da aplicação
// ============================================================

// 🎟️ Rifas
export const RafflesAPI = {
  list: () => request("/api/raffles"),
  byId: (id) => request(`/api/raffles/${id}`),
  reserve: (id, qty, token) =>
    request(`/api/raffles/${id}/reserve`, "POST", { qty }, token),
};

// 🏆 Vencedores
export const WinnersAPI = {
  list: () => request("/api/winners").catch(() => []),
};

// 👤 Autenticação
export const AuthAPI = {
  login: (email, password) =>
    request("/api/auth/login", "POST", { email, password }),
  register: (payload) => request("/api/auth/register", "POST", payload),
};

// 💳 Checkout
export const CheckoutAPI = {
  create: (cart, token) =>
    request("/api/order/checkout", "POST", { cart }, token),
};

// ============================================================
// 🧩 Export default (opcional)
// ============================================================
// export default { RafflesAPI, WinnersAPI, AuthAPI, CheckoutAPI };

