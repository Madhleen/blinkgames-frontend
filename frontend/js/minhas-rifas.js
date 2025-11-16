// ============================================================
// 🎟️ BlinkGames — minhas-rifas.js (v4.0 — FIX TOTAL Backend v10)
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
    const orders = await OrdersAPI.getMyOrders(token);
    console.log("📦 Compras recebidas:", orders);

    if (!orders || !orders.length) {
      rifaList.innerHTML = `<p style="opacity:.8;">Você ainda não possui rifas compradas.</p>`;
      return;
    }

    // ============================================================
    // 🔥 AQUI ESTAVA O BUG!!!
    // order.items → NÃO EXISTE
    // Backend usa: order.itens
    // ============================================================

    rifaList.innerHTML = orders
      .map((order) => {
        const primeiroItem = order.itens?.[0];

        return `
        <li class="panel" style="margin-bottom: 14px;">
          <strong>🎮 ${primeiroItem?.titulo || "Rifa BlinkGames"}</strong><br>

          <small>Status:
            <strong style="color:${order.status === "approved" ? "#0f0" : "#ffde59"};">
              ${order.status}
            </strong>
          </small><br>

          <small>Pagamento:
            <span style="color:var(--accent-2);">
              ${order.paymentId || "—"}
            </span>
          </small><br>

          <small>Valor: <strong>${BRL(order.total || 0)}</strong></small><br>

          <small>Data: ${new Date(order.createdAt).toLocaleDateString("pt-BR")}</small>

          <p style="margin-top:8px;">
            <strong>Números:</strong><br>
            ${
              order.itens
                ?.flatMap((i) => i.numeros || [])
                .join(", ") || "Nenhum número registrado."
            }
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

