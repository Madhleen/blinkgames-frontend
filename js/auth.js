// BlinkGames — auth.js
// Controle de login, cadastro e redefinição de senha

import { AuthAPI } from './api.js';
import { updateCartBadge } from './app.js';

// ===== UTILITÁRIOS =====
function showMessage(el, msg, color = '#FF00AA') {
  el.textContent = msg;
  el.style.color = color;
  el.hidden = false;
  setTimeout(() => (el.hidden = true), 4000);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.substring(10, 11));
}

// ===== LOGIN =====
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    const res = await AuthAPI.login({ email, senha: password });
    if (res.token) {
      localStorage.setItem('blink_token', res.token);
      window.location.href = '/rifas.html';
    } else {
      alert('Email ou senha incorretos.');
    }
  });
}

// ===== CADASTRO =====
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('register-nome').value.trim();
    const cpf = document.getElementById('register-cpf').value.trim();
    const telefone = document.getElementById('register-telefone').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const senha = document.getElementById('register-password').value.trim();

    if (!validarCPF(cpf)) {
      alert('CPF inválido. Verifique e tente novamente.');
      return;
    }

    const res = await AuthAPI.register({ nome, cpf, telefone, email, senha });
    if (res && !res.error) {
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      document.getElementById('tab-login').click();
    } else {
      alert('Erro ao cadastrar. Tente novamente.');
    }
  });
}

// ===== TOGGLE LOGIN / CADASTRO =====
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
if (tabLogin && tabRegister) {
  const loginFormEl = document.getElementById('login-form');
  const registerFormEl = document.getElementById('register-form');

  tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginFormEl.classList.add('active');
    registerFormEl.classList.remove('active');
  });

  tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerFormEl.classList.add('active');
    loginFormEl.classList.remove('active');
  });
}

// ===== RESET DE SENHA =====
const resetForm = document.getElementById('reset-form');
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('reset-message');
    const newPass = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
      showMessage(msg, 'Token inválido ou expirado.');
      return;
    }
    if (newPass !== confirm) {
      showMessage(msg, 'As senhas não conferem.');
      return;
    }

    const res = await AuthAPI.reset(token, newPass);
    if (res && !res.error) {
      showMessage(msg, 'Senha redefinida com sucesso!', '#00FF88');
      setTimeout(() => (window.location.href = '/conta.html'), 2000);
    } else {
      showMessage(msg, 'Erro ao redefinir senha.');
    }
  });
}

updateCartBadge();
