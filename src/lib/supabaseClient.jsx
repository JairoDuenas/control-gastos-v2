import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase — opcional.
 *
 * Si las variables de entorno no están configuradas (usuario que solo
 * quiere usar el modo Demo), `supabase` vale null y cada parte de la
 * app que lo usa verifica eso antes de llamarlo.
 *
 * Cuando estén configuradas, exporta el cliente real.
 */
const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export const supabaseReady = !!supabaseUrl && !!supabaseKey;

export const supabase = supabaseReady
  ? createClient(supabaseUrl, supabaseKey)
  : null;
