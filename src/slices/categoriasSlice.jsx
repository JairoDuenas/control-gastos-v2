import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCategoria,
  updateCategoria,
  deleteCategoria as deleteCategoriaDB,
} from "../services/categoriasService";

// ── Categorías default para modo Demo ─────────────────────────────────────
const DEFAULTS = [
  { id: "1", nombre: "Alimentación", icono: "🛒", color: "#43e97b" },
  { id: "2", nombre: "Transporte", icono: "🚗", color: "#5b8dee" },
  { id: "3", nombre: "Vivienda", icono: "🏠", color: "#a78bfa" },
  { id: "4", nombre: "Salud", icono: "💊", color: "#ff5959" },
  { id: "5", nombre: "Ocio", icono: "🎮", color: "#ffcb05" },
  { id: "6", nombre: "Ropa", icono: "👕", color: "#f08030" },
  { id: "7", nombre: "Educación", icono: "📚", color: "#78c850" },
  { id: "8", nombre: "Otros", icono: "📦", color: "#7b8db8" },
];

// ── localStorage (caché para ambos modos) ─────────────────────────────────
const LS_KEY = "gastos_categorias";

const DEMO_KEY = "gastos_demo_user";

const load = () => {
  try {
    const s = localStorage.getItem(LS_KEY);
    if (!s) {
      // Sin caché — si hay sesión Demo activa usar DEFAULTS, si no esperar sync
      const hasDemo = !!localStorage.getItem(DEMO_KEY);
      return hasDemo ? DEFAULTS : [];
    }
    const parsed = JSON.parse(s);
    // Si los ids son numéricos ("1","2"...) es caché Demo viejo
    // No lo usamos para usuarios Google (que no tienen gastos_demo_user)
    const hasNumericIds = parsed.some((c) => /^\d+$/.test(String(c.id)));
    const hasDemo = !!localStorage.getItem(DEMO_KEY);
    if (hasNumericIds && !hasDemo) return []; // Google user — esperar sync
    return parsed;
  } catch {
    return DEFAULTS;
  }
};

const save = (list) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
};

// ID temporal para optimistic update (solo Demo — Supabase devuelve UUID real)
const tempId = () => `temp_${Date.now()}`;

// ── Thunks async (solo se ejecutan en modo Google) ─────────────────────────

/**
 * Agrega una categoría.
 * Flujo optimista: inserta en Redux con id temporal → llama Supabase →
 * reemplaza el id temporal con el UUID real devuelto por Supabase.
 */
export const addCategoriaAsync = createAsyncThunk(
  "categorias/addAsync",
  async ({ userId, payload }, { dispatch, getState }) => {
    const tid = tempId();
    // 1. Optimistic insert en Redux
    dispatch(categoriasSlice.actions._addOptimistic({ ...payload, id: tid }));

    // 2. Persistir en Supabase
    const created = await createCategoria(userId, payload);
    if (!created) return; // error logueado en el servicio

    // 3. Reemplazar id temporal por UUID real
    dispatch(
      categoriasSlice.actions._replaceId({ tempId: tid, realId: created.id }),
    );
  },
);

export const editCategoriaAsync = createAsyncThunk(
  "categorias/editAsync",
  async ({ payload }, { dispatch }) => {
    dispatch(categoriasSlice.actions._edit(payload));
    await updateCategoria(payload.id, payload);
  },
);

export const deleteCategoriaAsync = createAsyncThunk(
  "categorias/deleteAsync",
  async ({ id }, { dispatch }) => {
    dispatch(categoriasSlice.actions._delete(id));
    await deleteCategoriaDB(id);
  },
);

// ── Slice ──────────────────────────────────────────────────────────────────
const categoriasSlice = createSlice({
  name: "categorias",
  initialState: {
    list: load(),
    synced: false, // true una vez que useSyncData cargó desde Supabase
  },
  reducers: {
    // Llamado por useSyncData al arrancar con usuario Google
    setCategorias: (state, action) => {
      state.list = action.payload;
      state.synced = true;
      save(state.list);
    },

    // ── Reducers síncronos internos (usados por thunks y modo Demo) ───

    // Demo: agrega con id string incremental; Google: thunk usa _addOptimistic
    addCategoria: (state, action) => {
      const maxNum = state.list.reduce((max, c) => {
        const n = parseInt(c.id);
        return isNaN(n) ? max : Math.max(max, n);
      }, 0);
      const item = { ...action.payload, id: String(maxNum + 1) };
      state.list.push(item);
      save(state.list);
    },

    editCategoria: (state, action) => {
      const idx = state.list.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.list[idx] = action.payload;
        save(state.list);
      }
    },

    deleteCategoria: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
      save(state.list);
    },

    // Internos para thunks async (optimistic)
    _addOptimistic: (state, action) => {
      state.list.push(action.payload);
      save(state.list);
    },
    _replaceId: (state, action) => {
      const { tempId, realId } = action.payload;
      const idx = state.list.findIndex((c) => c.id === tempId);
      if (idx >= 0) {
        state.list[idx].id = realId;
        save(state.list);
      }
    },
    _edit: (state, action) => {
      const idx = state.list.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.list[idx] = action.payload;
        save(state.list);
      }
    },
    _delete: (state, action) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
      save(state.list);
    },
  },
});

export const { setCategorias, addCategoria, editCategoria, deleteCategoria } =
  categoriasSlice.actions;

export default categoriasSlice.reducer;
