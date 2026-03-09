import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const NAV_ITEMS = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/home", icon: "🏠", label: "Home" },
  { to: "/movimientos", icon: "💸", label: "Movimientos" },
  { to: "/categorias", icon: "🗂️", label: "Categorías" },
  { to: "/config", icon: "⚙️", label: "Configuración" },
];

export function Sidebar({ open, onClose }) {
  const { total, pagados, pendientes } = useSelector((s) => s.movimientos);
  const moneda = useSelector((s) => s.auth.user?.moneda ?? "$");

  return (
    <>
      <Overlay $open={open} onClick={onClose} />
      <Wrapper $open={open}>
        <Nav>
          {NAV_ITEMS.map(({ to, icon, label }) => (
            <NavItem key={to} to={to} $open={open} onClick={onClose}>
              <IconWrap>{icon}</IconWrap>
              <Label $open={open}>{label}</Label>
            </NavItem>
          ))}
        </Nav>

        <Divider />

        <StatsSection>
          <StatRow>
            <StatIcon>💰</StatIcon>
            <StatInfo $open={open}>
              <StatValue>
                {moneda} {total.toLocaleString()}
              </StatValue>
              <StatLabel>Total</StatLabel>
            </StatInfo>
          </StatRow>
          <StatRow>
            <StatIcon>✅</StatIcon>
            <StatInfo $open={open}>
              <StatValue $color="#43e97b">
                {moneda} {pagados.toLocaleString()}
              </StatValue>
              <StatLabel>Pagados</StatLabel>
            </StatInfo>
          </StatRow>
          <StatRow>
            <StatIcon>⏳</StatIcon>
            <StatInfo $open={open}>
              <StatValue $color="#ffcb05">
                {moneda} {pendientes.toLocaleString()}
              </StatValue>
              <StatLabel>Pendientes</StatLabel>
            </StatInfo>
          </StatRow>
        </StatsSection>

        <Version $open={open}>{open ? "GastosPro v1.0" : "GP"}</Version>
      </Wrapper>
    </>
  );
}

const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
  }
`;
const Wrapper = styled.aside`
  position: fixed;
  top: ${({ theme }) => theme.header.height};
  left: 0;
  bottom: ${({ theme }) => theme.footer.height};
  z-index: 100;
  width: ${({ theme, $open }) =>
    $open ? theme.sidebar.width : theme.sidebar.collapsed};
  background: ${({ theme }) => theme.colors.bgSidebar};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  overflow: hidden;
  transition:
    width 0.28s ease,
    transform 0.28s ease;
  @media (min-width: 769px) {
    transform: translateX(0);
  }
  @media (max-width: 768px) {
    width: ${({ theme }) => theme.sidebar.width};
    transform: ${({ $open }) =>
      $open ? "translateX(0)" : "translateX(-100%)"};
    box-shadow: ${({ $open }) =>
      $open ? "4px 0 24px rgba(0,0,0,0.5)" : "none"};
  }
`;
const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px;
`;
const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text2};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  transition:
    background 0.18s,
    color 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text1};
  }
  &.active {
    background: ${({ theme }) => theme.colors.accentGlow};
    color: ${({ theme }) => theme.colors.accent};
    border: 1px solid ${({ theme }) => theme.colors.accent}33;
  }
`;
const IconWrap = styled.span`
  font-size: 1.1rem;
  flex-shrink: 0;
  width: 22px;
  text-align: center;
`;
const Label = styled.span`
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.2s;
  pointer-events: none;
  @media (max-width: 768px) {
    opacity: 1;
  }
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 12px 16px;
`;
const StatsSection = styled.div`
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;
const StatIcon = styled.span`
  font-size: 1rem;
  flex-shrink: 0;
  width: 22px;
  text-align: center;
`;
const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.2s;
  white-space: nowrap;
  @media (max-width: 768px) {
    opacity: 1;
  }
`;
const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.88rem;
  color: ${({ $color, theme }) => $color ?? theme.colors.text1};
`;
const StatLabel = styled.span`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.text3};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;
const Version = styled.div`
  margin-top: auto;
  padding: 0 20px 4px;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text3};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: opacity 0.2s;
  @media (max-width: 768px) {
    opacity: 1;
  }
`;
