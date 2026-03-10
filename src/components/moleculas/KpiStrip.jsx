import styled from "styled-components";

/**
 * Franja de 4 chips de resumen — parte superior de MovimientosPage.
 *
 * Props:
 *   total      {number}  Monto total de los movimientos filtrados
 *   pagados    {number}  Monto pagado de los movimientos filtrados
 *   pendientes {number}  Monto pendiente de los movimientos filtrados
 *   count      {number}  Cantidad de movimientos filtrados
 *   moneda     {string}  Símbolo de moneda
 *
 * Nota: $color recibe un hex directo porque estos colores son
 * semánticos fijos (accent, income, pending, purple) que no varían
 * con el tema claro/oscuro.
 */
export function KpiStrip({ total, pagados, pendientes, count, moneda }) {
  return (
    <Strip>
      <Chip $color="#5b8dee">
        <span>💰</span>
        <strong>
          {moneda} {total.toLocaleString()}
        </strong>
        <small>Total</small>
      </Chip>

      <Chip $color="#43e97b">
        <span>✅</span>
        <strong>
          {moneda} {pagados.toLocaleString()}
        </strong>
        <small>Pagados</small>
      </Chip>

      <Chip $color="#ffcb05">
        <span>⏳</span>
        <strong>
          {moneda} {pendientes.toLocaleString()}
        </strong>
        <small>Pendientes</small>
      </Chip>

      <Chip $color="#a78bfa">
        <span>📋</span>
        <strong>{count}</strong>
        <small>Movimientos</small>
      </Chip>
    </Strip>
  );
}

const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Chip = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => `${$color}33`};

  span {
    font-size: 1.1rem;
  }
  strong {
    font-family: ${({ theme }) => theme.fonts.head};
    font-weight: 700;
    font-size: 0.92rem;
    color: ${({ $color }) => $color};
  }
  small {
    font-size: 0.68rem;
    color: ${({ theme }) => theme.colors.text3};
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`;
