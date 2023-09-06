import React from "react";
import {  Navigate } from "react-router-dom";

const checkIsAuthenticated = () => {
    // Check if user data is available in local storage or global state
    // Return true if authenticated, false otherwise
    return localStorage.getItem('userEmail') !== null;
  };

function ProtectedRoute({ element }) {
  // Replace this with your authentication check logic
  const isAuthenticated = checkIsAuthenticated(); // Set to true if the user is authenticated

  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default ProtectedRoute;
