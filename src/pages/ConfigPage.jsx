import { useState } from "react";
import styled, { css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../slices/authSlice";
import { useSupabaseAuth } from "../hooks/useSupabaseAuth";
import { setTheme } from "../slices/uiSlice";
import { ProfileHero } from "../components/organismos/ProfileHero";
import { ThemePicker } from "../components/organismos/ThemePicker";
import {
  PageShell,
  TwoCol,
  SectionCard,
  CardTitle,
  StatGrid,
  StatItem,
  StatIcon,
  StatVal,
  StatLab,
} from "../components/ui/shared";

const MONEDAS = ["$", "€", "£", "S/.", "COP", "MXN", "ARS", "BRL", "CLP"];

export function ConfigPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const themeMode = useSelector((s) => s.ui.themeMode);
  const movs = useSelector((s) => s.movimientos.list);
  const cats = useSelector((s) => s.categorias.list);

  // ── Estado local del formulario ──────────────────────────────────────────
  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    moneda: user?.moneda ?? "$",
  });
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUser(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const { signOut } = useSupabaseAuth();

  // Para usuario Demo (isDemo===true) hace logout directo.
  // Para usuario Google (Supabase) llama signOut() que invalida
  // la sesión en el servidor y luego redirige a /login.
  const handleLogout = () => signOut();

  const handleClearData = () => {
    if (!clearing) {
      setClearing(true);
      return;
    }
    localStorage.removeItem("gastos_movimientos");
    localStorage.removeItem("gastos_categorias");
    window.location.reload();
  };

  // ── Estadísticas derivadas ────────────────────────────────────────────────
  const totalGastado = movs.reduce((a, m) => a + m.monto, 0);
  const catsUsadas = new Set(movs.map((m) => m.categoriaId)).size;

  return (
    <PageShell>
      {/* ── Banner de perfil ── */}
      <ProfileHero user={user} themeMode={themeMode} />

      {/* ── Stats globales ── */}
      <StatGrid>
        <StatItem $color="#5b8dee">
          <StatIcon>💸</StatIcon>
          <StatVal>
            {user?.moneda} {totalGastado.toLocaleString()}
          </StatVal>
          <StatLab>Total registrado</StatLab>
        </StatItem>
        <StatItem $color="#43e97b">
          <StatIcon>📋</StatIcon>
          <StatVal>{movs.length}</StatVal>
          <StatLab>Movimientos</StatLab>
        </StatItem>
        <StatItem $color="#a78bfa">
          <StatIcon>🗂️</StatIcon>
          <StatVal>{cats.length}</StatVal>
          <StatLab>Categorías</StatLab>
        </StatItem>
        <StatItem $color="#ffcb05">
          <StatIcon>✅</StatIcon>
          <StatVal>{catsUsadas}</StatVal>
          <StatLab>Categorías en uso</StatLab>
        </StatItem>
      </StatGrid>

      {/* ── Selector de tema ── */}
      <SectionCard>
        <CardTitle>🎨 Apariencia</CardTitle>
        <ThemePicker
          themeMode={themeMode}
          onThemeChange={(id) => dispatch(setTheme(id))}
        />
      </SectionCard>

      {/* ── Formulario + info + acciones ── */}
      <TwoCol $align="start">
        <SectionCard>
          <CardTitle>👤 Perfil personal</CardTitle>
          <Form onSubmit={handleSave}>
            <Field>
              <FLabel>Nombre</FLabel>
              <FInput
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Tu nombre"
              />
            </Field>
            <Field>
              <FLabel>Email</FLabel>
              <FInput
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </Field>
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
            {saved && <SuccessMsg>✓ Cambios guardados</SuccessMsg>}
            <SaveBtn type="submit">💾 Guardar cambios</SaveBtn>
          </Form>
        </SectionCard>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <SectionCard>
            <CardTitle>📱 Información</CardTitle>
            <InfoList>
              <InfoRow>
                <InfoKey>Versión</InfoKey>
                <InfoVal>GastosPro v1.0</InfoVal>
              </InfoRow>
              <InfoRow>
                <InfoKey>Framework</InfoKey>
                <InfoVal>React 18 + Vite 5</InfoVal>
              </InfoRow>
              <InfoRow>
                <InfoKey>Estado</InfoKey>
                <InfoVal>Redux Toolkit</InfoVal>
              </InfoRow>
              <InfoRow>
                <InfoKey>Estilos</InfoKey>
                <InfoVal>Styled Components</InfoVal>
              </InfoRow>
              <InfoRow>
                <InfoKey>Tema</InfoKey>
                <InfoVal>
                  {themeMode === "dark" ? "🌙 Oscuro" : "☀️ Claro"}
                </InfoVal>
              </InfoRow>
            </InfoList>
          </SectionCard>

          <SectionCard>
            <CardTitle>⚙️ Acciones</CardTitle>
            <ActionList>
              <ActionItem>
                <ActionInfo>
                  <ActionLabel>Cerrar sesión</ActionLabel>
                  <ActionDesc>Salir de tu cuenta actual</ActionDesc>
                </ActionInfo>
                <DangerBtn onClick={handleLogout}>Salir</DangerBtn>
              </ActionItem>
              <Divider />
              <ActionItem>
                <ActionInfo>
                  <ActionLabel>Limpiar datos</ActionLabel>
                  <ActionDesc>
                    Eliminar todos los movimientos y categorías
                  </ActionDesc>
                </ActionInfo>
                <DangerBtn $outline onClick={handleClearData}>
                  {clearing ? "¿Confirmar?" : "Limpiar"}
                </DangerBtn>
              </ActionItem>
            </ActionList>
          </SectionCard>
        </div>
      </TwoCol>
    </PageShell>
  );
}

/* ── Styled locales — solo formulario y tablas de info ── */
const inputBase = css`
  padding: 10px 13px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text1};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.88rem;
  outline: none;
  transition:
    border-color 0.2s,
    background 0.3s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const FLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
`;
const FInput = styled.input`
  ${inputBase}
`;
const FSelect = styled.select`
  ${inputBase}
  background: ${({ theme }) => theme.colors.selectBg};
  cursor: pointer;
`;
const SaveBtn = styled.button`
  padding: 11px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 700;
  font-size: 0.88rem;
  margin-top: 4px;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.82;
  }
`;
const SuccessMsg = styled.div`
  padding: 9px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.income + "18"};
  border: 1px solid ${({ theme }) => theme.colors.income + "44"};
  color: ${({ theme }) => theme.colors.income};
  font-size: 0.82rem;
  text-align: center;
`;
const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  &:last-child {
    border-bottom: none;
  }
`;
const InfoKey = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const InfoVal = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text2};
  font-weight: 600;
`;
const ActionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const ActionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
`;
const ActionInfo = styled.div``;
const ActionLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const ActionDesc = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 2px;
`;
const DangerBtn = styled.button`
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  white-space: nowrap;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 0.82rem;
  background: ${({ $outline, theme }) =>
    $outline ? "transparent" : theme.colors.expense + "22"};
  border: 1px solid ${({ theme }) => theme.colors.expense + "44"};
  color: ${({ theme }) => theme.colors.expense};
  transition: all 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.expense + "33"};
    border-color: ${({ theme }) => theme.colors.expense};
  }
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
