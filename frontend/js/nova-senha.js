// ============================================================
// 🔐 BlinkGames — nova-senha.js
// ============================================================

// Lê o token da URL (?token=xyz)
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

// Se não tiver token, bloqueia a página
if (!token) {
  alert("Link inválido ou expirado.");
  window.location.href = "login.html";
}

const form = document.getElementById("resetForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPassword = document.getElementById("newPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!newPassword || !confirmPassword) {
    alert("Preencha todos os campos!");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const res = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erro ao redefinir senha.");

    alert("✅ Senha redefinida com sucesso!");
    window.location.href = "login.html";
  } catch (err) {
    console.error("❌ Erro ao redefinir senha:", err);
    alert("Erro: " + err.message);
  }
});

