import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { supabase } from "../lib/supabaseClient";

/**
 * AuthCallback — ruta /auth/callback
 *
 * Después de que el usuario aprueba el login en Google, Supabase
 * redirige el browser aquí con un token en la URL (#access_token=...).
 * Supabase lo procesa automáticamente; nosotros solo esperamos y
 * redirigimos al dashboard.
 *
 * Si algo falla (token expirado, cancelado) redirigimos a /login
 * con un mensaje de error en la URL para que LoginTemplate lo muestre.
 */
export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase detecta automáticamente el token en el hash de la URL
    // y dispara onAuthStateChange → SIGNED_IN en AuthProvider.
    // Solo necesitamos esperar un tick y redirigir.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // AuthProvider ya actualizó Redux — ir al dashboard
        navigate("/dashboard", { replace: true });
      }
      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        navigate("/login?error=auth_failed", { replace: true });
      }
    });

    // Timeout de seguridad: si en 8 segundos no hubo evento, algo falló
    const timeout = setTimeout(() => {
      navigate("/login?error=timeout", { replace: true });
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

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
