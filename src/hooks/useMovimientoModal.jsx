import { useState } from "react";

/**
 * Centraliza el estado del modal de movimientos usado en
 * DashboardPage, MovimientosPage y cualquier otra página que lo necesite.
 *
 * Retorna: { modalOpen, editItem, openAdd, openEdit, closeModal }
 */
export function useMovimientoModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const openAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };
  const openEdit = (m) => {
    setEditItem(m);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return { modalOpen, editItem, openAdd, openEdit, closeModal };
}
