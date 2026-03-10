import styled from "styled-components";

/**
 * Barras de actividad semanal — sección "📅 Actividad semanal" de HomePage.
 *
 * Props:
 *   semanas  {Array<{ label: string, value: number }>}  4 semanas con etiqueta y monto
 *   maxSem   {number}  Valor máximo entre las 4 semanas (para escalar las barras al 100%)
 *   moneda   {string}  Símbolo de moneda
 */
export function WeeklyActivity({ semanas, maxSem, moneda }) {
  return (
    <Bars>
      {semanas.map((s, i) => {
        const pct = maxSem > 0 ? (s.value / maxSem) * 100 : 0;
        const display =
          s.value > 999
            ? (s.value / 1000).toFixed(1) + "k"
            : s.value.toLocaleString();

        return (
          <Col key={i}>
            <Bar $pct={pct} />
            <BarLabel>{s.label}</BarLabel>
            <BarVal>
              {moneda} {display}
            </BarVal>
          </Col>
        );
      })}
    </Bars>
  );
}

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 110px;
`;

const Col = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
`;

const Bar = styled.div`
  width: 100%;
  flex: 1;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 6px 6px 0 0;
  overflow: hidden;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${({ $pct }) => $pct}%;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.accent} 0%,
      ${({ theme }) => theme.colors.accent}99 100%
    );
    border-radius: 6px 6px 0 0;
    transition: height 0.5s ease;
  }
`;

const BarLabel = styled.span`
  font-size: 0.62rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
`;

const BarVal = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text2};
  font-weight: 600;
`;
