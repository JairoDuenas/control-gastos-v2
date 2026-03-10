import styled from "styled-components";

/**
 * Paginador genérico con elipsis — reutilizable en cualquier página.
 * No sabe nada de movimientos ni de Redux.
 *
 * Props:
 *   page         {number}              Página activa (1-based)
 *   totalPages   {number}              Total de páginas
 *   onPageChange {(page: number) => void}  Callback al cambiar página
 */
export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Construye el array de páginas visibles con elipsis ("…") donde corresponda
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, i, arr) => {
      if (i > 0 && p - arr[i - 1] > 1) acc.push("…");
      acc.push(p);
      return acc;
    }, []);

  return (
    <Wrap>
      <Btn disabled={page <= 1} onClick={() => onPageChange(1)}>
        «
      </Btn>
      <Btn disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ‹
      </Btn>

      {pages.map((p, i) =>
        typeof p === "string" ? (
          <Dots key={`dots-${i}`}>{p}</Dots>
        ) : (
          <Btn key={p} $active={p === page} onClick={() => onPageChange(p)}>
            {p}
          </Btn>
        ),
      )}

      <Btn disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        ›
      </Btn>
      <Btn
        disabled={page >= totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        »
      </Btn>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 8px 0;
`;

const Btn = styled.button`
  width: 34px;
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentGlow : "transparent"};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.accent : theme.colors.text2};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.85rem;
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: all 0.15s;
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Dots = styled.span`
  color: ${({ theme }) => theme.colors.text3};
  padding: 0 4px;
`;
