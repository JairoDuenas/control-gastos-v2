import React from "react";
import styled from "styled-components";

export function KpiCard({ icon, label, value, sub, color, delay = 0 }) {
  return (
    <Card $color={color} style={{ animationDelay: `${delay}s` }}>
      <Glow $color={color} />
      <Top>
        <IconWrap $color={color}>{icon}</IconWrap>
        <Label>{label}</Label>
      </Top>
      <Value $color={color}>{value}</Value>
      {sub && <Sub>{sub}</Sub>}
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ $color }) => ($color ? `${$color}33` : "")};
  border-color: ${({ $color, theme }) =>
    $color ? `${$color}33` : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  animation: fadeUp 0.4s ease both;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5);
  }
`;
const Glow = styled.div`
  position: absolute;
  top: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${({ $color }) => ($color ? `${$color}18` : " transparent")} 0%,
    transparent 70%
  );
  pointer-events: none;
`;
const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;
const IconWrap = styled.span`
  font-size: 1.3rem;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ $color }) =>
    $color ? `${$color}18` : "rgba(255,255,255,0.05)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
const Label = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text3};
`;
const Value = styled.div`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  color: ${({ $color, theme }) => $color ?? theme.colors.text1};
  letter-spacing: -0.01em;
`;
const Sub = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text3};
  margin-top: 4px;
`;
