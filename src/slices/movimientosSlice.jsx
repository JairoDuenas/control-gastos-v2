import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createMovimiento,
  updateMovimiento,
  deleteMovimiento as deleteMovimientoDB,
  toggleMovimientoEstado,
} from "../services/MovimientosService";

// ── localStorage ───────────────────────────────────────────────────────────
const LS_KEY = "gastos_movimientos";

const load = () => {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

const save = (list) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
};

const tempId = () => `temp_${Date.now()}`;

// ── Totales ────────────────────────────────────────────────────────────────
const calcTotales = (list) => ({
  total: list.reduce((a, m) => a + m.monto, 0),
  pagados: list.filter((m) => m.estado === 1).reduce((a, m) => a + m.monto, 0),
  pendientes: list
    .filter((m) => m.estado === 0)
    .reduce((a, m) => a + m.monto, 0),
});

// ── Thunks async ───────────────────────────────────────────────────────────

export const addMovimientoAsync = createAsyncThunk(
  "movimientos/addAsync",
  async ({ userId, payload }, { dispatch }) => {
    const tid = tempId();
    const item = {
      ...payload,
      id: tid,
      fecha: payload.fecha || new Date().toISOString(),
    };

    // 1. Optimistic insert
    dispatch(movimientosSlice.actions._addOptimistic(item));

    // 2. Persistir en Supabase
    const created = await createMovimiento(userId, payload);
    if (!created) return;

    // 3. Reemplazar id temporal por UUID real
    dispatch(
      movimientosSlice.actions._replaceId({ tempId: tid, realId: created.id }),
    );
  },
);

export const editMovimientoAsync = createAsyncThunk(
  "movimientos/editAsync",
  async ({ payload }, { dispatch }) => {
    dispatch(movimientosSlice.actions._edit(payload));
    await updateMovimiento(payload.id, payload);
  },
);

export const deleteMovimientoAsync = createAsyncThunk(
  "movimientos/deleteAsync",
  async ({ id }, { dispatch }) => {
    dispatch(movimientosSlice.actions._delete(id));
    await deleteMovimientoDB(id);
  },
);

export const toggleEstadoAsync = createAsyncThunk(
  "movimientos/toggleAsync",
  async ({ id, nuevoEstado }, { dispatch }) => {
    dispatch(movimientosSlice.actions._toggle(id));
    await toggleMovimientoEstado(id, nuevoEstado);
  },
);

// ── Slice ──────────────────────────────────────────────────────────────────
const initialList = load();

const movimientosSlice = createSlice({
  name: "movimientos",
  initialState: {
    list: initialList,
    filtered: initialList,
    filtros: {
      mes: new Date().getMonth() + 1,
      anio: new Date().getFullYear(),
      categoriaId: null,
      texto: "",
    },
    synced: false,
    ...calcTotales(initialList),
  },
  reducers: {
    // Llamado por useSyncData al arrancar con usuario Google
    setMovimientos: (state, action) => {
      state.list = action.payload;
      state.synced = true;
      save(state.list);
      movimientosSlice.caseReducers._applyFilter(state);
    },

    // ── Reducers síncronos para modo Demo ──────────────────────────────

    addMovimiento: (state, action) => {
      const maxNum = state.list.reduce((max, m) => {
        const n = parseInt(m.id);
        return isNaN(n) ? max : Math.max(max, n);
      }, 0);
      const item = {
        ...action.payload,
        id: String(maxNum + 1),
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

    // ── Internos para thunks async ─────────────────────────────────────

    _addOptimistic: (state, action) => {
      state.list.push(action.payload);
      save(state.list);
      movimientosSlice.caseReducers._applyFilter(state);
    },

    _replaceId: (state, action) => {
      const { tempId, realId } = action.payload;
      const idx = state.list.findIndex((m) => m.id === tempId);
      if (idx >= 0) {
        state.list[idx].id = realId;
        // También actualizar filtered si el item está ahí
        const fidx = state.filtered.findIndex((m) => m.id === tempId);
        if (fidx >= 0) state.filtered[fidx].id = realId;
        save(state.list);
      }
    },

    _edit: (state, action) => {
      const idx = state.list.findIndex((m) => m.id === action.payload.id);
      if (idx >= 0) {
        state.list[idx] = action.payload;
        save(state.list);
      }
      movimientosSlice.caseReducers._applyFilter(state);
    },

    _delete: (state, action) => {
      state.list = state.list.filter((m) => m.id !== action.payload);
      save(state.list);
      movimientosSlice.caseReducers._applyFilter(state);
    },

    _toggle: (state, action) => {
      const idx = state.list.findIndex((m) => m.id === action.payload);
      if (idx >= 0) {
        state.list[idx].estado = state.list[idx].estado === 1 ? 0 : 1;
        save(state.list);
      }
      movimientosSlice.caseReducers._applyFilter(state);
    },

    // ── Filtro interno ─────────────────────────────────────────────────
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
  setMovimientos,
  addMovimiento,
  editMovimiento,
  deleteMovimiento,
  toggleEstado,
  setFiltros,
} = movimientosSlice.actions;

export default movimientosSlice.reducer;
