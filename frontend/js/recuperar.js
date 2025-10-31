// ============================================================
// ✉️ BlinkGames — recuperar.js (v2.0)
// ============================================================

const form = document.getElementById("recover-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("recoverEmail").value.trim();

  if (!email) {
    alert("Por favor, informe o e-mail cadastrado!");
    return;
  }

  try {
    // 🔹 Usa a rota /api/auth/forgot (correta)
    const res = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao enviar e-mail.");

    alert("📩 Link de recuperação enviado! Verifique seu e-mail.");
    window.location.href = "conta.html"; // 🔹 volta pra conta.html
  } catch (err) {
    console.error("❌ Erro:", err);
    alert("Erro: " + err.message);
  }
});

