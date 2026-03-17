import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { addMovimiento, editMovimiento } from "../slices/movimientosSlice";
import {
  addMovimientoAsync,
  editMovimientoAsync,
} from "../slices/movimientosSlice";

const EMPTY = {
  descripcion: "",
  monto: "",
  categoriaId: "",
  fecha: "",
  estado: 0,
};

export function MovimientoForm({ editItem, onDone }) {
  const dispatch = useDispatch();
  const categorias = useSelector((s) => s.categorias.list);
  const { user, isDemo } = useSelector((s) => s.auth);
  const synced = useSelector((s) => s.categorias.synced);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (editItem) {
      setForm({
        ...editItem,
        fecha: editItem.fecha
          ? new Date(editItem.fecha).toISOString().split("T")[0]
          : "",
      });
    } else {
      setForm({ ...EMPTY, fecha: new Date().toISOString().split("T")[0] });
    }
  }, [editItem]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.descripcion || !form.monto || !form.categoriaId) return;
    const payload = {
      ...form,
      monto: parseFloat(form.monto),
      // Demo usa id numérico string ("1","2"…), Google usa UUID string
      // En ambos casos se mantiene como string — NO parseInt
      categoriaId: form.categoriaId,
      fecha: form.fecha
        ? new Date(form.fecha).toISOString()
        : new Date().toISOString(),
    };
    if (isDemo) {
      // Modo Demo — solo localStorage
      if (editItem) dispatch(editMovimiento({ ...payload, id: editItem.id }));
      else dispatch(addMovimiento(payload));
    } else {
      // Modo Google — sincroniza con Supabase
      if (editItem)
        dispatch(
          editMovimientoAsync({ payload: { ...payload, id: editItem.id } }),
        );
      else dispatch(addMovimientoAsync({ userId: user.id, payload }));
    }
    onDone();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Field>
        <FLabel>Descripción</FLabel>
        <FInput
          value={form.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Ej: Supermercado"
          required
        />
      </Field>
      <Row>
        <Field>
          <FLabel>Monto</FLabel>
          <FInput
            type="number"
            min="0"
            step="0.01"
            value={form.monto}
            onChange={(e) => set("monto", e.target.value)}
            placeholder="0.00"
            required
          />
        </Field>
        <Field>
          <FLabel>Fecha</FLabel>
          <FInput
            type="date"
            value={form.fecha}
            onChange={(e) => set("fecha", e.target.value)}
            required
          />
        </Field>
      </Row>
      <Row>
        <Field>
          <FLabel>Categoría</FLabel>
          <FSelect
            value={form.categoriaId}
            onChange={(e) => set("categoriaId", e.target.value)}
            required
          >
            <option value="">Seleccionar…</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icono} {c.nombre}
              </option>
            ))}
          </FSelect>
        </Field>
        <Field>
          <FLabel>Estado</FLabel>
          <FSelect
            value={form.estado}
            onChange={(e) => set("estado", parseInt(e.target.value))}
          >
            <option value={0}>⏳ Pendiente</option>
            <option value={1}>✅ Pagado</option>
          </FSelect>
        </Field>
      </Row>
      <BtnRow>
        <CancelBtn type="button" onClick={onDone}>
          Cancelar
        </CancelBtn>
        <SubmitBtn type="submit" disabled={!isDemo && !synced}>
          {editItem ? "Guardar cambios" : "Agregar"}
        </SubmitBtn>
      </BtnRow>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
`;

/* ✅ inputBase como css`` helper — las interpolaciones de theme se resuelven correctamente */
const inputBase = css`
  padding: 10px 13px;
  background: ${({ theme }) => theme.colors.inputBg};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
  /* ✅ Usa color del tema en lugar de #edf0ff hardcodeado */
  color: ${({ theme }) => theme.colors.text1};
  transition: border-color 0.2s;
  /* ✅ Usa accent del tema en lugar de #5b8dee hardcodeado */
  &:focus {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const FInput = styled.input`
  ${inputBase}
`;

const FSelect = styled.select`
  ${inputBase}
  background: ${({ theme }) => theme.colors.selectBg};
  cursor: pointer;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
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
