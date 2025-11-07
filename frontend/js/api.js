// ============================================================
// 🌐 BlinkGames — api.js (v7.3 FINAL Produção)
// ============================================================

const API_URL = "https://blinkgames-backend-p4as.onrender.com/api";

export const AuthAPI = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  },

  async register(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  },
};

export const CheckoutAPI = {
  async create(payload, token) {
    const res = await fetch(`${API_URL}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Erro ao criar checkout");
    return await res.json();
  },
};

