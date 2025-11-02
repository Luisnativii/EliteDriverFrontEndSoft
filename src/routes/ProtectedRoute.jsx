import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();


  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, redirigir a la pagina principal
  if (!user || !user.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (requiredRole) {
    const userRouteRole = user.routeRole; // "admin" o "customer"

    
    if (userRouteRole !== requiredRole) {
      // Redirigir al dashboard correspondiente al rol del usuario
      return <Navigate to={`/${userRouteRole}`} replace />;
    }
  }

  // Si hay children, renderizar children, si no, renderizar Outlet para nested routes
  return children || <Outlet />;
};

export default ProtectedRoute;