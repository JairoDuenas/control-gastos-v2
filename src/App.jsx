import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AppRouter } from "./router/AppRouter";
import { AuthProvider } from "./providers/AuthProvider";
import { useSyncData } from "./hooks/useSyncData";

/**
 * SyncProvider — componente puente para montar useSyncData dentro
 * del árbol de Redux + Router. No renderiza nada visible.
 */
function SyncProvider() {
  useSyncData();
  return null;
}

function ThemedApp() {
  const themeMode = useSelector((s) => s.ui.themeMode);
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <SyncProvider />
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default ThemedApp;
