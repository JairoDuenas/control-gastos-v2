// ── Tokens compartidos (no cambian con el tema) ────────────────────────────
const shared = {
  fonts: {
    head: "'Exo 2', sans-serif",
    body: "'DM Sans', sans-serif",
  },
  radii: { sm: "8px", md: "12px", lg: "18px", xl: "24px", full: "9999px" },
  sidebar: { width: "220px", collapsed: "64px" },
  header: { height: "64px" },
  footer: { height: "52px" },
  // Semánticos que no cambian con el tema
  accent: "#5b8dee",
  accentGlow: "rgba(91,141,238,0.18)",
  income: "#43e97b",
  incomeGlow: "rgba(67,233,123,0.15)",
  expense: "#ff5959",
  expenseGlow: "rgba(255,89,89,0.15)",
  pending: "#ffcb05",
  pendingGlow: "rgba(255,203,5,0.15)",
};

// ── Tema oscuro ────────────────────────────────────────────────────────────
export const darkTheme = {
  ...shared,
  mode: "dark",
  colors: {
    bg: "#0d0f1a",
    bgCard: "#13162a",
    bgCardHov: "#181c34",
    bgSidebar: "#0f1220",
    bgHeader: "#0f1220",
    border: "#1e2440",
    borderHov: "#2e3a60",
    accent: shared.accent,
    accentGlow: shared.accentGlow,
    income: shared.income,
    expense: shared.expense,
    pending: shared.pending,
    text1: "#edf0ff",
    text2: "#7b8db8",
    text3: "#3d4f72",
    inputBg: "rgba(255,255,255,0.04)",
    selectBg: "#13162a",
    shadow: "0 4px 20px rgba(0,0,0,0.45)",
    shadowHov: "0 12px 40px rgba(0,0,0,0.6)",
  },
  fonts: shared.fonts,
  radii: shared.radii,
  sidebar: shared.sidebar,
  header: shared.header,
  footer: shared.footer,
};

// ── Tema claro ─────────────────────────────────────────────────────────────
export const lightTheme = {
  ...shared,
  mode: "light",
  colors: {
    bg: "#f0f2f8",
    bgCard: "#ffffff",
    bgCardHov: "#f5f7ff",
    bgSidebar: "#ffffff",
    bgHeader: "#ffffff",
    border: "#dde1f0",
    borderHov: "#b0bcdd",
    accent: shared.accent,
    accentGlow: "rgba(91,141,238,0.12)",
    income: "#1db85a",
    expense: "#e03030",
    pending: "#c89000",
    text1: "#1a1f36",
    text2: "#4a5578",
    text3: "#8a95b8",
    inputBg: "rgba(0,0,0,0.03)",
    selectBg: "#ffffff",
    shadow: "0 4px 20px rgba(0,0,0,0.10)",
    shadowHov: "0 12px 40px rgba(0,0,0,0.16)",
  },
  fonts: shared.fonts,
  radii: shared.radii,
  sidebar: shared.sidebar,
  header: shared.header,
  footer: shared.footer,
};

// ── Colores para categorías (no cambian con el tema) ───────────────────────
export const CAT_COLORS = [
  "#5b8dee",
  "#43e97b",
  "#ff5959",
  "#ffcb05",
  "#a78bfa",
  "#f08030",
  "#f85888",
  "#78c850",
  "#98d8d8",
  "#f0b6bc",
];
