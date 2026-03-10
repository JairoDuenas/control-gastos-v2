import { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addCategoria, editCategoria } from "../slices/categoriasSlice";
import { CAT_COLORS } from "../styles/theme";

const ICONOS = [
  "🛒",
  "🚗",
  "🏠",
  "💊",
  "🎮",
  "👕",
  "📚",
  "📦",
  "✈️",
  "🍕",
  "💪",
  "🎵",
  "🐾",
  "💡",
  "📱",
  "🎓",
];

const EMPTY = { nombre: "", icono: "📦", color: CAT_COLORS[0] };

export function CategoriaForm({ editItem, onDone }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setForm(editItem ? { ...editItem } : EMPTY);
  }, [editItem]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre) return;
    if (editItem) dispatch(editCategoria({ ...form, id: editItem.id }));
    else dispatch(addCategoria(form));
    onDone();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <FLabel>Nombre</FLabel>
        <FInput
          value={form.nombre}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="Ej: Transporte"
          required
        />
      </Field>
      <Field>
        <FLabel>Ícono</FLabel>
        <IconGrid>
          {ICONOS.map((ic) => (
            <IconBtn
              key={ic}
              type="button"
              $active={form.icono === ic}
              onClick={() => set("icono", ic)}
            >
              {ic}
            </IconBtn>
          ))}
        </IconGrid>
      </Field>
      <Field>
        <FLabel>Color</FLabel>
        <ColorGrid>
          {CAT_COLORS.map((c) => (
            <ColorDot
              key={c}
              $color={c}
              $active={form.color === c}
              type="button"
              onClick={() => set("color", c)}
            />
          ))}
        </ColorGrid>
      </Field>
      <Preview $color={form.color}>
        <span>{form.icono}</span>
        <span>{form.nombre || "Vista previa"}</span>
      </Preview>
      <BtnRow>
        <CancelBtn type="button" onClick={onDone}>
          Cancelar
        </CancelBtn>
        <SubmitBtn type="submit">{editItem ? "Guardar" : "Crear"}</SubmitBtn>
      </BtnRow>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const FLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
`;
const FInput = styled.input`
  padding: 10px 13px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  outline: none;
  /* ✅ Antes: color: #edf0ff hardcodeado */
  color: ${({ theme }) => theme.colors.text1};
  font-family: inherit;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  &:focus {
    /* ✅ Antes: border-color: #5b8dee hardcodeado */
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const IconGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 1.1rem;
  border: 1.5px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.accent : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accentGlow : "transparent"};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;
const ColorGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const ColorDot = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.15s;
  /* ✅ Antes: border-color: #fff hardcodeado — ahora usa bg del card para contraste en ambos temas */
  border: 2.5px solid
    ${({ $active, theme }) => ($active ? theme.colors.text1 : "transparent")};
  transform: ${({ $active }) => ($active ? "scale(1.2)" : "scale(1)")};
`;
const Preview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $color }) => `${$color}15`};
  border: 1px solid ${({ $color }) => `${$color}33`};
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text1};
  span:first-child {
    font-size: 1.2rem;
  }
`;
const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;
const CancelBtn = styled.button`
  padding: 10px 20px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text2};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 0.88rem;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;
const SubmitBtn = styled.button`
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 700;
  font-size: 0.88rem;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;
