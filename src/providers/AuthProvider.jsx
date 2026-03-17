import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { supabase, supabaseReady } from "../lib/supabaseClient";
import { setUser, setLoading } from "../slices/authSlice";

/**
 * AuthProvider — usa SOLO onAuthStateChange (patrón oficial Supabase v2).
 *
 * En Supabase v2, onAuthStateChange dispara INITIAL_SESSION al montarse
 * con el estado actual de la sesión — reemplaza a getSession().
 * Usar ambos causaba que fetchProfile se ejecutara dos veces en paralelo,
 * generando race conditions que dejaban loading=true indefinidamente.
 *
 * Eventos que manejamos:
 *   INITIAL_SESSION — estado inicial al cargar la app
 *   SIGNED_IN       — login exitoso (OAuth callback)
 *   SIGNED_OUT      — logout
 *   TOKEN_REFRESHED — Supabase renueva el token, sin acción necesaria
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!supabaseReady) {
      dispatch(setLoading(false));
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === "INITIAL_SESSION") {
          // Estado inicial al cargar la app
          if (session?.user) {
            const profile = await fetchProfile(session.user);
            dispatch(setUser(profile));
          } else {
            // Sin sesión activa — mostrar login
            dispatch(setLoading(false));
          }
        }

        if (event === "SIGNED_IN" && session?.user) {
          const profile = await fetchProfile(session.user);
          dispatch(setUser(profile));
        }

        if (event === "SIGNED_OUT") {
          dispatch(setUser(null));
        }
        // TOKEN_REFRESHED: Supabase lo maneja internamente, sin acción
      } catch (err) {
        console.error("[AuthProvider] onAuthStateChange error:", err);
        dispatch(setLoading(false)); // desbloquear siempre ante error
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  return children;
}

async function fetchProfile(authUser) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nombre, email, moneda")
    .eq("id", authUser.id)
    .single();

  return {
    id: authUser.id,
    nombre: profile?.nombre ?? authUser.user_metadata?.full_name ?? "Usuario",
    email: profile?.email ?? authUser.email,
    moneda: profile?.moneda ?? "$",
  };
}

// ── Pantalla de carga ──────────────────────────────────────────────────────
export function AuthLoadingScreen() {
  return (
    <Screen>
      <Orb />
      <Logo>💰 GastosPro</Logo>
      <Spinner />
      <Msg>Verificando sesión…</Msg>
    </Screen>
  );
}

const spin = keyframes`to { transform: rotate(360deg); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: ${fadeIn} 0.3s ease;
`;
const Orb = styled.div`
  position: fixed;
  top: -120px;
  left: -100px;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, #5b8dee22 0%, transparent 70%);
  pointer-events: none;
`;
const Logo = styled.h1`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
const Msg = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
`;
