import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { login, setAuthError } from "../../slices/authSlice";
import { useSupabaseAuth } from "../../hooks/useSupabaseAuth";
import { GoogleIcon } from "../atomos/GoogleIcon";

/**
 * LoginTemplate — pantalla de inicio de sesión.
 *
 * Dos modos coexisten sin conflicto:
 *
 *  Demo:   despacha login() directo → Redux → /dashboard.
 *          Funciona siempre, con o sin Supabase configurado.
 *
 *  Google: llama signInWithGoogle() → redirect OAuth → /auth/callback.
 *          Si Supabase no está configurado, muestra un aviso claro.
 */
export function LoginTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const authError = useSelector((s) => s.auth.error);
  const { signInWithGoogle, googleLoading, supabaseReady } = useSupabaseAuth();

  // Error que viene de AuthCallback vía ?error=
  useEffect(() => {
    const err = params.get("error");
    if (!err) return;
    const msgs = {
      auth_failed: "No se pudo completar el inicio de sesión con Google.",
      timeout: "El inicio de sesión tardó demasiado. Intentá de nuevo.",
    };
    dispatch(setAuthError(msgs[err] ?? "Ocurrió un error inesperado."));
  }, [params, dispatch]);

  // Modo Demo — sin Supabase
  const handleDemo = () => {
    dispatch(setAuthError(null));
    dispatch(
      login({ nombre: "Demo User", email: "demo@gastospro.com", moneda: "$" }),
    );
    navigate("/dashboard");
  };

  return (
    <Page>
      <BgOrb $top="-120px" $left="-100px" $color="#5b8dee" />
      <BgOrb $top="60%" $left="70%" $color="#43e97b" $size="260px" />
      <BgOrb $top="30%" $left="80%" $color="#a78bfa" $size="180px" />

      <Card>
        <LogoWrap>
          <LogoIcon>💰</LogoIcon>
          <LogoText>
            Gastos<Accent>Pro</Accent>
          </LogoText>
        </LogoWrap>

        <Subtitle>Toma el control de tus gastos e ingresos</Subtitle>

        {/* Error de OAuth o de configuración */}
        {authError && <ErrorBox>{authError}</ErrorBox>}

        <Actions>
          {/* ── Botón Google ── */}
          <GoogleBtn
            type="button"
            onClick={signInWithGoogle}
            disabled={googleLoading}
            $dimmed={!supabaseReady}
            title={!supabaseReady ? "Google OAuth no configurado" : undefined}
          >
            {googleLoading ? (
              <>
                <BtnSpinner />
                Conectando con Google…
              </>
            ) : (
              <>
                <GoogleIcon />
                Continuar con Google
                {!supabaseReady && <PillBadge>próximamente</PillBadge>}
              </>
            )}
          </GoogleBtn>

          <Divider>
            <span>o</span>
          </Divider>

          {/* ── Botón Demo ── */}
          <DemoBtn type="button" onClick={handleDemo} disabled={googleLoading}>
            ⚡ Entrar con cuenta demo
          </DemoBtn>
        </Actions>

        <FooterNote>
          {supabaseReady
            ? "Al continuar aceptás nuestros términos de uso"
            : "Modo demo — los datos se guardan solo en este dispositivo"}
        </FooterNote>
      </Card>
    </Page>
  );
}

/* ── Styled ── */
const float = keyframes`
  0%,100% { transform: translateY(0) scale(1); }
  50%      { transform: translateY(-18px) scale(1.04); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
`;
const BgOrb = styled.div`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size ?? "320px"};
  height: ${({ $size }) => $size ?? "320px"};
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ $color }) => $color}22 0%,
    transparent 70%
  );
  animation: ${float} 6s ease-in-out infinite;
  pointer-events: none;
`;
const Card = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 44px 36px 36px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
  animation: fadeUp 0.4s ease both;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 480px) {
    padding: 36px 24px 28px;
  }
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
`;
const LogoIcon = styled.span`
  font-size: 2.2rem;
`;
const LogoText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const Accent = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;
const Subtitle = styled.p`
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: 28px;
  line-height: 1.6;
`;
const ErrorBox = styled.div`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.expense}18;
  border: 1px solid ${({ theme }) => theme.colors.expense}44;
  color: ${({ theme }) => theme.colors.expense};
  font-size: 0.82rem;
  text-align: center;
  margin-bottom: 16px;
`;
const Actions = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
`;
const GoogleBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.text1};
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 0.96rem;
  cursor: ${({ $dimmed }) => ($dimmed ? "default" : "pointer")};
  opacity: ${({ $dimmed }) => ($dimmed ? 0.55 : 1)};
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.15s;
  &:hover:not(:disabled) {
    border-color: ${({ $dimmed, theme }) =>
      $dimmed ? theme.colors.border : theme.colors.borderHov};
    background: ${({ $dimmed, theme }) =>
      $dimmed ? theme.colors.bgCard : theme.colors.bgCardHov};
    transform: ${({ $dimmed }) => ($dimmed ? "none" : "translateY(-1px)")};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const PillBadge = styled.span`
  margin-left: auto;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text3};
  letter-spacing: 0.04em;
`;
const BtnSpinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;
const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.78rem;
  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;
const DemoBtn = styled.button`
  width: 100%;
  padding: 13px;
  background: ${({ theme }) => theme.colors.accent}18;
  border: 1.5px solid ${({ theme }) => theme.colors.accent}55;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 0.92rem;
  transition:
    background 0.2s,
    border-color 0.2s,
    transform 0.15s;
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accent}28;
    border-color: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const FooterNote = styled.p`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
`;
