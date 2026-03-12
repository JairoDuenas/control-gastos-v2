import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useSelector } from "react-redux";
import { darkTheme, lightTheme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import { AppRouter } from "./router/AppRouter";
import { AuthProvider } from "./providers/AuthProvider";

/**
 * App actualizado:
 * AuthProvider se monta dentro de BrowserRouter (para que en el futuro
 * pueda usar navigate si se necesita) y dentro de ThemeProvider (para
 * que AuthLoadingScreen acceda al tema).
 *
 * Orden: Redux Provider (main.jsx) → ThemeProvider → BrowserRouter
 *        → AuthProvider → AppRouter
 */
function ThemedApp() {
  const themeMode = useSelector((s) => s.ui.themeMode);
  const theme = themeMode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default ThemedApp;
