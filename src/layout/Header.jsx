import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import { toggleTheme } from "../slices/uiSlice";

export function Header({ onToggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const themeMode = useSelector((s) => s.ui.themeMode);
  const { total, pagados, pendientes } = useSelector((s) => s.movimientos);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Wrapper>
      <Left>
        <HamBtn onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <span />
          <span />
          <span />
        </HamBtn>
        <LogoWrap>
          <LogoIcon>💰</LogoIcon>
          <LogoText>
            Gastos<Accent>Pro</Accent>
          </LogoText>
        </LogoWrap>
      </Left>

      <Center>
        <KpiRow>
          <KpiItem>
            <KpiVal $color={({ theme }) => theme.colors.text1}>
              {user?.moneda ?? "$"} {total.toLocaleString()}
            </KpiVal>
            <KpiLab>Total mes</KpiLab>
          </KpiItem>
          <KpiSep />
          <KpiItem>
            <KpiVal $color="#43e97b">
              {user?.moneda ?? "$"} {pagados.toLocaleString()}
            </KpiVal>
            <KpiLab>Pagados</KpiLab>
          </KpiItem>
          <KpiSep />
          <KpiItem>
            <KpiVal $color="#ffcb05">
              {user?.moneda ?? "$"} {pendientes.toLocaleString()}
            </KpiVal>
            <KpiLab>Pendientes</KpiLab>
          </KpiItem>
        </KpiRow>
      </Center>

      <Right>
        <UserInfo>
          <UserName>{user?.nombre ?? "Usuario"}</UserName>
          <UserEmail>{user?.email ?? ""}</UserEmail>
        </UserInfo>
        <ThemeBtn
          onClick={() => dispatch(toggleTheme())}
          title={themeMode === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
          $mode={themeMode}
        >
          {themeMode === "dark" ? "☀️" : "🌙"}
        </ThemeBtn>
        <LogoutBtn onClick={handleLogout} title="Cerrar sesión">
          ⏻
        </LogoutBtn>
      </Right>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  height: ${({ theme }) => theme.header.height};
  background: ${({ theme }) => theme.colors.bgHeader};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  box-shadow: ${({ theme }) => theme.colors.shadow};
  transition:
    background 0.3s,
    border-color 0.3s;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;
const HamBtn = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
  span {
    display: block;
    height: 2px;
    background: ${({ theme }) => theme.colors.text2};
    border-radius: 2px;
    transition: background 0.2s;
  }
  &:hover span {
    background: ${({ theme }) => theme.colors.text1};
  }
`;
const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  user-select: none;
`;
const LogoIcon = styled.span`
  font-size: 1.3rem;
`;
const LogoText = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 900;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text1};
  letter-spacing: 0.03em;
  white-space: nowrap;
  transition: color 0.3s;
`;
const Accent = styled.span`
  color: ${({ theme }) => theme.colors.accent};
`;
const Center = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  @media (max-width: 700px) {
    display: none;
  }
`;
const KpiRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const KpiItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const KpiVal = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.9rem;
  color: ${({ $color }) => $color};
  white-space: nowrap;
`;
const KpiLab = styled.span`
  font-size: 0.62rem;
  color: ${({ theme }) => theme.colors.text3};
  text-transform: uppercase;
  letter-spacing: 0.07em;
`;
const KpiSep = styled.div`
  width: 1px;
  height: 28px;
  background: ${({ theme }) => theme.colors.border};
`;
const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;
const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: right;
  @media (max-width: 500px) {
    display: none;
  }
`;
const UserName = styled.span`
  font-family: ${({ theme }) => theme.fonts.head};
  font-weight: 700;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.text1};
  transition: color 0.3s;
`;
const UserEmail = styled.span`
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.text3};
  transition: color 0.3s;
`;

const iconBtn = `
  width:34px;height:34px;border-radius:50%;cursor:pointer;font-size:1rem;
  display:flex;align-items:center;justify-content:center;
  transition:border-color .2s,color .2s,background .2s,transform .2s;
`;
const ThemeBtn = styled.button`
  ${iconBtn}
  border:1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.text2};
  &:hover {
    border-color: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.accent};
    transform: rotate(20deg);
  }
`;
const LogoutBtn = styled.button`
  ${iconBtn}
  border:1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgCard};
  color: ${({ theme }) => theme.colors.text2};
  &:hover {
    border-color: ${({ theme }) => theme.colors.expense};
    color: ${({ theme }) => theme.colors.expense};
  }
`;
