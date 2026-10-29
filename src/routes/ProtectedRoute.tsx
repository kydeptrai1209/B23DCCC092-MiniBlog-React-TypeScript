import { Navigate, Outlet, useLocation } from "react-router-dom";
import { User } from "../types";

interface ProtectedRouteProps {
  user: User | null;
}

export default function ProtectedRoute({ user }: ProtectedRouteProps) {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
