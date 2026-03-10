import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { deleteMovimiento, toggleEstado } from "../../slices/movimientosSlice";
import { Badge } from "../moleculas/Badge";

export function MovimientoItem({ mov, onEdit }) {
  const dispatch = useDispatch();
  const categorias = useSelector((s) => s.categorias.list);
  const moneda = useSelector((s) => s.auth.user?.moneda ?? "$");
  const [hovered, setHovered] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const cat = categorias.find((c) => c.id === mov.categoriaId);
  const date = new Date(mov.fecha).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Row
      $hovered={hovered}
      $paid={mov.estado === 1}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirmDel(false);
      }}
    >
      <CatIcon>{cat?.icono ?? "📦"}</CatIcon>
      <Info>
        <Desc>{mov.descripcion}</Desc>
        <Meta>
          <span>{cat?.nombre ?? "Sin categoría"}</span>
          <Sep>·</Sep>
          <span>{date}</span>
        </Meta>
      </Info>
      <Middle>
        <Badge estado={mov.estado} />
      </Middle>
      {/* ✅ $paid pasado al styled pero el color lo lee del tema */}
      <Amount $paid={mov.estado === 1}>
        {moneda}{" "}
        {mov.monto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </Amount>
      <Actions $visible={hovered}>
        <ActionBtn
          title="Marcar pagado/pendiente"
          onClick={() => dispatch(toggleEstado(mov.id))}
        >
          {mov.estado === 1 ? "⏳" : "✅"}
        </ActionBtn>
        <ActionBtn title="Editar" onClick={() => onEdit(mov)}>
          ✏️
        </ActionBtn>
        {confirmDel ? (
          <ActionBtn $danger onClick={() => dispatch(deleteMovimiento(mov.id))}>
            ¿Confirmar?
          </ActionBtn>
        ) : (
          <ActionBtn
            $danger
            title="Eliminar"
            onClick={() => setConfirmDel(true)}
          >
            🗑️
          </ActionBtn>
        )}
      </Actions>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: ${({ $hovered, theme }) =>
    $hovered ? theme.colors.bgCardHov : theme.colors.bgCard};
  border: 1px solid
    ${({ $hovered, theme }) =>
      $hovered ? theme.colors.borderHov : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.18s;
  animation: fadeUp 0.3s ease both;
  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;
const CatIcon = styled.span`
  font-size: 1.3rem;
  flex-shrink: 0;
`;
const Info = styled.div`
  flex: 1;
  min-width: 0;
`;
const Desc = styled.p`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text1};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 2px;
`;
const Sep = styled.span`
  opacity: 0.4;
`;
const Middle = styled.div`
  @media (max-width: 500px) {
    display: none;
  }
`;
/* ✅ Usa colores semánticos del tema en lugar de #43e97b / #ffcb05 hardcodeados */
const Amount = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ $paid, theme }) =>
    $paid ? theme.colors.income : theme.colors.pending};
  white-space: nowrap;
  flex-shrink: 0;
`;
const Actions = styled.div`
  display: flex;
  gap: 4px;
  opacity: ${({ $visible }) => ($visible ? 1 : 0.2)};
  transition: opacity 0.18s;
  @media (max-width: 768px) {
    opacity: 1;
  }
`;
const ActionBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 5px 7px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.85rem;
  transition: background 0.15s;
  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? `${theme.colors.expense}22` : theme.colors.border};
  }
`;
