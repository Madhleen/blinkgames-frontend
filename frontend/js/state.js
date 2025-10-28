// ============================================================
// 🎮 BlinkGames — state.js (v5.3)
// ============================================================

// 💰 Formata valores em Real
export function BRL(n) {
  return (n || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// 🛒 Carrinho
export function getCart() {
  return JSON.parse(localStorage.getItem("blink_cart") || "[]");
}

export function saveCart(c) {
  localStorage.setItem("blink_cart", JSON.stringify(c));
  updateBadge();
}

export function updateBadge() {
  const b = document.getElementById("cart-badge");
  if (!b) return;
  const c = getCart().reduce((s, i) => s + (i.quantity || 0), 0);
  b.textContent = c > 0 ? c : "";
}

// 👤 Autenticação e Usuário
export function getToken() {
  return localStorage.getItem("blink_token") || null;
}

export function setToken(t) {
  localStorage.setItem("blink_token", t || "");
}

export function setUser(u) {
  localStorage.setItem("blink_user", JSON.stringify(u || {}));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("blink_user") || "{}");
  } catch {
    return {};
  }
}

export function clearAuth() {
  localStorage.removeItem("blink_token");
  localStorage.removeItem("blink_user");
  updateUserHeader();
}

// ============================================================
// 🌐 UI Dinâmica — Atualiza o Header com "Olá, Usuário"
// ============================================================
export function updateUserHeader() {
  const user = getUser();
  const headerUser = document.getElementById("header-user");
  const headerAuth = document.getElementById("header-auth");

  if (!headerUser || !headerAuth) return;

  const nome = user?.nome || user?.name || "";
  const logado = !!getToken() && !!nome;

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

// Executa sempre que a página carrega
document.addEventListener("DOMContentLoaded", updateUserHeader);

