// ============================================================
// 👤 BlinkGames — auth.js (v5.0 Produção Corrigido)
// ============================================================

import { mountHeader } from "./header.js";
import { setToken, setUser } from "./state.js";

mountHeader();

// ============================================================
// 🔢 Utilitário — limpa CPF
// ============================================================
function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}

// ============================================================
// 🔐 LOGIN
// ============================================================
const login = document.getElementById("login-form");
if (login) {
  login.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const passInput = document.getElementById("password");

    const email = emailInput?.value?.trim() || "";
    const senha = passInput?.value?.trim() || ""; // ✅ nome compatível com backend

    if (!email || !senha) {
      alert("⚠️ Preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch("https://blinkgames-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }), // ✅ campo correto
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Falha no login.");
      }

      if (data?.token) {
        setToken(data.token);
        setUser(data.user || { email });
        alert("✅ Login realizado com sucesso!");

        const redirect = localStorage.getItem("redirectAfterLogin");
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirect || "index.html";
      } else {
        alert("Falha no login. Verifique suas credenciais.");
      }
    } catch (err) {
      console.error("❌ Erro ao logar:", err);
      alert(err.message || "Erro ao efetuar login.");
    }
  });
}

// ============================================================
// 🧾 REGISTRO — Cria conta e faz login automático
// ============================================================
const register = document.getElementById("register-form");
if (register) {
  register.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("rname")?.value?.trim() || "";
    const email = document.getElementById("remail")?.value?.trim() || "";
    const cpf = onlyDigits(document.getElementById("rcpf")?.value);
    const senha = document.getElementById("rpassword")?.value?.trim() || "";
    const confirm = document.getElementById("rconfirm")?.value?.trim() || "";

    if (!nome || !email || !cpf || !senha || !confirm) {
      alert("⚠️ Todos os campos são obrigatórios.");
      return;
    }

    if (senha !== confirm) {
      alert("⚠️ As senhas não conferem!");
      return;
    }

    const payload = { nome, email, cpf, senha };

    try {
      const res = await fetch("https://blinkgames-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || "Erro ao criar conta.");

      alert("🎉 Conta criada com sucesso! Entrando...");

      if (data.token) {
        setToken(data.token);
        setUser(data.user || { nome, email });
      }

      window.location.href = "index.html";
    } catch (err) {
      console.error("❌ Erro no registro:", err);
      alert(err.message || "Erro ao criar conta.");
    }
  });
}

