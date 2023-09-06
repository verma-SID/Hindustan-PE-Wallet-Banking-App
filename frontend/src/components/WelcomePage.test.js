import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom"; // Import useNavigate
import WelcomePage from "./WelcomePage";

describe("WelcomePage Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userEmail", "a@a");
  });
  
  it("should display 'Wallet Banking App' as heading", () => {
    render(
      <Router>
        <WelcomePage />
      </Router>
    );

    const mainHeading = screen.getByTestId("welcome");
    expect(mainHeading).toHaveTextContent("Wallet Banking App");
  });
});
