// ============================================================
// 🎟️ BlinkGames — minhas-rifas.js (v6.0 — só pedidos aprovados, usando order.cart)
// ============================================================

import { getToken, BRL } from "./state.js";
import { mountHeader } from "./header.js";
import { OrdersAPI } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  mountHeader();
  const rifaList = document.getElementById("rifaList");
  const token = getToken();

  if (!token) {
    rifaList.innerHTML = `
      <div class="panel" style="text-align:center; opacity:.85;">
        <p>⚠️ Você precisa estar logado para visualizar suas rifas.</p>
        <a href="conta.html" class="btn" style="margin-top:10px;">Fazer login</a>
      </div>
    `;
    return;
  }

  try {
    let orders = await OrdersAPI.getMyOrders(token);
    console.log("📦 Compras recebidas (todas):", orders);

    if (!orders || !orders.length) {
      rifaList.innerHTML = `<p style="opacity:.8;">Você ainda não possui rifas compradas.</p>`;
      return;
    }

    // 🔥 Só quero pedidos APROVADOS (pagos de verdade)
    orders = orders.filter((o) => o.status === "approved");

    if (!orders.length) {
      rifaList.innerHTML = `<p style="opacity:.8;">Você ainda não possui rifas aprovadas.</p>`;
      return;
    }

    // Mais recente primeiro
    orders = orders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    rifaList.innerHTML = orders
      .map((order) => {
        const items = order.cart && order.cart.length
          ? order.cart
          : (order.itens || []);

        const primeiroItem = items[0] || {};

        const titulo =
          primeiroItem.title ||
          primeiroItem.titulo ||
          "Rifa BlinkGames";

        const numeros =
          items
            .flatMap((i) => i.numeros || i.numbers || [])
            .join(", ") || "Nenhum número registrado.";

        const statusColor = "#0f0"; // aqui sempre approved

        return `
        <li class="panel" style="margin-bottom: 14px;">
          <strong>🎮 ${titulo}</strong><br>

          <small>Status:
            <strong style="color:${statusColor};">
              ${order.status}
            </strong>
          </small><br>

          <small>Pagamento:
            <span style="color:var(--accent-2);">
              ${order.mpPaymentId || order.paymentId || "—"}
            </span>
          </small><br>

          <small>Valor: <strong>${BRL(order.total || 0)}</strong></small><br>

          <small>Data: ${
            order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("pt-BR")
              : "-"
          }</small>

          <p style="margin-top:8px;">
            <strong>Números:</strong><br>
            ${numeros}
          </p>
        </li>
      `;
      })
      .join("");
  } catch (err) {
    console.error("❌ Erro ao carregar rifas:", err);
    rifaList.innerHTML = `
      <div class="panel" style="text-align:center;opacity:.8;">
        <p>❌ Erro ao carregar suas rifas. Tente novamente mais tarde.</p>
      </div>
    `;
  }
});

