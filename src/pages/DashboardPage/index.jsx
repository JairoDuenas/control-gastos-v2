import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { KpiCard } from "../../components/KpiCard";
import { DonutChart } from "../../components/DonutChart";
import { BarChart } from "../../components/BarChart";
import { MovimientoItem } from "../../components/MovimientoItem";
import { MovimientoForm } from "../../components/MovimientoForm";
import { Modal } from "../../components/Modal";
import { EmptyState } from "../../components/EmptyState";
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
} from "../../components/ui/shared";
import { useMovimientoModal } from "../../hooks/useMovimientoModal";
import { setFiltros } from "../../slices/movimientosSlice";

const MESES = [
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const moneda = user?.moneda ?? "$";
  const { list, total, pagados, pendientes, filtros } = useSelector(
    (s) => s.movimientos,
  );
  const categorias = useSelector((s) => s.categorias.list);

  const { modalOpen, editItem, openAdd, openEdit, closeModal } =
    useMovimientoModal();

  const totalMovs = list.filter((m) => {
    const d = new Date(m.fecha);
    return d.getMonth() + 1 === filtros.mes && d.getFullYear() === filtros.anio;
  });

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

  const barData = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const mes = d.getMonth() + 1,
        anio = d.getFullYear();
      const value = list
        .filter((m) => {
          const md = new Date(m.fecha);
          return md.getMonth() + 1 === mes && md.getFullYear() === anio;
        })
        .reduce((a, m) => a + m.monto, 0);
      return { label: MESES[mes - 1], value, color: "#5b8dee" };
    });
  }, [list]);

  const recientes = [...totalMovs]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  const navMes = (offset) => {
    const d = new Date(filtros.anio, filtros.mes - 1 + offset, 1);
    dispatch(setFiltros({ mes: d.getMonth() + 1, anio: d.getFullYear() }));
  };

  return (
    <PageShell $gap="24px">
      <PageHero>
        <HeroLeft>
          <HeroTitle>Dashboard</HeroTitle>
          <HeroSub>
            Bienvenido, <strong>{user?.nombre}</strong> ·{" "}
            {MESES[filtros.mes - 1]} {filtros.anio}
          </HeroSub>
        </HeroLeft>
        <HeroRight>
          <MonthNav>
            <NavBtn onClick={() => navMes(-1)}>‹</NavBtn>
            <MonthLabel>
              {MESES[filtros.mes - 1]} {filtros.anio}
            </MonthLabel>
            <NavBtn onClick={() => navMes(1)}>›</NavBtn>
          </MonthNav>
          <PrimaryBtn onClick={openAdd}>+ Nuevo</PrimaryBtn>
        </HeroRight>
      </PageHero>

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

/* ── Styled locales (solo exclusivos de esta página) ── */
const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const MonthLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text1};
  min-width: 90px;
  text-align: center;
`;
const NavBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text1};
  }
`;
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
