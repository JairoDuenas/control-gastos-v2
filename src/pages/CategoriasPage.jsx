import { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { CategoriaCard } from "../components/organismos/CategoriaCard";
import { CategoriasSummary } from "../components/moleculas/CategoriasSummary";
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
      {/* ── Hero ── */}
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

      {/* ── Chips de resumen por porcentaje ── */}
      <CategoriasSummary categorias={categorias} movimientos={movimientos} />

      {/* ── Grid de cards ── */}
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

      {/* ── Modal ── */}
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

/* ── Styled locales — solo grid y AddCard ── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
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
