// BlinkGames — utils.js
// Funções utilitárias globais reutilizáveis no front

// ======= Validação =======

// Valida CPF (com dígitos verificadores)
export function validarCPF(cpf) {
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

// ======= Formatação =======

// Formata CPF para 000.000.000-00
export function formatarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Formata telefone (com ou sem DDD)
export function formatarTelefone(tel) {
  tel = tel.replace(/[^\d]/g, '');
  if (tel.length === 11)
    return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  if (tel.length === 10)
    return tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  return tel;
}

// ======= Geração de números =======

// Gera lista de números únicos aleatórios (ex: rifas)
export function gerarNumerosUnicos(qtd, max = 10000) {
  const numeros = new Set();
  while (numeros.size < qtd) {
    numeros.add(Math.floor(Math.random() * max));
  }
  return [...numeros];
}

// ======= Datas =======

// Converte data ISO pra formato brasileiro (dd/mm/aaaa)
export function formatarDataBR(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR');
}

// Retorna diferença em minutos entre duas datas
export function diffMinutos(data1, data2) {
  const ms = Math.abs(new Date(data2) - new Date(data1));
  return Math.floor(ms / 60000);
}

// ======= Outros =======

// Debounce (evita múltiplas execuções seguidas)
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Mostra mensagem temporária na tela (toast simples)
export function showToast(msg, color = '#00F0FF') {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.position = 'fixed';
    el.style.bottom = '30px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '10px 20px';
    el.style.background = color;
    el.style.color = '#0a0015';
    el.style.fontWeight = 'bold';
    el.style.borderRadius = '12px';
    el.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
    el.style.transition = 'opacity 0.4s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = 1;
  setTimeout(() => (el.style.opacity = 0), 3000);
}
