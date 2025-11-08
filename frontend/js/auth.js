// ============================================================
// 👤 BlinkGames — auth.js (v4.5 CORRIGIDO FINAL)
// ============================================================

import { mountHeader } from "./header.js";
import { AuthAPI } from "./api.js";
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
    const password = passInput?.value?.trim() || "";

    if (!email || !password) {
      alert("⚠️ Preencha todos os campos.");
      return;
    }

    try {
      const res = await AuthAPI.login(email, password);

      if (res?.token) {
        setToken(res.token);
        setUser(res.user || { email });

        alert("✅ Login realizado com sucesso!");

        const redirect = localStorage.getItem("redirectAfterLogin");
        localStorage.removeItem("redirectAfterLogin");

        window.location.href = redirect || "index.html";
      } else {
        alert(res.message || "Falha no login. Verifique suas credenciais.");
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
    const password = document.getElementById("rpassword")?.value?.trim() || "";
    const confirm = document.getElementById("rconfirm")?.value?.trim() || "";

    if (!nome || !email || !cpf || !password || !confirm) {
      alert("⚠️ Todos os campos são obrigatórios.");
      return;
    }

    if (password !== confirm) {
      alert("⚠️ As senhas não conferem!");
      return;
    }

    const payload = { nome, email, cpf, password };

    try {
      const res = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/register", {
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

