import styled from "styled-components";

/* ── Contenedor raíz de cada página ── */
export const PageShell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? "20px"};
  animation: fadeUp 0.3s ease;
  /* ✅ Evita que el contenido se desborde horizontalmente */
  min-width: 0;
  width: 100%;
  overflow-x: hidden;
`;

/* ── Hero de página (banner superior) ── */
export const PageHero = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px 24px;
  border-radius: ${({ theme }) => theme.radii.lg};
  /* ✅ Gradiente usa colores del tema en lugar de #181c38 hardcodeado */
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? `linear-gradient(135deg, ${theme.colors.bgCard} 0%, #181c38 100%)`
      : `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgCardHov} 100%)`};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }
`;

export const HeroLeft = styled.div``;

export const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(1.4rem, 3vw, 2rem);
  color: ${({ theme }) => theme.colors.text1};
  letter-spacing: -0.02em;
`;

export const HeroSub = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text2};
  margin-top: 3px;
`;

export const HeroRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

/* ── Botón primario redondeado (usado en heroes) ── */
export const PrimaryBtn = styled.button`
  padding: 10px 22px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.88rem;
  white-space: nowrap;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.82;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
  }
`;

/* ── Tarjeta de sección (Card con título opcional) ── */
export const SectionCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid
    ${({ $color, theme }) => ($color ? `${$color}33` : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ $pad }) => $pad ?? "20px"};
  transition: transform 0.2s;
  /* ✅ Evita overflow interno */
  min-width: 0;
  overflow: hidden;
  ${({ $hoverable }) =>
    $hoverable && `&:hover { transform: translateY(-2px); }`}
`;

export const CardTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: 16px;
`;

/* ── Grid de 2 columnas ── */
export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ $gap }) => $gap ?? "16px"};
  align-items: ${({ $align }) => $align ?? "stretch"};

  @media (max-width: ${({ $bp }) => $bp ?? "700px"}) {
    grid-template-columns: 1fr;
  }
`;

/* ── Grid de estadísticas: 4 col → 2 col ── */
export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ $gap }) => $gap ?? "12px"};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

/* ── Item de estadística (icono / valor / etiqueta) ── */
export const StatItem = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => ($color ? `${$color}33` : "transparent")};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px;
  text-align: center;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-2px);
  }
`;

export const StatIcon = styled.div`
  font-size: ${({ $size }) => $size ?? "1.3rem"};
  margin-bottom: 6px;
`;

export const StatVal = styled.div`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: ${({ $size }) => $size ?? "1.2rem"};
  color: ${({ $color, theme }) => $color ?? theme.colors.text1};
`;

export const StatLab = styled.div`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 3px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

/* ── Lista de movimientos ── */
export const MovList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
