import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategorias,
  seedDefaultCategorias,
} from "../services/CategoriasService";
import { fetchMovimientos } from "../services/MovimientosService";
import { setCategorias } from "../slices/categoriasSlice";
import { setMovimientos } from "../slices/movimientosSlice";

/**
 * useSyncData — carga inicial de datos desde Supabase.
 *
 * Se ejecuta una sola vez cuando el usuario Google inicia sesión.
 * Para el usuario Demo no hace nada — los datos viven en localStorage.
 *
 * Flujo:
 *  1. fetchCategorias(userId)
 *       → vacío (primer login) → seedDefaultCategorias → setCategorias
 *       → con datos           → setCategorias directo
 *  2. fetchMovimientos(userId) → setMovimientos
 *
 * El flag `synced` en cada slice evita re-ejecución en re-renders.
 */
export function useSyncData() {
  const dispatch = useDispatch();
  const { user, isDemo, isLoggedIn } = useSelector((s) => s.auth);
  const categoriasSynced = useSelector((s) => s.categorias.synced);
  const movimientosSynced = useSelector((s) => s.movimientos.synced);

  useEffect(() => {
    // Solo sincronizar si: hay sesión Google (no Demo) y aún no se sincronizó
    if (!isLoggedIn || isDemo || !user?.id) return;
    if (categoriasSynced && movimientosSynced) return;

    const sync = async () => {
      // ── 1. Categorías ────────────────────────────────────────────────
      if (!categoriasSynced) {
        let cats = await fetchCategorias(user.id);

        if (cats.length === 0) {
          // Primer login — crear las 8 categorías default en Supabase
          cats = await seedDefaultCategorias(user.id);
        }

        dispatch(setCategorias(cats));
      }

      // ── 2. Movimientos ───────────────────────────────────────────────
      if (!movimientosSynced) {
        const movs = await fetchMovimientos(user.id);
        dispatch(setMovimientos(movs));
      }
    };

    sync();
  }, [
    isLoggedIn,
    isDemo,
    user?.id,
    categoriasSynced,
    movimientosSynced,
    dispatch,
  ]);
}
