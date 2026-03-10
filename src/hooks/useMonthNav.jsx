import { useSelector, useDispatch } from "react-redux";
import { setFiltros } from "../slices/movimientosSlice";

const MESES_CORTO = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

const MESES_LARGO = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Centraliza la navegación de mes/año usada en DashboardPage.
 * Lee filtros.mes y filtros.anio del store y expone navMes(offset).
 *
 * Retorna: {
 *   mes        {number}   Mes activo (1-12)
 *   anio       {number}   Año activo
 *   mesCorto   {string}   "Ene", "Feb", … (para espacios reducidos)
 *   mesLargo   {string}   "Enero", "Febrero", … (para textos completos)
 *   navMes     {(offset: number) => void}  -1 = mes anterior, +1 = mes siguiente
 * }
 */
export function useMonthNav() {
  const dispatch = useDispatch();
  const { mes, anio } = useSelector((s) => s.movimientos.filtros);

  const navMes = (offset) => {
    const d = new Date(anio, mes - 1 + offset, 1);
    dispatch(setFiltros({ mes: d.getMonth() + 1, anio: d.getFullYear() }));
  };

  return {
    mes,
    anio,
    mesCorto: MESES_CORTO[mes - 1],
    mesLargo: MESES_LARGO[mes - 1],
    navMes,
  };
}
