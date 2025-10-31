// ============================================================
// 👤 BlinkGames — cadastro.js
// ============================================================
const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("As senhas não coincidem!");
    return;
  }

  try {
    const response = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao criar conta");
    }

    alert("Conta criada com sucesso! Faça login para continuar.");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("Erro: " + err.message);
  }
});


