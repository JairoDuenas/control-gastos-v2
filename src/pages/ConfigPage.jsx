import { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateUser, logout } from "../slices/authSlice";
import { setTheme } from "../slices/uiSlice";
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

const THEMES = [
  {
    id: "dark",
    label: "Oscuro",
    icon: "🌙",
    preview: {
      bg: "#0d0f1a",
      card: "#13162a",
      text: "#edf0ff",
      accent: "#5b8dee",
      border: "#1e2440",
    },
  },
  {
    id: "light",
    label: "Claro",
    icon: "☀️",
    preview: {
      bg: "#f0f2f8",
      card: "#ffffff",
      text: "#1a1f36",
      accent: "#5b8dee",
      border: "#dde1f0",
    },
  },
];

export function ConfigPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const themeMode = useSelector((s) => s.ui.themeMode);
  const movs = useSelector((s) => s.movimientos.list);
  const cats = useSelector((s) => s.categorias.list);

  const [form, setForm] = useState({
    nombre: user?.nombre ?? "",
    email: user?.email ?? "",
    moneda: user?.moneda ?? "$",
  });
  const [saved, setSaved] = useState(false);
  const [clearing, setClearing] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateUser(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  const handleClearData = () => {
    if (!clearing) {
      setClearing(true);
      return;
    }
    localStorage.removeItem("gastos_movimientos");
    localStorage.removeItem("gastos_categorias");
    window.location.reload();
  };

  const totalGastado = movs.reduce((a, m) => a + m.monto, 0);
  const catsUsadas = new Set(movs.map((m) => m.categoriaId)).size;

  return (
    <PageShell>
      <ProfileHero>
        <Avatar>{(user?.nombre?.[0] ?? "U").toUpperCase()}</Avatar>
        <HeroInfo>
          <HeroName>{user?.nombre}</HeroName>
          <HeroEmail>{user?.email}</HeroEmail>
          <ThemePill $mode={themeMode}>
            {themeMode === "dark" ? "🌙 Tema oscuro" : "☀️ Tema claro"}
          </ThemePill>
        </HeroInfo>
      </ProfileHero>

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

      <SectionCard>
        <CardTitle>🎨 Apariencia</CardTitle>
        <ThemeGrid>
          {THEMES.map((t) => (
            <ThemeOption
              key={t.id}
              $active={themeMode === t.id}
              $preview={t.preview}
              onClick={() => dispatch(setTheme(t.id))}
            >
              <ThemePreview $preview={t.preview}>
                <PreviewSidebar $preview={t.preview}>
                  {[...Array(4)].map((_, i) => (
                    <PreviewNavItem
                      key={i}
                      $preview={t.preview}
                      $accent={i === 0}
                    />
                  ))}
                </PreviewSidebar>
                <PreviewContent $preview={t.preview}>
                  <PreviewCard $preview={t.preview} />
                  <PreviewCard $preview={t.preview} $short />
                </PreviewContent>
              </ThemePreview>
              <ThemeLabel>
                <ThemeIcon>{t.icon}</ThemeIcon>
                <ThemeName $active={themeMode === t.id}>{t.label}</ThemeName>
                {themeMode === t.id && <ActiveDot />}
              </ThemeLabel>
            </ThemeOption>
          ))}
        </ThemeGrid>

        <ToggleRow>
          <ToggleLabel>Cambio rápido</ToggleLabel>
          <ToggleSwitch
            $checked={themeMode === "light"}
            onClick={() =>
              dispatch(setTheme(themeMode === "dark" ? "light" : "dark"))
            }
          >
            <ToggleKnob $checked={themeMode === "light"}>
              {themeMode === "light" ? "☀️" : "🌙"}
            </ToggleKnob>
          </ToggleSwitch>
          <ToggleDesc>
            {themeMode === "dark" ? "Oscuro activo" : "Claro activo"}
          </ToggleDesc>
        </ToggleRow>
      </SectionCard>

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

/* ── Styled ── */
const ProfileHero = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.bgCard} 0%,
    ${({ theme }) => (theme.mode === "dark" ? "#181c38" : "#e8ecfa")} 100%
  );
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: background 0.3s;
  @media (max-width: 500px) {
    flex-wrap: wrap;
    padding: 18px;
  }
