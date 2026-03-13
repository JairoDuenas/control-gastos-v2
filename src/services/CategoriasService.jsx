import { supabase } from "../lib/supabaseClient";

/**
 * Categorías default que se crean en Supabase al primer login.
 * Coinciden con los DEFAULTS del categoriasSlice.
 */
const DEFAULTS = [
  { nombre: "Alimentación", icono: "🛒", color: "#43e97b" },
  { nombre: "Transporte", icono: "🚗", color: "#5b8dee" },
  { nombre: "Vivienda", icono: "🏠", color: "#a78bfa" },
  { nombre: "Salud", icono: "💊", color: "#ff5959" },
  { nombre: "Ocio", icono: "🎮", color: "#ffcb05" },
  { nombre: "Ropa", icono: "👕", color: "#f08030" },
  { nombre: "Educación", icono: "📚", color: "#78c850" },
  { nombre: "Otros", icono: "📦", color: "#7b8db8" },
];

/**
 * Convierte una fila de Supabase al formato Redux.
 * Para usuarios Google, el `id` es el UUID de Supabase.
 * El slice lo usa igual que antes — solo cambia el tipo de string→number.
 */
const toRedux = (row) => ({
  id: row.id,
  nombre: row.nombre,
  icono: row.icono,
  color: row.color,
});

// ── CRUD ─────────────────────────────────────────────────────────────────────

/** Trae todas las categorías del usuario. Retorna [] si hay error. */
export async function fetchCategorias(userId) {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, icono, color")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[categoriasService] fetchCategorias:", error.message);
    return [];
  }
  return data.map(toRedux);
}

/**
 * Inserta las 8 categorías default para un usuario nuevo.
 * Se llama desde useSyncData cuando el usuario no tiene categorías aún.
 */
export async function seedDefaultCategorias(userId) {
  const rows = DEFAULTS.map((d) => ({ ...d, user_id: userId }));
  const { data, error } = await supabase
    .from("categorias")
    .insert(rows)
    .select("id, nombre, icono, color");

  if (error) {
    console.error("[categoriasService] seedDefaultCategorias:", error.message);
    return [];
  }
  return data.map(toRedux);
}

/** Crea una nueva categoría. Retorna la fila creada con UUID, o null. */
export async function createCategoria(userId, payload) {
  const { data, error } = await supabase
    .from("categorias")
    .insert({
      user_id: userId,
      nombre: payload.nombre,
      icono: payload.icono,
      color: payload.color,
    })
    .select("id, nombre, icono, color")
    .single();

  if (error) {
    console.error("[categoriasService] createCategoria:", error.message);
    return null;
  }
  return toRedux(data);
}

/** Actualiza una categoría existente por UUID. */
export async function updateCategoria(id, payload) {
  const { error } = await supabase
    .from("categorias")
    .update({
      nombre: payload.nombre,
      icono: payload.icono,
      color: payload.color,
    })
    .eq("id", id);

  if (error)
    console.error("[categoriasService] updateCategoria:", error.message);
}

/** Elimina una categoría por UUID. */
export async function deleteCategoria(id) {
  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error)
    console.error("[categoriasService] deleteCategoria:", error.message);
}
