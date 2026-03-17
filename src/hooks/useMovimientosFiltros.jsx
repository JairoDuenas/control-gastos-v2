import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFiltros } from "../slices/movimientosSlice";

const PAGE_SIZE = 10;

/**
 * Centraliza la lógica de filtros, ordenamiento y paginación
 * que antes vivía inline en MovimientosPage.
 *
 * Retorna: {
 *   // datos del store
 *   moneda, filtros, filtered, total, pagados, pendientes,
 *   categorias, anios,
 *   // paginación y orden
 *   page, totalPages, paginated,
 *   ordenDesc, toggleOrden,
 *   // callbacks para los filtros (hacen dispatch + reset de página)
 *   onTexto, onMes, onAnio, onCategoria,
 * }
 */
export function useMovimientosFiltros() {
  const dispatch = useDispatch();
  const moneda = useSelector((s) => s.auth.user?.moneda ?? "$");
  const categorias = useSelector((s) => s.categorias.list);
  const { filtered, filtros, total, pagados, pendientes } = useSelector(
    (s) => s.movimientos,
  );
  const allMovs = useSelector((s) => s.movimientos.list);

  const [page, setPage] = useState(1);
  const [ordenDesc, setOrdenDesc] = useState(true);

  // Lista ordenada por fecha
  const ordered = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        ordenDesc
          ? new Date(b.fecha) - new Date(a.fecha)
          : new Date(a.fecha) - new Date(b.fecha),
      ),
    [filtered, ordenDesc],
  );

  const totalPages = Math.ceil(ordered.length / PAGE_SIZE);
  const paginated = ordered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Años disponibles derivados de todos los movimientos
  const anios = useMemo(
    () =>
      [...new Set(allMovs.map((m) => new Date(m.fecha).getFullYear()))].sort(
        (a, b) => b - a,
      ),
    [allMovs],
  );

  // Callbacks — hacen dispatch y resetean la página a 1
  const onTexto = (texto) => {
    dispatch(setFiltros({ texto }));
    setPage(1);
  };
  const onMes = (mes) => {
    dispatch(setFiltros({ mes: parseInt(mes) }));
    setPage(1);
  };
  const onAnio = (anio) => {
    dispatch(setFiltros({ anio: parseInt(anio) }));
    setPage(1);
  };
  const onCategoria = (categoriaId) => {
    dispatch(setFiltros({ categoriaId: categoriaId || null }));
    setPage(1);
  };
  const toggleOrden = () => setOrdenDesc((prev) => !prev);

  return {
    // store
    moneda,
    filtros,
    filtered,
    total,
    pagados,
    pendientes,
    categorias,
    anios,
    // paginación y orden
    page,
    setPage,
    totalPages,
    paginated,
    ordenDesc,
    toggleOrden,
    // callbacks de filtros
    onTexto,
    onMes,
    onAnio,
    onCategoria,
  };
}
