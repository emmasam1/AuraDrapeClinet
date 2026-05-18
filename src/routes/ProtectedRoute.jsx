import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useApp();

  const isAuth =
    user || sessionStorage.getItem("user");

  return isAuth ? (
    children
  ) : (
    <Navigate to="/" replace />
  );
};

export default ProtectedRoute;