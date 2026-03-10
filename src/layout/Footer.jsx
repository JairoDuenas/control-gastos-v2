import styled from "styled-components";
import { useSelector } from "react-redux";

export function Footer() {
  const { list, filtered } = useSelector((s) => s.movimientos);
  const cats = useSelector((s) => s.categorias.list.length);

  return (
    <Wrapper>
      <Left>
        <Dot $color="#5b8dee" />
        GastosPro — Control de finanzas personales
      </Left>
      <Center>
        <Stat>
          <Val>{filtered.length}</Val>
          <Lab>movimientos</Lab>
        </Stat>
        <Sep>·</Sep>
        <Stat>
          <Val>{list.length}</Val>
          <Lab>total</Lab>
        </Stat>
        <Sep>·</Sep>
        <Stat>
          <Val $color="#a78bfa">{cats}</Val>
          <Lab>categorías</Lab>
        </Stat>
      </Center>
      <Right>
        v1.0
        <Dot $color="#43e97b" $pulse />
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: ${({ theme }) => theme.footer.height};
  background: ${({ theme }) => theme.colors.bgHeader};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  gap: 12px;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.text3};
  white-space: nowrap;
  @media (max-width: 600px) {
    display: none;
  }
`;
const Center = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.8rem;
`;
const Stat = styled.span`
  display: flex;
  align-items: baseline;
  gap: 4px;
`;
const Val = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.88rem;
  color: ${({ $color, theme }) => $color ?? theme.colors.text1};
`;
const Lab = styled.span`
  color: ${({ theme }) => theme.colors.text3};
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
const Sep = styled.span`
  color: ${({ theme }) => theme.colors.border};
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const Dot = styled.span`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $color }) => $color ?? "#888"};
  flex-shrink: 0;
  animation: ${({ $pulse }) =>
    $pulse ? "pulse 2s ease-in-out infinite" : "none"};
`;
