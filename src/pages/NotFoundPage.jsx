import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Page>
      <Code>404</Code>
      <Title>Página no encontrada</Title>
      <Desc>La ruta que buscás no existe.</Desc>
      <BackBtn onClick={() => navigate("/dashboard")}>
        ← Volver al Dashboard
      </BackBtn>
    </Page>
  );
}
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: ${({ theme }) => theme.colors.bg};
  animation: fadeUp 0.4s ease;
`;
const Code = styled.h1`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(5rem, 15vw, 8rem);
  color: ${({ theme }) => theme.colors.border};
  line-height: 1;
`;
const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text2};
`;
const Desc = styled.p`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text3};
`;
const BackBtn = styled.button`
  margin-top: 8px;
  padding: 11px 26px;
  border-radius: ${({ theme }) => theme.radii.full};
  border: none;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.9rem;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.82;
  }
`;
