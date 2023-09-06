import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom"; // Import useNavigate
import SignupPage from "./SignupPage";

describe("Signup Page Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userEmail", "a@a");
  });

  it("should display 'Signup' as heading", () => {
    render(
      <Router>
        <SignupPage />
      </Router>
    );

    const mainHeading = screen.getByTestId("signup");
    expect(mainHeading).toHaveTextContent("Signup");
  });
});
