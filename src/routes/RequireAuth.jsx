import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PATHS } from "./paths";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!user) {
    return (
      <Navigate
        to={PATHS.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

  return children ? children : <Outlet />;
}
