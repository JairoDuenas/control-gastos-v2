import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import uiReducer from "../slices/uiSlice";
import categoriasReducer from "../slices/categoriasSlice";
import movimientosReducer from "../slices/movimientosSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  categorias: categoriasReducer,
  movimientos: movimientosReducer,
});

export default rootReducer;
