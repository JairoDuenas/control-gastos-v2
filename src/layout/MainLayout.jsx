import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { Header  } from './Header'
import { Sidebar } from './Sidebar'
import { Footer  } from './Footer'

const isMobile = () => window.innerWidth <= 768

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile())
  const toggleSidebar = () => setSidebarOpen(p => !p)
  const closeSidebar  = () => { if (isMobile()) setSidebarOpen(false) }

  return (
    <Shell>
      <Header onToggleSidebar={toggleSidebar} />
      <Body>
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />
        <Main $open={sidebarOpen}>
          <Outlet />
        </Main>
      </Body>
      <Footer />
    </Shell>
  )
}

const Shell = styled.div`display: flex; flex-direction: column; min-height: 100vh;`

const Body = styled.div`
  display: flex; flex: 1;
  padding-top: ${({ theme }) => theme.header.height};
  padding-bottom: ${({ theme }) => theme.footer.height};
`

const Main = styled.main`
  flex: 1;
  margin-left: ${({ theme, $open }) => $open ? theme.sidebar.width : theme.sidebar.collapsed};
  transition: margin-left 0.28s ease;
  padding: 28px 24px 40px;
  min-height: calc(100vh - ${({ theme }) => theme.header.height} - ${({ theme }) => theme.footer.height});
  @media (max-width: 768px) { margin-left: 0; padding: 18px 14px 32px; }
`
