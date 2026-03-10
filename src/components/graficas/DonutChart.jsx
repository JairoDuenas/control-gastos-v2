import styled, { useTheme } from "styled-components";

export function DonutChart({ data, size = 180, thickness = 32 }) {
  // ✅ Accede al tema para usar sus colores en el SVG (que no soporta styled-components directamente)
  const theme = useTheme();

  const r = (size - thickness) / 2;
  const cx = size / 2;
  const circ = 2 * Math.PI * r;
  const total = data.reduce((a, d) => a + d.value, 0);

  let offset = 0;
  const slices = data.map((d) => {
    const pct = total > 0 ? d.value / total : 0;
    const dash = pct * circ;
    const gap = circ - dash;
    const slice = { ...d, dash, gap, offset };
    offset += dash;
    return slice;
  });

  return (
    <Wrap>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* ✅ Track usa color del tema en lugar de #1e2440 hardcodeado */}
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={thickness}
        />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset + circ / 4}
            style={{ transition: "stroke-dasharray .5s ease" }}
          />
        ))}
        {/* ✅ Textos usan colores del tema en lugar de #edf0ff y #3d4f72 hardcodeados */}
        <text
          x={cx}
          y={cx - 6}
          textAnchor="middle"
          fill={theme.colors.text1}
          style={{
            fontFamily: "'Exo 2',sans-serif",
            fontWeight: 900,
            fontSize: 18,
          }}
        >
          {data.length}
        </text>
        <text
          x={cx}
          y={cx + 14}
          textAnchor="middle"
          fill={theme.colors.text3}
          style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10 }}
        >
          categorías
        </text>
      </svg>
      <Legend>
        {data.map((d, i) => (
          <LegItem key={i}>
            <LegDot $color={d.color} />
            <LegLabel>{d.label}</LegLabel>
            <LegVal $color={d.color}>{d.value.toLocaleString()}</LegVal>
          </LegItem>
        ))}
      </Legend>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: center;
`;
const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 140px;
`;
const LegItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const LegDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;
const LegLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text2};
  flex: 1;
  text-transform: capitalize;
`;
const LegVal = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.82rem;
  color: ${({ $color }) => $color};
`;
