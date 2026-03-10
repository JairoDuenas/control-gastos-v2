import { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMovimientoModal } from "../hooks/useMovimientoModal";
import { useMonthNav } from "../hooks/useMonthNav";
import { MonthNavigator } from "../components/atomos/MonthNavigator";
import { KpiCard } from "../components/moleculas/KpiCard";
import { DonutChart } from "../components/graficas/DonutChart";
import { BarChart } from "../components/graficas/BarChart";
import { MovimientoItem } from "../components/organismos/MovimientoItem";
import { MovimientoForm } from "../forms/MovimientoForm";
import { Modal } from "../components/Modal/Modal";
import { EmptyState } from "../components/moleculas/EmptyState";
import {
  PageShell,
  PageHero,
  HeroLeft,
  HeroTitle,
  HeroSub,
  HeroRight,
  PrimaryBtn,
  SectionCard,
  CardTitle,
  MovList,
} from "../components/ui/shared";

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

export function DashboardPage() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const moneda = user?.moneda ?? "$";
  const { list, total, pagados, pendientes, filtros } = useSelector(
    (s) => s.movimientos,
  );
  const categorias = useSelector((s) => s.categorias.list);

  // ── Navegación de mes (dispatch encapsulado en el hook) ─────────────────
  const { mes, anio, mesCorto, navMes } = useMonthNav();

  // ── Modal de movimientos ─────────────────────────────────────────────────
  const { modalOpen, editItem, openAdd, openEdit, closeModal } =
    useMovimientoModal();

  // ── Movimientos del mes activo ───────────────────────────────────────────
  const totalMovs = useMemo(
    () =>
      list.filter((m) => {
        const d = new Date(m.fecha);
        return (
          d.getMonth() + 1 === filtros.mes && d.getFullYear() === filtros.anio
        );
      }),
    [list, filtros.mes, filtros.anio],
  );

  // ── Datos para el donut (distribución por categoría del mes) ────────────
  const donutData = useMemo(() => {
    const map = {};
    totalMovs.forEach((m) => {
      const cat = categorias.find((c) => c.id === m.categoriaId);
      const key = cat?.nombre ?? "Otros";
      const col = cat?.color ?? "#7b8db8";
      map[key] = { value: (map[key]?.value ?? 0) + m.monto, color: col };
    });
    return Object.entries(map)
      .map(([label, v]) => ({ label, value: v.value, color: v.color }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7);
  }, [totalMovs, categorias]);

  // ── Datos para el bar chart (6 meses centrados en filtros.mes/anio) ──────
  // Se ancla a filtros.mes/anio (no a "hoy") para que la gráfica sea
  // consistente con el mes que el usuario está visualizando en el dashboard.
  const barData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(filtros.anio, filtros.mes - 1 - (5 - i), 1);
      const m = d.getMonth() + 1;
      const a = d.getFullYear();
      const value = list
        .filter((mov) => {
          const md = new Date(mov.fecha);
          return md.getMonth() + 1 === m && md.getFullYear() === a;
        })
        .reduce((acc, mov) => acc + mov.monto, 0);
      // "#5b8dee" = accent, no cambia con el tema — correcto dejarlo aquí
      return { label: MESES_CORTO[m - 1], value, color: "#5b8dee" };
    });
  }, [list, filtros.mes, filtros.anio]);

  // ── 5 movimientos más recientes del mes ──────────────────────────────────
  const recientes = useMemo(
    () =>
      [...totalMovs]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5),
    [totalMovs],
  );

  return (
    <PageShell $gap="24px">
      {/* ── Hero con navegador de mes ── */}
      <PageHero>
        <HeroLeft>
          <HeroTitle>Dashboard</HeroTitle>
          <HeroSub>
            Bienvenido, <strong>{user?.nombre}</strong> · {mesCorto} {anio}
          </HeroSub>
        </HeroLeft>
        <HeroRight>
          <MonthNavigator
            label={`${mesCorto} ${anio}`}
            onPrev={() => navMes(-1)}
            onNext={() => navMes(1)}
          />
          <PrimaryBtn onClick={openAdd}>+ Nuevo</PrimaryBtn>
        </HeroRight>
      </PageHero>

      {/* ── KPIs del mes ── */}
      <KpiGrid>
        <KpiCard
          icon="💰"
          label="Total mes"
          value={`${moneda} ${total.toLocaleString()}`}
          color="#5b8dee"
          delay={0}
          sub={`${totalMovs.length} movimientos`}
        />
        <KpiCard
          icon="✅"
          label="Pagados"
          value={`${moneda} ${pagados.toLocaleString()}`}
          color="#43e97b"
          delay={0.05}
          sub={`${totalMovs.filter((m) => m.estado === 1).length} pagados`}
        />
        <KpiCard
          icon="⏳"
          label="Pendientes"
          value={`${moneda} ${pendientes.toLocaleString()}`}
          color="#ffcb05"
          delay={0.1}
          sub={`${totalMovs.filter((m) => m.estado === 0).length} pendientes`}
        />
        <KpiCard
          icon="🗂️"
          label="Categorías"
          value={categorias.length}
          color="#a78bfa"
          delay={0.15}
          sub="activas"
        />
      </KpiGrid>

      {/* ── Gráficas ── */}
      <ChartsRow>
        <SectionCard>
          <CardTitle>Distribución por categoría</CardTitle>
          {donutData.length > 0 ? (
            <DonutChart data={donutData} />
          ) : (
            <EmptyState
              icon="🍩"
              title="Sin datos"
              desc="Agrega movimientos para ver la distribución."
            />
          )}
        </SectionCard>
        <SectionCard>
          <CardTitle>Gastos últimos 6 meses</CardTitle>
          <BarChart data={barData} />
        </SectionCard>
      </ChartsRow>

      {/* ── Movimientos recientes ── */}
      <SectionHeader>
        <SectionTitle>Últimos movimientos</SectionTitle>
        <SeeAll onClick={() => navigate("/movimientos")}>Ver todos →</SeeAll>
      </SectionHeader>

      {recientes.length > 0 ? (
        <MovList>
          {recientes.map((m) => (
            <MovimientoItem key={m.id} mov={m} onEdit={openEdit} />
          ))}
        </MovList>
      ) : (
        <EmptyState
          icon="💸"
          title="Sin movimientos este mes"
          desc="Registrá tu primer gasto o ingreso."
          action="+ Agregar movimiento"
          onAction={openAdd}
        />
      )}

      {/* ── Modal ── */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editItem ? "Editar movimiento" : "Nuevo movimiento"}
      >
        <MovimientoForm editItem={editItem} onDone={closeModal} />
      </Modal>
    </PageShell>
  );
}

/* ── Styled locales — solo estructura de layout ── */
const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text1};
`;

const SeeAll = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
