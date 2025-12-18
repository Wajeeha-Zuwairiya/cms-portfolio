import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    api
      .getMe()
      .then(() => setAuthorized(true))
      .catch(() => setAuthorized(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return authorized ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
