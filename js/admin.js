// BlinkGames — admin.js
// Painel administrativo (dashboard, rifas, usuários, pagamentos)

import { AdminAPI } from './api.js';
import { formatarDataBR, showToast } from './utils.js';
import { updateCartBadge } from './app.js';

// ===== Autenticação =====
const token = localStorage.getItem('blink_token');
const adminKey = new URLSearchParams(window.location.search).get('key');

if (!token && !adminKey) {
  alert('Acesso restrito. Faça login como admin ou use a chave de acesso.');
  window.location.href = '/conta.html';
}

// ===== Elementos =====
const tabDashboard = document.getElementById('tab-dashboard');
const tabRifas = document.getElementById('tab-rifas');
const tabUsuarios = document.getElementById('tab-usuarios');
const tabPagamentos = document.getElementById('tab-pagamentos');

const sectionDashboard = document.getElementById('section-dashboard');
const sectionRifas = document.getElementById('section-rifas');
const sectionUsuarios = document.getElementById('section-usuarios');
const sectionPagamentos = document.getElementById('section-pagamentos');

// ===== Controle de Abas =====
function showSection(section) {
  [sectionDashboard, sectionRifas, sectionUsuarios, sectionPagamentos].forEach(s => s.classList.add('hidden'));
  section.classList.remove('hidden');
}

tabDashboard?.addEventListener('click', () => showSection(sectionDashboard));
tabRifas?.addEventListener('click', () => showSection(sectionRifas));
tabUsuarios?.addEventListener('click', () => showSection(sectionUsuarios));
tabPagamentos?.addEventListener('click', () => showSection(sectionPagamentos));

// ===== Dashboard =====
async function loadDashboard() {
  try {
    const users = await AdminAPI.users(token);
    const payments = await AdminAPI.payments(token);
    const rifas = await AdminAPI.raffles(token);

    document.getElementById('count-users').textContent = users.length;
    document.getElementById('count-payments').textContent = payments.length;
    document.getElementById('count-rifas').textContent = rifas.length;

    const receita = payments
      .filter(p => p.status === 'approved')
      .reduce((acc, p) => acc + (p.total || 0), 0);

    document.getElementById('count-revenue').textContent = `R$ ${receita.toFixed(2)}`;
  } catch (err) {
    console.error(err);
    showToast('Erro ao carregar dashboard', '#FF00AA');
  }
}

// ===== Rifas =====
async function loadRifas() {
  const list = document.getElementById('admin-rifas-list');
  list.innerHTML = '<p>Carregando rifas...</p>';

  const rifas = await AdminAPI.raffles(token);
  if (!rifas || rifas.error) {
    list.innerHTML = '<p>Erro ao carregar rifas.</p>';
    return;
  }

  list.innerHTML = rifas
    .map(r => `
      <div class="admin-card">
        <h3>${r.titulo}</h3>
        <p>Preço: R$ ${r.preco.toFixed(2)}</p>
        <p>Data: ${formatarDataBR(r.dataSorteio)}</p>
        <p>Vendidos: ${r.numerosVendidos.length}/${r.maxNumeros}</p>
        <p>Status: <strong>${r.ativo ? 'Ativa' : 'Inativa'}</strong></p>
      </div>
    `)
    .join('');
}

// ===== Usuários =====
async function loadUsuarios() {
  const list = document.getElementById('admin-usuarios-list');
  list.innerHTML = '<p>Carregando usuários...</p>';

  const res = await AdminAPI.users(token);
  if (!res || res.error) {
    list.innerHTML = '<p>Erro ao carregar usuários.</p>';
    return;
  }

  list.innerHTML = res
    .map(u => `
      <div class="admin-card">
        <h3>${u.nome}</h3>
        <p>CPF: ${u.cpf}</p>
        <p>Email: ${u.email}</p>
        <p>Compras: ${u.purchases?.length || 0}</p>
      </div>
    `)
    .join('');
}

// ===== Pagamentos =====
async function loadPagamentos() {
  const list = document.getElementById('admin-pagamentos-list');
  list.innerHTML = '<p>Carregando pagamentos...</p>';

  const res = await AdminAPI.payments(token);
  if (!res || res.error) {
    list.innerHTML = '<p>Erro ao carregar pagamentos.</p>';
    return;
  }

  list.innerHTML = res
    .map(p => `
      <div class="admin-card">
        <h3>Usuário: ${p.user?.email || '—'}</h3>
        <p>Status: <strong>${p.status}</strong></p>
        <p>Valor: R$ ${p.total?.toFixed(2)}</p>
        <p>Data: ${formatarDataBR(p.createdAt)}</p>
      </div>
    `)
    .join('');
}

// ===== Inicialização =====
window.addEventListener('load', () => {
  showSection(sectionDashboard);
  loadDashboard();
  loadRifas();
  loadUsuarios();
  loadPagamentos();
  updateCartBadge();
});
