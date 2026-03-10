import styled from "styled-components";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Tarjeta de bienvenida — parte superior de HomePage.
 *
 * Props:
 *   saludo   {string}  "Buenos días" | "Buenas tardes" | "Buenas noches"
 *   nombre   {string}  Nombre del usuario
 *   mes      {number}  Mes activo (1–12)
 *   anio     {number}  Año activo
 *   cantMovs {number}  Cantidad de movimientos del mes
 *   totalMes {number}  Monto total del mes
 *   moneda   {string}  Símbolo de moneda "$", "€", etc.
 */
export function WelcomeBanner({
  saludo,
  nombre,
  mes,
  anio,
  cantMovs,
  totalMes,
  moneda,
}) {
  return (
    <Card>
      <Glow />
      <Left>
        <SaludoText>{saludo},</SaludoText>
        <UserName>{nombre} 👋</UserName>
        <Sub>
          {MESES[mes - 1]} {anio} · {cantMovs} movimientos registrados
        </Sub>
      </Left>
      <Right>
        <BigMonto>
          {moneda} {totalMes.toLocaleString()}
        </BigMonto>
        <BigLabel>Total del mes</BigLabel>
      </Right>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) =>
    theme.mode === "dark"
      ? "linear-gradient(135deg, #13162a 0%, #181c38 60%, #1a1040 100%)"
      : `linear-gradient(135deg, ${theme.colors.bgCard} 0%, ${theme.colors.bgCardHov} 100%)`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 18px;
`;

const Glow = styled.div`
  position: absolute;
  top: -60px;
  right: -60px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ theme }) => theme.colors.accentGlow} 0%,
    transparent 70%
  );
  pointer-events: none;
`;

const Left = styled.div``;

const SaludoText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-bottom: 2px;
`;

const UserName = styled.h2`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  color: ${({ theme }) => theme.colors.text1};
`;

const Sub = styled.p`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 4px;
`;

const Right = styled.div`
  text-align: right;
`;

const BigMonto = styled.div`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  color: ${({ theme }) => theme.colors.accent};
`;

const BigLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
