
import { mountHeader } from './header.js';
import { AuthAPI } from './api.js';
import { setToken } from './state.js';
mountHeader();

const login = document.getElementById('login-form');
const register = document.getElementById('register-form');

if(login){
  login.addEventListener('submit', async e=>{
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const res = await AuthAPI.login(email, password);
    if(res && res.token){ setToken(res.token); alert('Bem-vindo!'); location.href='index.html'; }
    else alert('Falha no login.');
  });
}

if(register){
  register.addEventListener('submit', async e=>{
    e.preventDefault();
    const payload = {
      nome: document.getElementById('rname').value.trim(),
      email: document.getElementById('remail').value.trim(),
      password: document.getElementById('rpassword').value.trim(),
      cpf: document.getElementById('rcpf').value.replace(/\D/g,'')
    };
    const res = await AuthAPI.register(payload);
    if(res && (res.token || res._id)){ alert('Conta criada! Faça login.'); location.href='conta.html'; }
    else alert('Falha no cadastro.');
  });
}
