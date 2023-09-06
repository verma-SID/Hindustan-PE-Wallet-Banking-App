import React, { useState } from "react";
import axios from "axios";
import "../css/SignupPage.css";
import CustomNavbar from "./CustomNavbar";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState(""); // New state variable for email error
  const [passwordError, setPasswordError] = useState(""); // New state variable for password error
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Very basic email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    // Check if the password is at least 4 characters long
    return password.length >= 4;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email and password
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 4 characters long");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/register", {
        firstName,
        lastName,
        email,
        password,
      });

      setIsSignupSuccess(true);
      setMessage(response.data);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setEmailError(""); 
      setPasswordError(""); 

      window.alert("Successfully signed up! Redirecting to LoginPage...");

      navigate("/login");
    } catch (error) {
      setMessage("Error occurred during registration");
    }
  };

  return (
    <div>
      <CustomNavbar />
      <div className="signup-page-container">
        <div className="signup-form">
          <h2 className="signup-title" data-testid="signup">
            Signup
          </h2>
          {isSignupSuccess && (
            <p className="success-message">Successfully signed up!</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" data-testid="firstname">
                First Name:
              </label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" data-testid="lastname">
                Last Name:
              </label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" data-testid="email">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(""); // Clear email error on change
                }}
                required
              />
              {emailError && (
                <p className="error-message">{emailError}</p>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" data-testid="password">
                Password:
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(""); // Clear password error on change
                }}
                required
              />
              {passwordError && (
                <p className="error-message">{passwordError}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Register
            </button>
          </form>
          <p className="mt-3">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
