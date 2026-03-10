import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MainLayout } from "../layout/MainLayout";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { HomePage } from "../pages/HomePage";
import { MovimientosPage } from "../pages/MovimientosPage";
import { CategoriasPage } from "../pages/CategoriasPage";
import { ConfigPage } from "../pages/ConfigPage";
import { NotFoundPage } from "../pages/NotFoundPage";

function PrivateRoute({ children }) {
  const isLoggedIn = useSelector((s) => s.auth.isLoggedIn);
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
