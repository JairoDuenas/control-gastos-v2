import styled from "styled-components";

/**
 * Banner de perfil — parte superior de ConfigPage.
 * Props:
 *   user       {{ nombre, email }}
 *   themeMode  {"dark" | "light"}
 */
export function ProfileHero({ user, themeMode }) {
  const initial = (user?.nombre?.[0] ?? "U").toUpperCase();

  return (
    <Wrap>
      <Avatar>{initial}</Avatar>
      <Info>
        <Name>{user?.nombre}</Name>
        <Email>{user?.email}</Email>
        <ThemePill $mode={themeMode}>
          {themeMode === "dark" ? "🌙 Tema oscuro" : "☀️ Tema claro"}
        </ThemePill>
      </Info>
    </Wrap>
  );
}

const Wrap = styled.div`
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

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.h2`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text1};
`;

const Email = styled.p`
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
