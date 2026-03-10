import styled from "styled-components";

export function Badge({ estado }) {
  return (
    <Wrap $paid={estado === 1}>
      {estado === 1 ? "✓ Pagado" : "⏳ Pendiente"}
    </Wrap>
  );
}

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: ${({ $paid }) =>
    $paid ? "rgba(67,233,123,0.12)" : "rgba(255,203,5,0.12)"};
  border: 1px solid
    ${({ $paid }) => ($paid ? "rgba(67,233,123,0.35)" : "rgba(255,203,5,0.35)")};
  color: ${({ $paid }) => ($paid ? "#43e97b" : "#ffcb05")};
`;
