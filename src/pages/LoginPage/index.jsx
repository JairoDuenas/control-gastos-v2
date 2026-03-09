import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../slices/authSlice";

const MONEDAS = ["$", "€", "£", "S/.", "COP", "MXN", "ARS"];

export function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("login"); // 'login' | 'register'
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    moneda: "$",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (step === "register") {
      if (!form.nombre || !form.email || !form.password) {
        setError("Completá todos los campos.");
        return;
      }
      if (form.password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      dispatch(
        login({ nombre: form.nombre, email: form.email, moneda: form.moneda }),
      );
      navigate("/dashboard");
    } else {
      if (!form.email || !form.password) {
        setError("Ingresá tu email y contraseña.");
        return;
      }
      // Simulación: cualquier credencial válida entra
      const stored = localStorage.getItem("gastos_user");
      const user = stored ? JSON.parse(stored) : null;
      if (user && user.email === form.email) {
        dispatch(login(user));
        navigate("/dashboard");
      } else if (!stored) {
        setError("No hay cuenta registrada. Creá una cuenta primero.");
      } else {
        setError("Email o contraseña incorrectos.");
      }
    }
  };

  return (
    <Page>
      {/* Fondo decorativo */}
      <BgOrb $top="-120px" $left="-100px" $color="#5b8dee" />
      <BgOrb $top="60%" $left="70%" $color="#43e97b" $size="260px" />
      <BgOrb $top="30%" $left="80%" $color="#a78bfa" $size="180px" />

      <Card>
        {/* Logo */}
        <LogoWrap>
          <LogoIcon>💰</LogoIcon>
          <LogoText>
            Gastos<Accent>Pro</Accent>
          </LogoText>
        </LogoWrap>

        <Subtitle>
          {step === "login"
            ? "Ingresá a tu cuenta para continuar"
            : "Creá tu cuenta y empezá a controlar tus finanzas"}
        </Subtitle>

        <Form onSubmit={handleSubmit}>
          {step === "register" && (
            <Field>
              <FLabel>Nombre</FLabel>
              <FInput
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
              />
            </Field>
          )}

          <Field>
            <FLabel>Email</FLabel>
            <FInput
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field>
            <FLabel>Contraseña</FLabel>
            <FInput
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
          </Field>

          {step === "register" && (
            <Field>
              <FLabel>Moneda</FLabel>
              <FSelect
                value={form.moneda}
                onChange={(e) => set("moneda", e.target.value)}
              >
                {MONEDAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </FSelect>
            </Field>
          )}

          {error && <ErrorMsg>⚠️ {error}</ErrorMsg>}

          <SubmitBtn type="submit">
            {step === "login" ? "→ Ingresar" : "✓ Crear cuenta"}
          </SubmitBtn>
        </Form>

        <Toggle>
          {step === "login" ? (
            <>
              ¿No tenés cuenta?{" "}
              <TLink
                onClick={() => {
                  setStep("register");
                  setError("");
                }}
              >
                Registrate
              </TLink>
            </>
          ) : (
            <>
              ¿Ya tenés cuenta?{" "}
              <TLink
                onClick={() => {
                  setStep("login");
                  setError("");
                }}
              >
                Iniciar sesión
              </TLink>
            </>
          )}
        </Toggle>

        {/* Demo hint */}
        <DemoHint
          onClick={() => {
            dispatch(
              login({
                nombre: "Demo User",
                email: "demo@gastospro.com",
                moneda: "$",
              }),
            );
            navigate("/dashboard");
          }}
        >
          ⚡ Entrar con cuenta demo
        </DemoHint>
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
  max-width: 420px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 36px 32px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  animation: fadeUp 0.4s ease both;
  @media (max-width: 480px) {
    padding: 28px 20px;
  }
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
`;
const LogoIcon = styled.span`
  font-size: 2rem;
`;
const LogoText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const Accent = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;
const Subtitle = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: 28px;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const FLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
`;
const inputBase = ({ theme }) => `
  padding: 12px 15px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  color: ${theme.colors.text1};
  font-family: ${theme.fonts.body}; font-size: .92rem;
  outline: none; transition: border-color .2s;
  &:focus { border-color: ${theme.colors.accent}; }
`;
const FInput = styled.input`
  ${inputBase}
`;
const FSelect = styled.select`
  ${inputBase};
  background: ${({ theme }) => theme.colors.selectBg};
  cursor: pointer;
`;
const ErrorMsg = styled.div`
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: rgba(255, 89, 89, 0.1);
  border: 1px solid rgba(255, 89, 89, 0.3);
  color: #ff5959;
  font-size: 0.83rem;
`;
const SubmitBtn = styled.button`
  margin-top: 4px;
  padding: 13px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent},
    #7c6ee6
  );
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition:
    opacity 0.2s,
    transform 0.15s;
  &:hover {
    opacity: 0.88;
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0);
  }
`;
const Toggle = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const TLink = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;
const DemoHint = styled.button`
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text3};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.82rem;
  transition:
    border-color 0.2s,
    color 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
