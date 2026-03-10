import { createSlice } from "@reduxjs/toolkit";

const load = () => {
  try {
    const s = localStorage.getItem("gastos_movimientos");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const save = (list) => {
  try {
    localStorage.setItem("gastos_movimientos", JSON.stringify(list));
  } catch {}
};

const nextId = (list) =>
  list.length ? Math.max(...list.map((m) => m.id)) + 1 : 1;

const calcTotales = (list) => {
  const total = list.reduce((a, m) => a + m.monto, 0);
  const pagados = list
    .filter((m) => m.estado === 1)
    .reduce((a, m) => a + m.monto, 0);
  const pendientes = list
    .filter((m) => m.estado === 0)
    .reduce((a, m) => a + m.monto, 0);
  return { total, pagados, pendientes };
};

const movimientosSlice = createSlice({
  name: "movimientos",
  initialState: {
    list: load(),
    filtered: load(),
    filtros: {
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      categoriaId: null,
      texto: "",
    },
    ...calcTotales(load()),
  },
  reducers: {
    addMovimiento: (state, action) => {
      const item = {
        ...action.payload,
        id: nextId(state.list),
        fecha: action.payload.fecha || new Date().toISOString(),
      };
      state.list.push(item);
      save(state.list);
      movimientosSlice.caseReducers._applyFilter(state);
    },
    editMovimiento: (state, action) => {
      const idx = state.list.findIndex((m) => m.id === action.payload.id);
      if (idx >= 0) {
        state.list[idx] = action.payload;
        save(state.list);
      }
      movimientosSlice.caseReducers._applyFilter(state);
    },
    deleteMovimiento: (state, action) => {
      state.list = state.list.filter((m) => m.id !== action.payload);
      save(state.list);
      movimientosSlice.caseReducers._applyFilter(state);
    },
    toggleEstado: (state, action) => {
      const idx = state.list.findIndex((m) => m.id === action.payload);
      if (idx >= 0) {
        state.list[idx].estado = state.list[idx].estado === 1 ? 0 : 1;
        save(state.list);
      }
      movimientosSlice.caseReducers._applyFilter(state);
    },
    setFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
      movimientosSlice.caseReducers._applyFilter(state);
    },
    // Reducer interno — aplica filtros y recalcula totales
    _applyFilter: (state) => {
      const { mes, anio, categoriaId, texto } = state.filtros;
      let result = state.list;
      if (mes)
        result = result.filter((m) => new Date(m.fecha).getMonth() + 1 === mes);
      if (anio)
        result = result.filter((m) => new Date(m.fecha).getFullYear() === anio);
      if (categoriaId)
        result = result.filter((m) => m.categoriaId === categoriaId);
      if (texto)
        result = result.filter((m) =>
          m.descripcion.toLowerCase().includes(texto.toLowerCase()),
        );
      state.filtered = result;
      const t = calcTotales(result);
      state.total = t.total;
      state.pagados = t.pagados;
      state.pendientes = t.pendientes;
    },
  },
});

export const {
  addMovimiento,
  editMovimiento,
  deleteMovimiento,
  toggleEstado,
  setFiltros,
} = movimientosSlice.actions;
export default movimientosSlice.reducer;
