import { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { supabase, supabaseReady } from "../lib/supabaseClient";
import { setUser, setLoading } from "../slices/authSlice";

/**
 * AuthProvider — listener global de sesión.
 *
 * Comportamiento según el modo:
 *
 *  DEMO (sin .env configurado o supabase=null):
 *    - Si ya hay sesión Demo en localStorage → loading=false desde el
 *      initialState del slice, la app abre directo.
 *    - Si no hay sesión Demo → loading=false inmediato, muestra /login.
 *    - El botón Google en LoginTemplate mostrará un mensaje de "no configurado".
 *
 *  SUPABASE (con .env configurado):
 *    - Si hay sesión Demo guardada → igual que arriba, sin tocar Supabase.
 *    - Si no hay sesión Demo → consulta getSession() a Supabase:
 *        · Hay sesión activa → setUser(profile) → /dashboard
 *        · No hay sesión     → setLoading(false) → /login
 *    - El listener onAuthStateChange captura SIGNED_IN / SIGNED_OUT.
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Sin Supabase configurado — solo apagar el loading si está encendido
    // (caso: primera visita sin sesión Demo y sin Supabase).
    if (!supabaseReady) {
      dispatch(setLoading(false));
      return;
    }

    // Con Supabase — verificar sesión activa
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        dispatch(setUser(profile));
      } else {
        dispatch(setLoading(false));
      }
    });

    // Listener en tiempo real: SIGNED_IN (callback OAuth), SIGNED_OUT
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfile(session.user);
        dispatch(setUser(profile));
      }
      if (event === "SIGNED_OUT") {
        dispatch(setUser(null));
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
// Solo visible los ~300ms que tarda Supabase en responder getSession.
// Con modo Demo ya resuelto en initialState, nunca se muestra.
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
