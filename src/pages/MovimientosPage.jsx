import { useState, useMemo } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
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
  PrimaryBtn,
  MovList,
} from "../components/ui/shared";
import { useMovimientoModal } from "../hooks/useMovimientoModal";
import { setFiltros } from "../slices/movimientosSlice";

const MESES = [
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
const PAGE_SIZE = 10;

export function MovimientosPage() {
  const dispatch = useDispatch();
  const moneda = useSelector((s) => s.auth.user?.moneda ?? "$");
  const { filtered, filtros, total, pagados, pendientes } = useSelector(
    (s) => s.movimientos,
  );
  const allMovs = useSelector((s) => s.movimientos.list);
  const categorias = useSelector((s) => s.categorias.list);

  const { modalOpen, editItem, openAdd, openEdit, closeModal } =
    useMovimientoModal();

  const [page, setPage] = useState(1);
  const [ordenDesc, setOrdenDesc] = useState(true);

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

  const anios = [
    ...new Set(allMovs.map((m) => new Date(m.fecha).getFullYear())),
  ].sort((a, b) => b - a);

  return (
    <PageShell $gap="18px">
      <PageHero>
        <HeroLeft>
          <HeroTitle>Movimientos</HeroTitle>
          <HeroSub>
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""} ·{" "}
            {moneda} {total.toLocaleString()}
          </HeroSub>
        </HeroLeft>
        <PrimaryBtn onClick={openAdd}>+ Nuevo movimiento</PrimaryBtn>
      </PageHero>

      {/* KPI strip */}
      <KpiStrip>
        <KpiChip $color="#5b8dee">
          <span>💰</span>
          <strong>
            {moneda} {total.toLocaleString()}
          </strong>
          <small>Total</small>
        </KpiChip>
        <KpiChip $color="#43e97b">
          <span>✅</span>
          <strong>
            {moneda} {pagados.toLocaleString()}
          </strong>
          <small>Pagados</small>
        </KpiChip>
        <KpiChip $color="#ffcb05">
          <span>⏳</span>
          <strong>
            {moneda} {pendientes.toLocaleString()}
          </strong>
          <small>Pendientes</small>
        </KpiChip>
        <KpiChip $color="#a78bfa">
          <span>📋</span>
          <strong>{filtered.length}</strong>
          <small>Movimientos</small>
        </KpiChip>
      </KpiStrip>

      {/* Filtros */}
      <FiltersBar>
        <SearchInput
          placeholder="🔍 Buscar descripción…"
          value={filtros.texto}
          onChange={(e) => {
            dispatch(setFiltros({ texto: e.target.value }));
            setPage(1);
          }}
        />
        <FilterGroup>
          <FilterSelect
            value={filtros.mes}
            onChange={(e) => {
              dispatch(setFiltros({ mes: parseInt(e.target.value) }));
              setPage(1);
            }}
          >
            {MESES.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filtros.anio}
            onChange={(e) => {
              dispatch(setFiltros({ anio: parseInt(e.target.value) }));
              setPage(1);
            }}
          >
            {(anios.length ? anios : [new Date().getFullYear()]).map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filtros.categoriaId ?? ""}
            onChange={(e) => {
              dispatch(
                setFiltros({
                  categoriaId: e.target.value ? parseInt(e.target.value) : null,
                }),
              );
              setPage(1);
            }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </FilterSelect>
          <SortBtn onClick={() => setOrdenDesc((p) => !p)}>
            {ordenDesc ? "↓ Recientes" : "↑ Antiguos"}
          </SortBtn>
        </FilterGroup>
      </FiltersBar>

      {/* Lista */}
      {paginated.length > 0 ? (
        <>
          <MovList>
            {paginated.map((m, i) => (
              <div key={m.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <MovimientoItem mov={m} onEdit={openEdit} />
              </div>
            ))}
          </MovList>

          {totalPages > 1 && (
            <Pagination>
              <PageBtn disabled={page <= 1} onClick={() => setPage(1)}>
                «
              </PageBtn>
              <PageBtn
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === "string" ? (
                    <PageDots key={i}>{p}</PageDots>
                  ) : (
                    <PageBtn
                      key={i}
                      $active={p === page}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </PageBtn>
                  ),
                )}
              <PageBtn
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </PageBtn>
              <PageBtn
                disabled={page >= totalPages}
                onClick={() => setPage(totalPages)}
              >
                »
              </PageBtn>
            </Pagination>
          )}
        </>
      ) : (
        <EmptyState
          icon="💸"
          title="Sin resultados"
          desc="No hay movimientos que coincidan con los filtros actuales."
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

/* ── Styled locales ── */
const KpiStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const KpiChip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => `${$color}33`};
  span {
    font-size: 1.1rem;
  }
  strong {
    font-family: ${({ theme }) => theme.fonts.head};
    font-weight: 700;
    font-size: 0.92rem;
    color: ${({ $color }) => $color};
  }
  small {
    font-size: 0.68rem;
    color: ${({ theme }) => theme.colors.text3};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`;
const FiltersBar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;
const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text1};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;
const FilterSelect = styled.select`
  padding: 9px 12px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text1};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const SortBtn = styled.button`
  padding: 9px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.82rem;
  transition: all 0.18s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 0;
`;
const PageBtn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentGlow : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.text2};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.85rem;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: all 0.15s;
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const PageDots = styled.span`
  color: ${({ theme }) => theme.colors.text3};
  padding: 0 4px;
`;
