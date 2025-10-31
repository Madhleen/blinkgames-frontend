// ============================================================
// 👤 BlinkGames — auth.js (v4.0 FINAL)
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

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await AuthAPI.login(email, password);

      if (res && res.token) {
        setToken(res.token);
        setUser(res.user || { email });

        alert("✅ Login realizado com sucesso!");

        // 🔁 Verifica se há redirecionamento pendente (ex: veio do carrinho)
        const redirect = localStorage.getItem("redirectAfterLogin");
        if (redirect) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirect;
        } else {
          window.location.href = "index.html";
        }
      } else {
        alert("Falha no login. Verifique suas credenciais.");
      }
    } catch (err) {
      alert(err.message || "Erro ao efetuar login.");
    }
  });
}

// ============================================================
// 🧾 REGISTRO
// ============================================================
const register = document.getElementById("register-form");
if (register) {
  register.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("rname").value.trim();
    const email = document.getElementById("remail").value.trim();
    const cpf = onlyDigits(document.getElementById("rcpf").value);
    const password = document.getElementById("rpassword").value.trim();
    const confirm = document.getElementById("rconfirm").value.trim();

    if (password !== confirm) {
      alert("⚠️ As senhas não conferem!");
      return;
    }

    const payload = { nome, email, cpf, password };

    try {
      const res = await AuthAPI.register(payload);

      if (res && res.token) {
        setToken(res.token);
        setUser(res.user || { nome, email });

        alert("🎉 Conta criada com sucesso!");

        // 🔁 Redireciona se veio do carrinho
        const redirect = localStorage.getItem("redirectAfterLogin");
        if (redirect) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirect;
        } else {
          window.location.href = "index.html";
        }
      } else {
        alert("Erro ao criar conta. Tente novamente.");
      }
    } catch (err) {
      alert(err.message || "Erro no cadastro.");
    }
  });
}

