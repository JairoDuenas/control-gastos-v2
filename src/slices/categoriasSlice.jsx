import { createSlice } from "@reduxjs/toolkit";

const DEFAULTS = [
  { id: 1, nombre: "Alimentación", icono: "🛒", color: "#43e97b" },
  { id: 2, nombre: "Transporte", icono: "🚗", color: "#5b8dee" },
  { id: 3, nombre: "Vivienda", icono: "🏠", color: "#a78bfa" },
  { id: 4, nombre: "Salud", icono: "💊", color: "#ff5959" },
  { id: 5, nombre: "Ocio", icono: "🎮", color: "#ffcb05" },
  { id: 6, nombre: "Ropa", icono: "👕", color: "#f08030" },
  { id: 7, nombre: "Educación", icono: "📚", color: "#78c850" },
  { id: 8, nombre: "Otros", icono: "📦", color: "#7b8db8" },
];

const load = () => {
  try {
    const s = localStorage.getItem("gastos_categorias");
    return s ? JSON.parse(s) : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
};

const save = (list) => {
  try {
    localStorage.setItem("gastos_categorias", JSON.stringify(list));
  } catch {}
};

const nextId = (list) =>
  list.length ? Math.max(...list.map((c) => c.id)) + 1 : 1;

const categoriasSlice = createSlice({
  name: "categorias",
  initialState: { list: load() },
  reducers: {
    addCategoria: (state, action) => {
      const item = { ...action.payload, id: nextId(state.list) };
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
  },
});

export const { addCategoria, editCategoria, deleteCategoria } =
  categoriasSlice.actions;
export default categoriasSlice.reducer;
