import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Centraliza toda la lógica derivada de HomePage.
 * La página solo orquesta — este hook calcula.
 */
export function useHomeStats() {
  const user = useSelector((s) => s.auth.user);
  const moneda = user?.moneda ?? "$";
  const categorias = useSelector((s) => s.categorias.list);
  const { list, filtros } = useSelector((s) => s.movimientos);

  // Movimientos del mes activo
  const mesMovs = useMemo(
    () =>
      list.filter((m) => {
        const d = new Date(m.fecha);
        return (
          d.getMonth() + 1 === filtros.mes && d.getFullYear() === filtros.anio
        );
      }),
    [list, filtros.mes, filtros.anio],
  );

  // Totales del mes
  const totalMes = mesMovs.reduce((a, m) => a + m.monto, 0);
  const pagadosMes = mesMovs
    .filter((m) => m.estado === 1)
    .reduce((a, m) => a + m.monto, 0);
  const pctPagado =
    totalMes > 0 ? Math.round((pagadosMes / totalMes) * 100) : 0;

  // Top 5 categorías del mes
  const topCats = useMemo(() => {
    const map = {};
    mesMovs.forEach((m) => {
      const cat = categorias.find((c) => c.id === m.categoriaId);
      const key = m.categoriaId;
      if (!map[key]) map[key] = { cat, total: 0, count: 0 };
      map[key].total += m.monto;
      map[key].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [mesMovs, categorias]);

  const maxCat = topCats[0]?.total ?? 1;

  // Actividad últimas 4 semanas
  const semanas = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 4 }, (_, i) => {
      const start = new Date(now);
      start.setDate(now.getDate() - (3 - i) * 7 - 6);
      const end = new Date(now);
      end.setDate(now.getDate() - (3 - i) * 7);
      const label = start.toLocaleDateString("es", {
        day: "2-digit",
        month: "short",
      });
      const value = list
        .filter((m) => {
          const d = new Date(m.fecha);
          return d >= start && d <= end;
        })
        .reduce((a, m) => a + m.monto, 0);
      return { label, value };
    });
  }, [list]);

  const maxSem = Math.max(...semanas.map((s) => s.value), 1);

  // Saludo contextual por hora del día
  const hora = new Date().getHours();
  const saludo =
    hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return {
    user,
    moneda,
    filtros,
    list,
    categorias,
    mesMovs,
    totalMes,
    pagadosMes,
    pctPagado,
    topCats,
    maxCat,
    semanas,
    maxSem,
    saludo,
  };
}
