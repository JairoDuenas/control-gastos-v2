import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategoria } from "../../slices/categoriasSlice";

export function CategoriaCard({ cat, onEdit }) {
  const dispatch = useDispatch();
  const movs = useSelector((s) =>
    s.movimientos.list.filter((m) => m.categoriaId === cat.id),
  );
  const moneda = useSelector((s) => s.auth.user?.moneda ?? "$");
  const total = movs.reduce((a, m) => a + m.monto, 0);
  const [confirm, setConfirm] = useState(false);

  return (
    <Card $color={cat.color}>
      <Glow $color={cat.color} />
      <Top>
        <IconCircle $color={cat.color}>{cat.icono}</IconCircle>
        <Actions>
          <ActionBtn onClick={() => onEdit(cat)} title="Editar">
            ✏️
          </ActionBtn>
          {confirm ? (
            <ActionBtn
              $danger
              onClick={() => dispatch(deleteCategoria(cat.id))}
            >
              ¿Sí?
            </ActionBtn>
          ) : (
            <ActionBtn
              $danger
              onClick={() => setConfirm(true)}
              title="Eliminar"
            >
              🗑️
            </ActionBtn>
          )}
        </Actions>
      </Top>
      <CatName>{cat.nombre}</CatName>
      <CatStats>
        <StatLine>
          <StatNum $color={cat.color}>{movs.length}</StatNum>
          <StatLab>movimientos</StatLab>
        </StatLine>
        <StatLine>
          <StatNum $color={cat.color}>
            {moneda} {total.toLocaleString()}
          </StatNum>
          <StatLab>total</StatLab>
        </StatLine>
      </CatStats>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => `${$color}33`};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 18px;
  animation: fadeUp 0.35s ease both;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }
`;
const Glow = styled.div`
  position: absolute;
  top: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ $color }) => `${$color}18`} 0%,
    transparent 70%
  );
  pointer-events: none;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;
const IconCircle = styled.div`
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 1.4rem;
  background: ${({ $color }) => `${$color}18`};
  border: 1px solid ${({ $color }) => `${$color}33`};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Actions = styled.div`
  display: flex;
  gap: 4px;
`;
const ActionBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.82rem;
  transition: background 0.15s;
  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(255,89,89,0.15)" : "rgba(255,255,255,0.06)"};
  }
`;
const CatName = styled.h3`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.text1};
  margin-bottom: 10px;
`;
const CatStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const StatLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;
const StatNum = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ $color }) => $color};
`;
const StatLab = styled.span`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text3};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
