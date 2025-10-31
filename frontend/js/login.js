// ============================================================
// 🔐 BlinkGames — login.js
// ============================================================
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Preencha todos os campos!");
    return;
  }

  try {
    const res = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Falha ao fazer login.");
      return;
    }

    // 🔹 Salva o token e redireciona
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "/index.html";
  } catch (err) {
    console.error("❌ Erro no login:", err);
    alert("Erro ao conectar ao servidor.");
  }
});

