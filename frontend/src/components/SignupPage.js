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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
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

  const validateName = (name) => {
    const namePattern = /^[a-zA-Z]+$/;
    return namePattern.test(name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 4 characters long");
      return;
    }

    if (!validateName(firstName)) {
      setEmailError("First name should contain only alphabets");
      return;
    }

    if (!validateName(lastName)) {
      setEmailError("Last name should contain only alphabets");
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
      setMessage("User Already Exists. Please Login !!");
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateName(value) || value === "") {
                    setFirstName(value);
                  }
                }}
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
                onChange={(e) => {
                  const value = e.target.value;
                  if (validateName(value) || value === "") {
                    setLastName(value);
                  }
                }}
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
                  setEmailError("");
                }}
                required
              />
              {emailError && <p className="error-message">{emailError}</p>}
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
                  setPasswordError("");
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
