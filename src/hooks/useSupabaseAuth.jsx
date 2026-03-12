import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase, supabaseReady } from "../lib/supabaseClient";
import { setAuthError, logout } from "../slices/authSlice";

/**
 * Hook de autenticación con Supabase.
 *
 * Funciona en dos modos según `supabaseReady`:
 *
 *  false (sin .env): signInWithGoogle() muestra un error claro al usuario
 *                    en lugar de crashear. signOut() hace logout Demo.
 *
 *  true  (con .env): comportamiento OAuth completo.
 */
export function useSupabaseAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDemo = useSelector((s) => s.auth.isDemo);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
    // Supabase no configurado — mostrar error amigable en la UI
    if (!supabaseReady) {
      dispatch(
        setAuthError(
          "Google OAuth no está configurado aún. Usá la cuenta demo para explorar la app.",
        ),
      );
      return;
    }

    setGoogleLoading(true);
    dispatch(setAuthError(null));

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      dispatch(setAuthError(error.message));
      setGoogleLoading(false);
    }
    // Sin error: el browser redirige a Google. Loading queda en true
    // hasta que ocurra el redirect (no vuelve a este código).
  };

  const signOut = async () => {
    // Usuario Demo — solo limpiar Redux + localStorage (gestionado por authSlice)
    if (isDemo || !supabaseReady) {
      dispatch(logout());
      navigate("/login");
      return;
    }
    // Usuario Google — invalidar sesión en Supabase
    // onAuthStateChange → SIGNED_OUT → setUser(null) se encarga del resto
    await supabase.auth.signOut();
    dispatch(logout());
    navigate("/login");
  };

  return { signInWithGoogle, signOut, googleLoading, supabaseReady };
}
