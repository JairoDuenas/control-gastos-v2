import styled from "styled-components";

export function BarChart({ data }) {
  if (!data || data.length === 0) return <Empty>Sin datos</Empty>;

  // Si todos los valores son 0, la gráfica no tiene escala real — mostrar aviso
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <Empty>Sin movimientos en este período</Empty>;

  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <Wrap>
      {data.map((d, i) => {
        const pct = (d.value / maxVal) * 100;
        const isEmpty = d.value === 0;
        return (
          <BarCol key={i}>
            <BarTooltip $empty={isEmpty}>
              {isEmpty ? "—" : d.value.toLocaleString()}
            </BarTooltip>
            {/* BarTrack ocupa flex:1 en vertical; el relleno va en ::after
                que crece desde abajo con height: pct% — igual que WeeklyActivity.
                Un <div> hijo con height:pct% dentro de un flex-item no funciona
                porque el browser no puede calcular el % sin una altura explícita. */}
            <BarTrack
              $pct={pct}
              $empty={isEmpty}
              $color={d.color ?? "#5b8dee"}
            />
            <BarLabel $empty={isEmpty}>{d.label}</BarLabel>
          </BarCol>
        );
      })}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 140px;
  width: 100%;
`;

const BarCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  position: relative;
  &:hover > span:first-child {
    opacity: 1;
  }
`;

const BarTooltip = styled.span`
  position: absolute;
  top: -22px;
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.68rem;
  font-weight: 700;
  color: ${({ $empty, theme }) =>
    $empty ? theme.colors.text3 : theme.colors.text1};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
`;

/* El relleno va en ::after que crece desde abajo — mismo patrón que WeeklyActivity.
   Así height: pct% tiene referencia concreta (altura del propio BarTrack = flex:1). */
const BarTrack = styled.div`
  width: 100%;
  flex: 1;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  position: relative;
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${({ $pct, $empty }) => ($empty ? "3px" : `${$pct}%`)};
    background: ${({ $color, $empty, theme }) =>
      $empty ? theme.colors.borderHov : $color};
    border-radius: 4px 4px 0 0;
    transition: height 0.6s ease;
  }
`;

const BarLabel = styled.span`
  font-size: 0.65rem;
  color: ${({ $empty, theme }) =>
    $empty ? theme.colors.text3 : theme.colors.text2};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`;

const Empty = styled.p`
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.85rem;
  text-align: center;
  padding: 20px 0;
`;
