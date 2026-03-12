import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MainLayout } from "../layout/MainLayout";
import { LoginPage } from "../pages/LoginPage";
import { AuthCallback } from "../pages/AuthCallback";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { MovimientosPage } from "../pages/MovimientosPage";
import { CategoriasPage } from "../pages/CategoriasPage";
import { ConfigPage } from "../pages/ConfigPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { AuthLoadingScreen } from "../providers/AuthProvider";

/**
 * PrivateRoute — protege las rutas que requieren sesión.
 *
 * Tres estados posibles:
 *  1. loading === true  → muestra spinner (AuthProvider aún verifica sesión)
 *  2. isLoggedIn        → renderiza la ruta protegida
 *  3. !isLoggedIn       → redirige a /login
 *
 * El chequeo de loading evita el "flash" de /login que ocurría
 * en la versión anterior mientras Supabase verificaba la sesión.
 */
function PrivateRoute({ children }) {
  const { isLoggedIn, loading } = useSelector((s) => s.auth);

  if (loading) return <AuthLoadingScreen />;
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Rutas privadas */}
      <Route
        element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/movimientos" element={<MovimientosPage />} />
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/config" element={<ConfigPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
