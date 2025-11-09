// ============================================================
// 🎮 BlinkGames — state.js (v6.1 PRODUÇÃO ESTÁVEL CORRIGIDO)
// ============================================================

// 💰 Formata valores em Real
export function BRL(n) {
  return (n || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

// ============================================================
// 🛒 Carrinho
// ============================================================
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem("blink_cart") || "[]");
  } catch {
    localStorage.removeItem("blink_cart");
    return [];
  }
}

export function saveCart(c) {
  if (!Array.isArray(c) || c.length === 0) {
    localStorage.removeItem("blink_cart");
  } else {
    localStorage.setItem("blink_cart", JSON.stringify(c));
  }
  updateBadge();
}

// 🔹 Atualiza o número no ícone do carrinho
export function updateBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + (i.quantity || 0), 0);

  if (total > 0) {
    badge.textContent = total;
    badge.style.display = "inline-block";
  } else {
    badge.textContent = "";
    badge.style.display = "none";
  }
}

// ============================================================
// 👤 Autenticação e Usuário
// ============================================================
export function getToken() {
  return localStorage.getItem("blink_token") || null;
}

export function setToken(token) {
  localStorage.setItem("blink_token", token || "");
}

export function setUser(user) {
  localStorage.setItem("blink_user", JSON.stringify(user || {}));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("blink_user") || "{}");
  } catch {
    return {};
  }
}

// 🔹 Logout completo
export function clearAuth() {
  localStorage.removeItem("blink_token");
  localStorage.removeItem("blink_user");
  localStorage.removeItem("blink_cart");
  updateUserHeader();
  updateBadge();
}

// ============================================================
// 🌐 Atualiza o Header com nome do usuário logado
// ============================================================
export function updateUserHeader() {
  const user = getUser();
  const token = getToken();
  const headerUser = document.getElementById("header-user");
  const headerAuth = document.getElementById("header-auth");

  if (!headerUser || !headerAuth) return;

  const nome = user?.nome || user?.name || "";
  const logado = !!token && !!nome;

  if (logado) {
    headerUser.innerHTML = `
      <span>Olá, <strong>${nome.split(" ")[0]}</strong></span>
      <button id="logout-btn" class="btn btn-secondary small">Sair</button>
    `;
    headerUser.style.display = "flex";
    headerAuth.style.display = "none";

    // 🔴 Evento de logout
    document
      .getElementById("logout-btn")
      ?.addEventListener("click", () => clearAuth());
  } else {
    headerUser.style.display = "none";
    headerAuth.style.display = "flex";
  }
}

// ============================================================
// ⚡ Inicializa header e badge no carregamento
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  updateUserHeader();
  updateBadge();
});

