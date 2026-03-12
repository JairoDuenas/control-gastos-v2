import { createSlice } from "@reduxjs/toolkit";

// ── Persistencia del modo Demo ──────────────────────────────────────────────
// El usuario Demo no tiene sesión en Supabase, así que usamos localStorage
// con una clave separada para distinguirlo del usuario real.
const DEMO_KEY = "gastos_demo_user";

const loadDemo = () => {
  try {
    const s = localStorage.getItem(DEMO_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const saveDemo = (user) => localStorage.setItem(DEMO_KEY, JSON.stringify(user));
const clearDemo = () => localStorage.removeItem(DEMO_KEY);

// ── Estado inicial ──────────────────────────────────────────────────────────
// Si hay un usuario Demo guardado, arrancamos logueados y sin loading.
// Si no, arrancamos en loading=true y esperamos a que AuthProvider
// verifique si hay sesión activa en Supabase.
const storedDemo = loadDemo();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedDemo ?? null, // { nombre, email, moneda } | { id, ... }
    isLoggedIn: !!storedDemo,
    loading: !storedDemo, // false si ya hay sesión Demo, true si hay que verificar Supabase
    error: null,
    isDemo: !!storedDemo,
  },
  reducers: {
    // ── Supabase: sesión confirmada por AuthProvider ─────────────────────
    setUser: (state, action) => {
      state.user = action.payload; // null = sin sesión
      state.isLoggedIn = !!action.payload;
      state.loading = false;
      state.error = null;
      state.isDemo = false;
      // Si Supabase cierra sesión, limpiar también cualquier Demo residual
      if (!action.payload) clearDemo();
    },

    // ── Spinner: AuthProvider terminó de verificar, sin sesión ──────────
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ── Error de OAuth ───────────────────────────────────────────────────
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ── Demo: login directo sin Supabase ─────────────────────────────────
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.loading = false;
      state.error = null;
      state.isDemo = true;
      saveDemo(action.payload); // persiste entre refreshes
    },

    // ── Logout: funciona para Demo y para Supabase ───────────────────────
    // Para Supabase, ConfigPage llama supabase.auth.signOut() primero;
    // el listener onAuthStateChange dispara setUser(null) automáticamente.
    // Para Demo, ConfigPage despacha logout() directamente.
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.isDemo = false;
      clearDemo();
    },

    // ── Actualización de perfil ──────────────────────────────────────────
    updateUser: (state, action) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      if (state.isDemo) saveDemo(state.user); // persistir cambios Demo
    },
  },
});

export const { setUser, setLoading, setAuthError, login, logout, updateUser } =
  authSlice.actions;

export default authSlice.reducer;
