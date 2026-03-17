import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategorias,
  seedDefaultCategorias,
} from "../services/categoriasService";
import { fetchMovimientos } from "../services/movimientosService";
import { setCategorias } from "../slices/categoriasSlice";
import { setMovimientos } from "../slices/movimientosSlice";

/**
 * useSyncData — carga inicial de datos desde Supabase.
 * Solo corre para usuarios Google (isDemo=false).
 * Para Demo, los datos viven en localStorage y el slice los carga directamente.
 */
export function useSyncData() {
  const dispatch = useDispatch();
  const { user, isDemo, isLoggedIn } = useSelector((s) => s.auth);
  const categoriasSynced = useSelector((s) => s.categorias.synced);
  const movimientosSynced = useSelector((s) => s.movimientos.synced);

  useEffect(() => {
    if (!isLoggedIn || isDemo || !user?.id) return;
    if (categoriasSynced && movimientosSynced) return;

    const sync = async () => {
      try {
        // 1. Categorías primero — los movimientos dependen de sus UUIDs
        if (!categoriasSynced) {
          let cats = await fetchCategorias(user.id);
          if (cats.length === 0) {
            cats = await seedDefaultCategorias(user.id);
          }
          dispatch(setCategorias(cats));
        }

        // 2. Movimientos — después de que categorías tiene UUIDs reales
        if (!movimientosSynced) {
          const movs = await fetchMovimientos(user.id);
          dispatch(setMovimientos(movs));
        }
      } catch (err) {
        console.error("[useSyncData]", err);
        // Forzar synced=true con lista vacía para no bloquear la app
        if (!categoriasSynced) dispatch(setCategorias([]));
        if (!movimientosSynced) dispatch(setMovimientos([]));
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
