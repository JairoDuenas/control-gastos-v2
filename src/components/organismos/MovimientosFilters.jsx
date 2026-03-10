import styled from "styled-components";

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Barra de filtros de MovimientosPage.
 * Sin dispatch interno — comunica cambios al padre vía callbacks.
 *
 * Props:
 *   filtros       {object}              Estado actual de filtros del store
 *   categorias    {Array}               Lista de categorías para el select
 *   anios         {number[]}            Años disponibles para el select
 *   ordenDesc     {boolean}             true = recientes primero
 *   onTexto       {(texto) => void}
 *   onMes         {(mes) => void}
 *   onAnio        {(anio) => void}
 *   onCategoria   {(catId) => void}
 *   onOrdenToggle {() => void}
 */
export function MovimientosFilters({
  filtros,
  categorias,
  anios,
  ordenDesc,
  onTexto,
  onMes,
  onAnio,
  onCategoria,
  onOrdenToggle,
}) {
  const aniosDisponibles = anios.length ? anios : [new Date().getFullYear()];

  return (
    <Bar>
      <SearchInput
        placeholder="🔍 Buscar descripción…"
        value={filtros.texto}
        onChange={(e) => onTexto(e.target.value)}
      />

      <Group>
        <Select value={filtros.mes} onChange={(e) => onMes(e.target.value)}>
          {MESES.map((m, i) => (
            <option key={i} value={i + 1}>
              {m}
            </option>
          ))}
        </Select>

        <Select value={filtros.anio} onChange={(e) => onAnio(e.target.value)}>
          {aniosDisponibles.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </Select>

        <Select
          value={filtros.categoriaId ?? ""}
          onChange={(e) => onCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icono} {c.nombre}
            </option>
          ))}
        </Select>

        <SortBtn onClick={onOrdenToggle}>
          {ordenDesc ? "↓ Recientes" : "↑ Antiguos"}
        </SortBtn>
      </Group>
    </Bar>
  );
}

const Bar = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text1};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const Group = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 9px 12px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text1};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const SortBtn = styled.button`
  padding: 9px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.82rem;
  transition: all 0.18s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
  }
`;
