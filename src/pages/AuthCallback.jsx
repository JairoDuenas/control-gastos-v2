import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled, { keyframes } from "styled-components";
import { supabase } from "../lib/supabaseClient";
import { setUser } from "../slices/authSlice";

/**
 * AuthCallback — ruta /auth/callback
 *
 * Supabase usa PKCE: Google redirige aquí con ?code=XXXX en la URL.
 * Hay que llamar exchangeCodeForSession(code) para convertirlo en sesión.
 * El onAuthStateChange del AuthProvider NO alcanza a procesar este evento
 * porque el componente se monta después del redirect — hay que hacerlo
 * explícitamente aquí.
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handled = useRef(false); // evita doble ejecución en StrictMode

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const run = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get("code");

        if (!code) {
          navigate("/login?error=auth_failed", { replace: true });
          return;
        }

        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error || !data.session) {
          console.error("[AuthCallback]", error?.message);
          navigate("/login?error=auth_failed", { replace: true });
          return;
        }

        // Leer perfil y actualizar Redux explícitamente
        // (AuthProvider también lo detectará via onAuthStateChange SIGNED_IN,
        // pero hacerlo aquí garantiza que Redux esté actualizado antes del redirect)
        const authUser = data.session.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, nombre, email, moneda")
          .eq("id", authUser.id)
          .single();

        dispatch(
          setUser({
            id: authUser.id,
            nombre:
              profile?.nombre ?? authUser.user_metadata?.full_name ?? "Usuario",
            email: profile?.email ?? authUser.email,
            moneda: profile?.moneda ?? "$",
          }),
        );

        navigate("/dashboard", { replace: true });
      } catch (err) {
        console.error("[AuthCallback] unexpected:", err);
        navigate("/login?error=auth_failed", { replace: true });
      }
    };

    run();
  }, [navigate, dispatch]);

  return (
    <Screen>
      <Spinner />
      <Msg>Iniciando sesión con Google…</Msg>
      <Sub>Serás redirigido automáticamente</Sub>
    </Screen>
  );
}

const spin = keyframes`to { transform: rotate(360deg); }`;

const Screen = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;
const Spinner = styled.div`
  width: 44px;
  height: 44px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;
const Msg = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const Sub = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text3};
`;
