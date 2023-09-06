import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Dashboard from "./components/Dashboard";
import WelcomePage from "./components/WelcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RechargePage from "./components/RechargePage";
import TransferPage from "./components/TransferPage";
import ViewAccountStatement from "./components/ViewAccountStatement";
import CashbackPage from "./components/CashbackPage";
import Logout from "./components/Logout";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />
        <Route
          path="/recharge"
          element={<ProtectedRoute element={<RechargePage />} />}
        />
        <Route
          path="/transfer"
          element={<ProtectedRoute element={<TransferPage />} />}
        />
        <Route
          path="/account-statement"
          element={<ProtectedRoute element={<ViewAccountStatement />} />}
        />
        <Route
          path="/earn"
          element={<ProtectedRoute element={<CashbackPage />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
