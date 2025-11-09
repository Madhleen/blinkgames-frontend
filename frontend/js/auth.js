// ============================================================
// 👤 BlinkGames — auth.js (v5.1 — usa BASE do api.js)
// ============================================================

import { mountHeader } from "./header.js";
import { setToken, setUser } from "./state.js";
import { request } from "./api.js"; // 👈 usa a mesma BASE do projeto

mountHeader();

// Utilitário
function onlyDigits(s) {
  return (s || "").replace(/\D/g, "");
}

// LOGIN
const login = document.getElementById("login-form");
if (login) {
  login.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email")?.value?.trim() || "";
    const password = document.getElementById("password")?.value?.trim() || "";

    if (!email || !password) return alert("⚠️ Preencha todos os campos.");

    try {
      const data = await request("/api/auth/login", "POST", { email, password });
      if (data?.token) {
        setToken(data.token);
        setUser(data.user || { email });
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

// REGISTRO
const register = document.getElementById("register-form");
if (register) {
  register.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("rname")?.value?.trim() || "";
    const email = document.getElementById("remail")?.value?.trim() || "";
    const cpf = onlyDigits(document.getElementById("rcpf")?.value);
    const password = document.getElementById("rpassword")?.value?.trim() || "";
    const confirm  = document.getElementById("rconfirm")?.value?.trim() || "";

    if (!nome || !email || !cpf || !password || !confirm) {
      alert("⚠️ Todos os campos são obrigatórios.");
      return;
    }
    if (password !== confirm) return alert("⚠️ As senhas não conferem!");

    try {
      const data = await request("/api/auth/register", "POST", { nome, email, cpf, password });
      if (data?.token) {
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

