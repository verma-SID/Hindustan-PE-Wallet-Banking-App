import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/LoginPage.css";
import CustomNavbar from "./CustomNavbar";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // if (rememberMe) {
          localStorage.setItem("userEmail", email);
        // }
        navigate("/dashboard");
      } else {
        setError("Wrong email or password or Server Error");
      }
    } catch (error) {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="login-page-container">
        <div className="login-form">
          <h2 className="login-title">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label" htmlFor="emailInput">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="passwordInput">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Remember Me
              </label>
            </div> */}
            <button type="submit" className="btn btn-primary btn-block">
              Login
            </button>
          </form>
          <div className="text-center mt-3">
            Don't have an account? <a href="/signup">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