`;
const Avatar = styled.div`
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.accent},
    #a78bfa
  );
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 1.8rem;
  color: #fff;
  flex-shrink: 0;
`;
const HeroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const HeroName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const HeroEmail = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const ThemePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.72rem;
  font-weight: 600;
  background: ${({ $mode }) =>
    $mode === "dark" ? "rgba(91,141,238,.15)" : "rgba(255,203,5,.15)"};
  border: 1px solid
    ${({ $mode }) =>
      $mode === "dark" ? "rgba(91,141,238,.3)" : "rgba(200,144,0,.3)"};
  color: ${({ $mode }) => ($mode === "dark" ? "#5b8dee" : "#c89000")};
  width: fit-content;
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;
const ThemeOption = styled.div`
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 2px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.border};
  overflow: hidden;
  cursor: pointer;
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  background: ${({ $preview }) => $preview.bg};
  box-shadow: ${({ $active, theme }) =>
    $active ? `0 0 0 3px ${theme.colors.accentGlow}` : "none"};
  &:hover {
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const ThemePreview = styled.div`
  height: 90px;
  display: flex;
  overflow: hidden;
  background: ${({ $preview }) => $preview.bg};
`;
const PreviewSidebar = styled.div`
  width: 36px;
  background: ${({ $preview }) => $preview.card};
  border-right: 1px solid ${({ $preview }) => $preview.border};
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
`;
const PreviewNavItem = styled.div`
  height: 6px;
  border-radius: 3px;
  background: ${({ $accent, $preview }) =>
    $accent ? $preview.accent : $preview.border};
  width: ${({ $short }) => ($short ? "60%" : "90%")};
`;
const PreviewContent = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: ${({ $preview }) => $preview.bg};
`;
const PreviewCard = styled.div`
  border-radius: 4px;
  background: ${({ $preview }) => $preview.card};
  border: 1px solid ${({ $preview }) => $preview.border};
  height: ${({ $short }) => ($short ? "22px" : "38px")};
`;
const ThemeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgCard};
`;
const ThemeIcon = styled.span`
  font-size: 1rem;
`;
const ThemeName = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.88rem;
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.text1};
  flex: 1;
`;
const pulse = keyframes`0%,100%{opacity:1}50%{opacity:.5}`;
const ActiveDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.accent};
  animation: ${pulse} 2s ease infinite;
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
const ToggleLabel = styled.span`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text2};
  min-width: 100px;
`;
const ToggleDesc = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const ToggleSwitch = styled.div`
  width: 52px;
  height: 28px;
  border-radius: 14px;
  cursor: pointer;
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.accent : theme.colors.border};
  position: relative;
  transition: background 0.3s;
  flex-shrink: 0;
`;
const ToggleKnob = styled.div`
  position: absolute;
  top: 3px;
  left: ${({ $checked }) => ($checked ? "27px" : "3px")};
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: left 0.3s;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
`;

/* ✅ inputBase como css`` helper — antes era una función que retornaba string,
   lo que styled-components NO puede interpolar correctamente */
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
  background: ${({ theme }) => `${theme.colors.income}18`};
  border: 1px solid ${({ theme }) => `${theme.colors.income}44`};
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
    $outline ? "transparent" : `${theme.colors.expense}22`};
  border: 1px solid ${({ theme }) => `${theme.colors.expense}44`};
  color: ${({ theme }) => theme.colors.expense};
  transition: all 0.18s;
  &:hover {
    background: ${({ theme }) => `${theme.colors.expense}33`};
    border-color: ${({ theme }) => theme.colors.expense};
  }
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;
