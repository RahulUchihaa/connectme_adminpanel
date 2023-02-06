import { Navigate, useLocation } from "react-router-dom"; // for import react dom navigation components

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();

  if (isAuthenticated === null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else {
    if (isAuthenticated === "true") {
      return children;
    } else {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
  }
}
export default ProtectedRoute;
