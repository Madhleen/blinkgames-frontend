// BlinkGames — ui.js
// Interações visuais e UX (carrossel, animações, botões, etc)

import { updateCartBadge } from './app.js';

// ===== ANIMAÇÃO DE ENTRADA =====
document.addEventListener('DOMContentLoaded', () => {
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 * i);
  });
});

// ===== CARROSSEL DE RIFAS (HOME) =====
const carousel = document.querySelector('.carousel');
if (carousel) {
  const slides = carousel.querySelectorAll('.slide');
  const next = document.getElementById('next-slide');
  const prev = document.getElementById('prev-slide');
  let current = 0;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
  }

  next?.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    showSlide(current);
  });

  prev?.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
  });

  // Swipe no mobile
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX));
  carousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) prev.click();
    if (diff < -50) next.click();
  });

  showSlide(0);
}

// ===== BOTÃO VOLTAR AO TOPO =====
const btnTop = document.getElementById('btn-top');
if (btnTop) {
  window.addEventListener('scroll', () => {
    btnTop.style.opacity = window.scrollY > 400 ? '1' : '0';
  });
  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== HOVER NEON SUAVE =====
document.querySelectorAll('.btn-primary, .card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.filter = 'drop-shadow(0 0 8px rgba(255,0,200,0.6))';
  });
  el.addEventListener('mouseleave', () => {
    el.style.filter = 'none';
  });
});

updateCartBadge();
