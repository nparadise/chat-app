import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Outlet, useNavigate } from "react-router";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
