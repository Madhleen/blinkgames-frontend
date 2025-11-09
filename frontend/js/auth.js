// ============================================================
// 🔐 BlinkGames — auth.js (v7.8 Produção Corrigido DOM + Debug)
// ============================================================

import { mountHeader } from "./header.js";
import { setToken, setUser } from "./state.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ auth.js carregado — aguardando formulários...");
  mountHeader();

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // 🔢 Limpa CPF
  function onlyDigits(s) {
    return (s || "").replace(/\D/g, "");
  }

  // ============================================================
  // LOGIN
  // ============================================================
  if (loginForm) {
    console.log("📩 Formulário de login detectado.");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.querySelector("#email")?.value.trim();
      const senha = document.querySelector("#password")?.value.trim();

      if (!email || !senha) {
        alert("⚠️ Preencha todos os campos.");
        return;
      }

      console.log("🔄 Enviando login para API...");

      try {
        const res = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, senha }),
        });

        const data = await res.json();
        console.log("📦 Resposta login:", data);

        if (!res.ok) throw new Error(data.error || data.message || "Falha no login.");

        if (data.token) {
          setToken(data.token);
          setUser(data.user || { nome: "Usuário", email });
          alert("✅ Login realizado com sucesso!");
          window.location.href = "index.html";
        }
      } catch (err) {
        console.error("❌ Erro ao logar:", err);
        alert(err.message || "Erro ao efetuar login.");
      }
    });
  } else {
    console.warn("⚠️ Nenhum formulário de login encontrado.");
  }

  // ============================================================
  // REGISTRO
  // ============================================================
  if (registerForm) {
    console.log("🧾 Formulário de registro detectado.");
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.querySelector("#rname")?.value.trim();
      const email = document.querySelector("#remail")?.value.trim();
      const cpf = onlyDigits(document.querySelector("#rcpf")?.value);
      const senha = document.querySelector("#rpassword")?.value.trim();
      const confirm = document.querySelector("#rconfirm")?.value.trim();

      if (!nome || !email || !cpf || !senha || !confirm) {
        alert("⚠️ Todos os campos são obrigatórios.");
        return;
      }

      if (senha !== confirm) {
        alert("⚠️ As senhas não conferem!");
        return;
      }

      console.log("🚀 Enviando registro para API...");

      try {
        const res = await fetch("https://blinkgames-backend-p4as.onrender.com/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, email, cpf, senha }),
        });

        const data = await res.json();
        console.log("📦 Resposta registro:", data);

        if (!res.ok) throw new Error(data.error || data.message || "Erro ao criar conta.");

        alert("🎉 Conta criada com sucesso!");

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
});

