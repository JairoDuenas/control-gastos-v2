import styled from "styled-components";

export function BarChart({ data }) {
  if (!data || data.length === 0) return <Empty>Sin datos</Empty>;
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <Wrap>
      {data.map((d, i) => {
        const pct = (d.value / maxVal) * 100;
        return (
          <BarCol key={i}>
            <BarTooltip>{d.value.toLocaleString()}</BarTooltip>
            <BarTrack>
              <BarFill
                $pct={pct}
                $color={d.color ?? "#5b8dee"}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            </BarTrack>
            <BarLabel>{d.label}</BarLabel>
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
  position: relative;
  &:hover > span {
    opacity: 1;
  }
`;
const BarTooltip = styled.span`
  position: absolute;
  top: -22px;
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.68rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text1};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
`;
const BarTrack = styled.div`
  width: 100%;
  flex: 1;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
`;
const BarFill = styled.div`
  width: 100%;
  height: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  animation: fadeUp 0.4s ease both;
`;
const BarLabel = styled.span`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.colors.text3};
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
