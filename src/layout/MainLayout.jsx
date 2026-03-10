import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

const isMobile = () => window.innerWidth <= 768;

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile());

  // ✅ Cierra el sidebar automáticamente al redimensionar a mobile
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((p) => !p);
  const closeSidebar = () => {
    if (isMobile()) setSidebarOpen(false);
  };

  return (
    <Shell>
      <Header onToggleSidebar={toggleSidebar} />
      <Body>
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        {/* ✅ Overlay para cerrar sidebar al tocar fuera en mobile */}
        {sidebarOpen && <Overlay onClick={closeSidebar} />}

        <Main $open={sidebarOpen}>
          <Outlet />
        </Main>
      </Body>
      <Footer />
    </Shell>
  );
}

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* ✅ Evita overflow horizontal global */
  overflow-x: hidden;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  padding-top: ${({ theme }) => theme.header.height};
  padding-bottom: ${({ theme }) => theme.footer.height};
  /* ✅ Necesario para que el Main no se desborde */
  overflow-x: hidden;
`;

/* ✅ Overlay semitransparente que aparece detrás del sidebar en mobile */
const Overlay = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 90; /* debajo del sidebar, encima del contenido */
  }
`;

const Main = styled.main`
  flex: 1;
  /* ✅ min-width: 0 es clave — sin esto flex ignora el ancho disponible */
  min-width: 0;
  margin-left: ${({ theme, $open }) =>
    $open ? theme.sidebar.width : theme.sidebar.collapsed};
  transition: margin-left 0.28s ease;
  padding: 28px 24px 40px;
  min-height: calc(
    100vh -
      ${({ theme }) => theme.header.height}-${({ theme }) =>
        theme.footer.height}
  );

  @media (max-width: 768px) {
    /* ✅ En mobile el sidebar flota (position fixed/absolute), no empuja el Main */
    margin-left: 0 !important;
    padding: 18px 14px 32px;
    width: 100%;
  }
`;
