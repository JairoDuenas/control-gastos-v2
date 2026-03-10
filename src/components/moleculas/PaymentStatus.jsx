import styled from "styled-components";

/**
 * Barras de estado de pagos — sección "💳 Estado de pagos" de HomePage.
 * Reutilizable en cualquier vista que necesite mostrar pagado vs pendiente.
 *
 * Props:
 *   pagados    {number}  Monto total pagado
 *   pendientes {number}  Monto total pendiente
 *   pctPagado  {number}  Porcentaje pagado (0–100)
 *   moneda     {string}  Símbolo de moneda
 */
export function PaymentStatus({ pagados, pendientes, pctPagado, moneda }) {
  const colorBadge = pctPagado > 70 ? "income" : "pending";

  return (
    <Wrap>
      <Row>
        <Label>Pagados</Label>
        {/* $color recibe token semántico ("income" | "pending") resuelto en theme.colors */}
        <Val $color="income">
          {moneda} {pagados.toLocaleString()}
        </Val>
      </Row>
      <Bar>
        <Fill $pct={pctPagado} $color="income" />
      </Bar>

      <Row>
        <Label>Pendientes</Label>
        <Val $color="pending">
          {moneda} {pendientes.toLocaleString()}
        </Val>
      </Row>
      <Bar>
        <Fill $pct={100 - pctPagado} $color="pending" />
      </Bar>

      <Badge $color={colorBadge}>{pctPagado}% pagado</Badge>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text2};
`;

const Val = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.85rem;
  color: ${({ $color, theme }) => theme.colors[$color] ?? theme.colors.text1};
`;

const Bar = styled.div`
  height: 8px;
  border-radius: 99px;
  background: ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color, theme }) =>
    theme.colors[$color] ?? theme.colors.accent};
  border-radius: 99px;
  transition: width 0.6s ease;
`;

const Badge = styled.div`
  align-self: flex-start;
  margin-top: 4px;
  padding: 3px 12px;
  border-radius: 99px;
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.75rem;
  background: ${({ $color, theme }) =>
    `${theme.colors[$color] ?? theme.colors.accent}18`};
  border: 1px solid
    ${({ $color, theme }) => `${theme.colors[$color] ?? theme.colors.accent}44`};
  color: ${({ $color, theme }) => theme.colors[$color] ?? theme.colors.accent};
`;
