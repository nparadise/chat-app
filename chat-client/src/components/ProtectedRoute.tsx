import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate } from "react-router";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
  }, [loading, user, navigate]);

  return user ? <Outlet /> : <p>Loading...</p>;
};

export default ProtectedRoute;
