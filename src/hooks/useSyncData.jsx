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
 *
 * Correcciones:
 *  - Limpia el localStorage de categorías ANTES de cargar desde Supabase,
 *    para evitar que ids numéricos del caché viejo contaminen el store.
 *  - Carga categorías y movimientos en secuencia (no en paralelo) para
 *    garantizar que el categoriaId de los movimientos ya tenga UUIDs válidos.
 *  - try/catch en todo el flujo para evitar estados colgados.
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
        // ── 1. Categorías ──────────────────────────────────────────────
        if (!categoriasSynced) {
          // Limpiar caché viejo con ids numéricos para evitar
          // que categoria_id llegue como NaN a Supabase
          localStorage.removeItem("gastos_categorias");

          let cats = await fetchCategorias(user.id);

          if (cats.length === 0) {
            cats = await seedDefaultCategorias(user.id);
          }

          dispatch(setCategorias(cats));
        }

        // ── 2. Movimientos (después de categorías para que los UUIDs ──
        //       ya estén en el store cuando se rendericen los items)
        if (!movimientosSynced) {
          const movs = await fetchMovimientos(user.id);
          dispatch(setMovimientos(movs));
        }
      } catch (err) {
        console.error("[useSyncData] sync error:", err);
        // No dejamos synced en false para siempre — forzar true
        // para que la app funcione aunque la sync haya fallado
        dispatch(setCategorias([]));
        dispatch(setMovimientos([]));
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
