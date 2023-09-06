import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom"; // Import useNavigate
import Dashboard from "./Dashboard";

describe("Dashboard Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userEmail", "a@a");
  });

  it("should display Recharge as heading", () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const mainHeading = screen.getByTestId("rechargeItem");
    expect(mainHeading).toHaveTextContent("Recharge Wallet");
  });

  it("should display Transfer as heading", () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const mainHeading = screen.getByTestId("transferItem");
    expect(mainHeading).toHaveTextContent("Transfer Amount");
  });

  it("should display Account Statement as heading", () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );

    const mainHeading = screen.getByTestId("account-statement");
    expect(mainHeading).toHaveTextContent("View Account Statement");
  });
});
