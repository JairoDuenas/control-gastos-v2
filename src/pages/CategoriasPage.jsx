import { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { CategoriaCard } from "../components/organismos/CategoriaCard";
import { CategoriaForm } from "../forms/CategoriaForm";
import { Modal } from "../components/Modal/Modal";
import { EmptyState } from "../components/moleculas/EmptyState";
import {
  PageShell,
  PageHero,
  HeroLeft,
  HeroTitle,
  HeroSub,
  PrimaryBtn,
} from "../components/ui/shared";

export function CategoriasPage() {
  const categorias = useSelector((s) => s.categorias.list);
  const movimientos = useSelector((s) => s.movimientos.list);
  const moneda = useSelector((s) => s.auth.user?.moneda ?? "$");

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const openEdit = (c) => {
    setEditItem(c);
    setModalOpen(true);
  };

  const totalGlobal = movimientos.reduce((a, m) => a + m.monto, 0);

  return (
    <PageShell>
      <PageHero>
        <HeroLeft>
          <HeroTitle>Categorías</HeroTitle>
          <HeroSub>
            {categorias.length} categoría{categorias.length !== 1 ? "s" : ""} ·{" "}
            {moneda} {totalGlobal.toLocaleString()} distribuidos
          </HeroSub>
        </HeroLeft>
        <PrimaryBtn onClick={openAdd}>+ Nueva categoría</PrimaryBtn>
      </PageHero>

      {/* Resumen horizontal — scroll en desktop, wrap en mobile */}
      <ScrollRow>
        {categorias.map((cat) => {
          const total = movimientos
            .filter((m) => m.categoriaId === cat.id)
            .reduce((a, m) => a + m.monto, 0);
          const pct = totalGlobal > 0 ? (total / totalGlobal) * 100 : 0;
          return (
            <SummaryChip key={cat.id} $color={cat.color}>
              <ChipIcon>{cat.icono}</ChipIcon>
              <ChipInfo>
                <ChipName>{cat.nombre}</ChipName>
                <ChipPct>{pct.toFixed(1)}%</ChipPct>
              </ChipInfo>
              <ChipBar>
                <ChipFill $pct={pct} $color={cat.color} />
              </ChipBar>
            </SummaryChip>
          );
        })}
      </ScrollRow>

      {/* Grid de cards */}
      {categorias.length > 0 ? (
        <Grid>
          {categorias.map((cat, i) => (
            <div key={cat.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <CategoriaCard cat={cat} onEdit={openEdit} />
            </div>
          ))}
          <AddCard onClick={openAdd}>
            <AddIcon>＋</AddIcon>
            <AddLabel>Nueva categoría</AddLabel>
          </AddCard>
        </Grid>
      ) : (
        <EmptyState
          icon="🗂️"
          title="Sin categorías"
          desc="Creá tu primera categoría para organizar tus gastos."
          action="+ Crear categoría"
          onAction={openAdd}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Editar categoría" : "Nueva categoría"}
      >
        <CategoriaForm editItem={editItem} onDone={() => setModalOpen(false)} />
      </Modal>
    </PageShell>
  );
}

/* ── Styled locales ── */

/* ✅ Siempre scroll horizontal — evita que los chips colapsen en mobile */
const ScrollRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  /* Que no se compriman los chips */
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  /* En mobile mostramos scroll horizontal también, más cómodo que un grid apretado */
  @media (max-width: 600px) {
    /* padding lateral para que el primer chip no quede pegado al borde */
    padding-left: 2px;
    padding-right: 2px;
    /* scroll snapping para mejor UX táctil */
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
`;

const SummaryChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => `${$color}33`};
  /* ✅ Ancho fijo para que el scroll funcione bien en cualquier pantalla */
  flex: 0 0 148px;
  min-width: 148px;

  @media (max-width: 600px) {
    scroll-snap-align: start;
    flex: 0 0 140px;
    min-width: 140px;
  }
`;

const ChipIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
`;
const ChipInfo = styled.div`
  flex: 1;
  min-width: 0;
`;
const ChipName = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.text1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const ChipPct = styled.p`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const ChipBar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;
const ChipFill = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  transition: height 0.5s ease;
`;

/* ✅ Grid responsive con auto-fill — se adapta solo sin tantos breakpoints manuales */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;

  /* En pantallas muy chicas forzamos 2 columnas para que no queden tarjetas enormes */
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  /* En pantallas muy muy chicas, 1 columna */
  @media (max-width: 320px) {
    grid-template-columns: 1fr;
  }
`;

const AddCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  background: transparent;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  cursor: pointer;
  min-height: 130px;
  transition: all 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentGlow};
  }
`;
const AddIcon = styled.span`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const AddLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
`;
