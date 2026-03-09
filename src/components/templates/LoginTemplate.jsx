import styled, { keyframes } from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../slices/authSlice";
import { GoogleIcon } from "../atomos/GoogleIcon";

export function LoginTemplate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogle = () => {
    // En producción: reemplazar con Firebase/Google OAuth SDK
    dispatch(
      login({
        nombre: "Usuario Google",
        email: "google@gastospro.com",
        moneda: "$",
      }),
    );
    navigate("/dashboard");
  };

  const handleDemo = () => {
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

        <Actions>
          <GoogleBtn type="button" onClick={handleGoogle}>
            <GoogleIcon />
            Continuar con Google
          </GoogleBtn>

          <DemoHint type="button" onClick={handleDemo}>
            ⚡ Entrar con cuenta demo
          </DemoHint>
        </Actions>

        <FooterNote>Al continuar aceptás nuestros términos de uso</FooterNote>
      </Card>
    </Page>
  );
}

/* ── Styled ── */
const float = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-18px) scale(1.04); }
`;
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
  gap: 0;
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
  margin-bottom: 32px;
  line-height: 1.6;
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
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHov};
    background: ${({ theme }) => theme.colors.bgCardHov};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;

const DemoHint = styled.button`
  width: 100%;
  padding: 11px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text3};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.88rem;
  transition:
    border-color 0.2s,
    color 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const FooterNote = styled.p`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
`;
