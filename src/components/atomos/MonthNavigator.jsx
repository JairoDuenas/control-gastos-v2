import styled from "styled-components";

/**
 * Navegador de mes — botones ‹ / › con etiqueta central.
 * Átomo visual puro: no toca Redux, recibe todo por props.
 *
 * Props:
 *   label   {string}   Texto del mes activo, ej. "Ene 2025"
 *   onPrev  {() => void}
 *   onNext  {() => void}
 */
export function MonthNavigator({ label, onPrev, onNext }) {
  return (
    <Wrap>
      <Btn onClick={onPrev} aria-label="Mes anterior">
        ‹
      </Btn>
      <Label>{label}</Label>
      <Btn onClick={onNext} aria-label="Mes siguiente">
        ›
      </Btn>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text1};
  min-width: 90px;
  text-align: center;
`;

const Btn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;
  font-size: 1.1rem;
  line-height: 1;
  transition: all 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text1};
  }
`;
