// ============================================================
// 🎮 BlinkGames — state.js (v6.3 — Sincronizado com cart + api)
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
// 🛒 CARRINHO
// ============================================================
export function getCart() {
  try {
    const raw = localStorage.getItem("blink_cart");
    const c = JSON.parse(raw || "[]");
    return Array.isArray(c) ? c : [];
  } catch {
    return [];
  }
}

export function saveCart(c) {
  localStorage.setItem("blink_cart", JSON.stringify(c || []));
  updateBadge();
  window.dispatchEvent(new Event("storage"));
}

export function clearCart() {
  localStorage.removeItem("blink_cart");
  updateBadge();
  window.dispatchEvent(new Event("storage"));
}

export function updateBadge() {
  const badge = document.getElementById("cart-badge");
  const cart = getCart();

  const total = cart.reduce((sum, it) => sum + (it.quantity || 0), 0);

  if (badge) badge.textContent = total > 0 ? total : "";

  // Atualiza também o link do header
  const link = document.querySelector('a[href="carrinho.html"]');
  if (link) {
    link.innerHTML = `
      Carrinho <span id="cart-badge" class="badge">${total > 0 ? total : ""}</span>
    `;
  }
}

// ============================================================
// 👤 AUTENTICAÇÃO
// ============================================================
export function getToken() {
  return localStorage.getItem("blink_token") || null;
}

export function setToken(t) {
  localStorage.setItem("blink_token", t || "");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("blink_user") || "{}");
  } catch {
    return {};
  }
}

export function setUser(u) {
  localStorage.setItem("blink_user", JSON.stringify(u || {}));
}

export function clearAuth() {
  localStorage.removeItem("blink_token");
  localStorage.removeItem("blink_user");
  clearCart();
  updateUserHeader();
}

// ============================================================
// 🌐 HEADER DINÂMICO
// ============================================================
export function updateUserHeader() {
  const user = getUser();
  const nome = user?.nome || user?.name || "";
  const logado = !!getToken() && nome.length > 0;

  const headerUser = document.getElementById("header-user");
  const headerAuth = document.getElementById("header-auth");

  if (!headerUser || !headerAuth) return;

  if (logado) {
    headerUser.innerHTML = `
      <span>Olá, <strong>${nome.split(" ")[0]}</strong></span>
      <button id="logout-btn" class="btn small">Sair</button>
    `;
    headerUser.style.display = "flex";
    headerAuth.style.display = "none";

    document
      .getElementById("logout-btn")
      ?.addEventListener("click", clearAuth);
  } else {
    headerUser.style.display = "none";
    headerAuth.style.display = "flex";
  }

  updateBadge();
}

// ============================================================
// 🚀 Inicialização global
// ============================================================
document.addEventL

