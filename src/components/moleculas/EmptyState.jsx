import styled from "styled-components";

export function EmptyState({ icon = "📭", title, desc, action, onAction }) {
  return (
    <Wrap>
      <Icon>{icon}</Icon>
      <Title>{title}</Title>
      {desc && <Desc>{desc}</Desc>}
      {action && <ActionBtn onClick={onAction}>{action}</ActionBtn>}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 20px;
  text-align: center;
  animation: fadeUp 0.4s ease both;
`;
const Icon = styled.div`
  font-size: 3rem;
  line-height: 1;
`;
const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 1.05rem;
  color: ${({ theme }) => theme.colors.text2};
`;
const Desc = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text3};
  max-width: 320px;
`;
const ActionBtn = styled.button`
  margin-top: 6px;
  padding: 10px 24px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  color: #fff;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 700;
  font-size: 0.88rem;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.82;
  }
`;
