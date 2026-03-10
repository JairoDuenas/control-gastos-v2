import styled from "styled-components";

const MEDALLAS = ["🥇", "🥈", "🥉"];

/**
 * Ranking de top 5 categorías del mes — sección "🏆 Top categorías" de HomePage.
 *
 * Props:
 *   topCats  {Array<{ cat, total, count }>}  Categorías ordenadas por total desc
 *   maxCat   {number}  Total de la primera categoría (para escalar las barras)
 *   moneda   {string}  Símbolo de moneda
 */
export function TopCategorias({ topCats, maxCat, moneda }) {
  if (topCats.length === 0) {
    return <Empty>Sin movimientos este mes.</Empty>;
  }

  return (
    <List>
      {topCats.map(({ cat, total, count }, i) => (
        <Row key={i}>
          <Rank>{i < 3 ? MEDALLAS[i] : `#${i + 1}`}</Rank>

          <Icon>{cat?.icono ?? "📦"}</Icon>

          <Info>
            <CatName>{cat?.nombre ?? "Sin categoría"}</CatName>
            <CatSub>
              {count} movimiento{count !== 1 ? "s" : ""}
            </CatSub>
          </Info>

          <BarWrap>
            <BarFill
              $pct={(total / maxCat) * 100}
              $color={cat?.color ?? "#7b8db8"}
            />
          </BarWrap>

          <Total $color={cat?.color ?? "#7b8db8"}>
            {moneda} {total.toLocaleString()}
          </Total>
        </Row>
      ))}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Rank = styled.span`
  font-size: 0.8rem;
  min-width: 24px;
  text-align: center;
`;

const Icon = styled.span`
  font-size: 1.1rem;
`;

const Info = styled.div`
  min-width: 90px;
`;

const CatName = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text1};
`;

const CatSub = styled.p`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text3};
`;

const BarWrap = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 99px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color};
  border-radius: 99px;
  transition: width 0.5s ease;
`;

const Total = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.82rem;
  color: ${({ $color }) => $color};
  white-space: nowrap;
  min-width: 70px;
  text-align: right;
`;

const Empty = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
  text-align: center;
  padding: 20px 0;
`;
