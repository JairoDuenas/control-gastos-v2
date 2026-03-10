import styled, { keyframes } from "styled-components";

/**
 * Selector de tema — grid de previews + toggle rápido.
 * Props:
 *   themeMode     {"dark" | "light"}
 *   onThemeChange {(id: string) => void}   el padre despacha setTheme
 */

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

export function ThemePicker({ themeMode, onThemeChange }) {
  return (
    <>
      <ThemeGrid>
        {THEMES.map((t) => (
          <ThemeOption
            key={t.id}
            $active={themeMode === t.id}
            $preview={t.preview}
            onClick={() => onThemeChange(t.id)}
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
          onClick={() => onThemeChange(themeMode === "dark" ? "light" : "dark")}
        >
          <ToggleKnob $checked={themeMode === "light"}>
            {themeMode === "light" ? "☀️" : "🌙"}
          </ToggleKnob>
        </ToggleSwitch>
        <ToggleDesc>
          {themeMode === "dark" ? "Oscuro activo" : "Claro activo"}
        </ToggleDesc>
      </ToggleRow>
    </>
  );
}

/* ── Styled ── */
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
