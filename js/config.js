// ============================================================
// ⚙️ BlinkGames — config.js
// Configurações globais de frontend (Vercel + Local)
// ============================================================

// 🖥️ Endereço do backend (Render, dinâmico via .env ou fallback padrão)
export const BACKEND =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || // remove barra final se existir
  "https://blinkgames-backend-p4as.onrender.com"; // fallback seguro

// 🎨 Paleta de cores (para reutilizar em JS/CSS dinâmico)
export const COLORS = {
  accent: "#00F0FF",
  magenta: "#FF00AA",
  purple: "#7C3AED",
  orange: "#FF6A00",
  yellow: "#FFDE59",
};

// 🧠 Debug global (ativa logs no console)
export const DEBUG = true;

if (DEBUG) console.log("[BlinkGames] Config carregada →", BACKEND);

