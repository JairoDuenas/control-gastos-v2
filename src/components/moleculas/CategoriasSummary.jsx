import styled from "styled-components";

/**
 * Barra de resumen horizontal con scroll — muestra cada categoría
 * con su porcentaje del total global.
 *
 * Props:
 *   categorias   {Array<{ id, nombre, icono, color }>}
 *   movimientos  {Array<{ categoriaId, monto }>}
 */
export function CategoriasSummary({ categorias, movimientos }) {
  const totalGlobal = movimientos.reduce((a, m) => a + m.monto, 0);

  if (categorias.length === 0) return null;

  return (
    <ScrollRow>
      {categorias.map((cat) => {
        const total = movimientos
          .filter((m) => m.categoriaId === cat.id)
          .reduce((a, m) => a + m.monto, 0);
        const pct = totalGlobal > 0 ? (total / totalGlobal) * 100 : 0;

        return (
          <Chip key={cat.id} $color={cat.color}>
            <ChipIcon>{cat.icono}</ChipIcon>
            <ChipInfo>
              <ChipName>{cat.nombre}</ChipName>
              <ChipPct>{pct.toFixed(1)}%</ChipPct>
            </ChipInfo>
            <ChipBar>
              <ChipFill $pct={pct} $color={cat.color} />
            </ChipBar>
          </Chip>
        );
      })}
    </ScrollRow>
  );
}

/* Siempre scroll horizontal — evita que los chips colapsen en mobile */
const ScrollRow = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
  flex-wrap: nowrap;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;
  }

  @media (max-width: 600px) {
    padding-left: 2px;
    padding-right: 2px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
  }
`;

const Chip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => $color + "33"};
  flex: 0 0 148px;
  min-width: 148px;

  @media (max-width: 600px) {
    scroll-snap-align: start;
    flex: 0 0 140px;
    min-width: 140px;
  }
`;

const ChipIcon = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const ChipInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ChipName = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.78rem;
  color: ${({ theme }) => theme.colors.text1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChipPct = styled.p`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.text3};
`;

const ChipBar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
`;

/* Relleno desde abajo con height absoluto — evita el bug de height:% en flex */
const ChipFill = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  transition: height 0.5s ease;
`;
