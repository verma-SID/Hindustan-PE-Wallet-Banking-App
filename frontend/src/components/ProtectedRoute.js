import React from "react";
import { Navigate } from "react-router-dom";

const checkIsAuthenticated = () => {
  return localStorage.getItem("userEmail") !== null;
};

function ProtectedRoute({ element }) {
  const isAuthenticated = checkIsAuthenticated(); 

  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default ProtectedRoute;
