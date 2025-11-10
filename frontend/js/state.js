// ============================================================
// 🎮 BlinkGames — state.js (v6.2 TOTALMENTE SINCRONIZADO)
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
    const data = localStorage.getItem("blink_cart");
    const cart = JSON.parse(data || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function saveCart(c) {
  localStorage.setItem("blink_cart", JSON.stringify(c || []));
  updateBadge();
  // 🔄 Dispara evento pra header.js atualizar badge em tempo real
  window.dispatchEvent(new Event("storage"));
}

export function clearCart() {
  localStorage.removeItem("blink_cart");
  updateBadge();
  window.dispatchEvent(new Event("storage"));
}

export function updateBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  const cart = getCart();
  const totalItens = cart.reduce((acc, i) => acc + (i.quantity || 0), 0);

  badge.textContent = totalItens > 0 ? totalItens : "";

  // Atualiza também o texto do link “Carrinho”
  const linkCarrinho = document.querySelector('a[href="carrinho.html"]');
  if (linkCarrinho) {
    linkCarrinho.innerHTML = `
      Carrinho <span id="cart-badge" class="badge">${totalItens > 0 ? totalItens : ""}</span>
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
  const logado = !!getToken() && !!nome;

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

    document.getElementById("logout-btn")?.addEventListener("click", clearAuth);
  } else {
    headerUser.style.display = "none";
    headerAuth.style.display = "flex";
  }

  updateBadge();
}

// ============================================================
// 🚀 Inicialização global
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  updateBadge();
  updateUserHeader();
});

