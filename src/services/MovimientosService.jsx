import { supabase } from "../lib/supabaseClient";

/**
 * Convierte una fila de Supabase al formato Redux.
 *
 * DB:    { id(uuid), user_id, categoria_id(uuid), descripcion, monto, fecha, estado }
 * Redux: { id(uuid), categoriaId(uuid), descripcion, monto, fecha, estado }
 *
 * Nota: para usuarios Google, categoriaId ahora es un UUID string en lugar
 * del número entero que usa el modo Demo. Los selects del form usan el id
 * de la categoría — que también será UUID — así que todo es consistente.
 */
const toRedux = (row) => ({
  id: row.id,
  categoriaId: row.categoria_id,
  descripcion: row.descripcion,
  monto: parseFloat(row.monto),
  fecha: row.fecha,
  estado: row.estado,
});

/**
 * Convierte un payload de Redux al formato de columnas de Supabase.
 * `userId` y `categoriaId` (UUID) vienen del store al momento del dispatch.
 */
const toDB = (userId, payload) => ({
  user_id: userId,
  categoria_id: payload.categoriaId, // UUID de la categoría
  descripcion: payload.descripcion,
  monto: payload.monto,
  fecha: payload.fecha || new Date().toISOString(),
  estado: payload.estado ?? 0,
});

// ── CRUD ─────────────────────────────────────────────────────────────────────

/** Trae todos los movimientos del usuario. Retorna [] si hay error. */
export async function fetchMovimientos(userId) {
  const { data, error } = await supabase
    .from("movimientos")
    .select("id, categoria_id, descripcion, monto, fecha, estado")
    .eq("user_id", userId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("[movimientosService] fetchMovimientos:", error.message);
    return [];
  }
  return data.map(toRedux);
}

/**
 * Crea un movimiento nuevo en Supabase.
 * Retorna el registro creado con su UUID, o null si falla.
 */
export async function createMovimiento(userId, payload) {
  const { data, error } = await supabase
    .from("movimientos")
    .insert(toDB(userId, payload))
    .select("id, categoria_id, descripcion, monto, fecha, estado")
    .single();

  if (error) {
    console.error("[movimientosService] createMovimiento:", error.message);
    return null;
  }
  return toRedux(data);
}

/** Actualiza un movimiento por UUID. */
export async function updateMovimiento(id, payload) {
  const { error } = await supabase
    .from("movimientos")
    .update({
      categoria_id: payload.categoriaId,
      descripcion: payload.descripcion,
      monto: payload.monto,
      fecha: payload.fecha,
      estado: payload.estado,
    })
    .eq("id", id);

  if (error)
    console.error("[movimientosService] updateMovimiento:", error.message);
}

/** Elimina un movimiento por UUID. */
export async function deleteMovimiento(id) {
  const { error } = await supabase.from("movimientos").delete().eq("id", id);

  if (error)
    console.error("[movimientosService] deleteMovimiento:", error.message);
}

/** Actualiza solo el campo `estado` de un movimiento. */
export async function toggleEstadoMovimiento(id, nuevoEstado) {
  const { error } = await supabase
    .from("movimientos")
    .update({ estado: nuevoEstado })
    .eq("id", id);

  if (error) console.error("[movimientosService] toggleEstado:", error.message);
}
