import { useMovimientosFiltros } from "../hooks/useMovimientosFiltros";
import { useMovimientoModal } from "../hooks/useMovimientoModal";
import { KpiStrip } from "../components/moleculas/KpiStrip";
import { MovimientosFilters } from "../components/organismos/MovimientosFilters";
import { Pagination } from "../components/organismos/Pagination";
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

export function MovimientosPage() {
  const {
    moneda,
    filtros,
    filtered,
    total,
    pagados,
    pendientes,
    categorias,
    anios,
    page,
    setPage,
    totalPages,
    paginated,
    ordenDesc,
    toggleOrden,
    onTexto,
    onMes,
    onAnio,
    onCategoria,
  } = useMovimientosFiltros();

  const { modalOpen, editItem, openAdd, openEdit, closeModal } =
    useMovimientoModal();

  return (
    <PageShell $gap="18px">
      {/* ── Hero ── */}
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

      {/* ── Resumen numérico ── */}
      <KpiStrip
        total={total}
        pagados={pagados}
        pendientes={pendientes}
        count={filtered.length}
        moneda={moneda}
      />

      {/* ── Filtros ── */}
      <MovimientosFilters
        filtros={filtros}
        categorias={categorias}
        anios={anios}
        ordenDesc={ordenDesc}
        onTexto={onTexto}
        onMes={onMes}
        onAnio={onAnio}
        onCategoria={onCategoria}
        onOrdenToggle={toggleOrden}
      />

      {/* ── Lista + paginación ── */}
      {paginated.length > 0 ? (
        <>
          <MovList>
            {paginated.map((m, i) => (
              <div key={m.id} style={{ animationDelay: `${i * 0.04}s` }}>
                <MovimientoItem mov={m} onEdit={openEdit} />
              </div>
            ))}
          </MovList>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
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
