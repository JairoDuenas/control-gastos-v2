import { useEffect } from "react";
import styled from "styled-components";

export function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Backdrop onClick={onClose}>
      <Box onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Box>
    </Backdrop>
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.2s ease;
`;
const Box = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.xl};
  width: 100%;
  max-width: 500px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
  animation: fadeUp 0.25s ease;
`;
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;
const ModalTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text1};
`;
const CloseBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text3};
  font-size: 1rem;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition:
    color 0.2s,
    background 0.2s;
  &:hover {
    color: ${({ theme }) => theme.colors.text1};
    background: ${({ theme }) => theme.colors.border};
  }
`;
const ModalBody = styled.div`
  padding: 20px 24px 24px;
`;
