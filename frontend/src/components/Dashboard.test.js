import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Dashboard from "./Dashboard";
import axios from "axios";

jest.mock("axios");

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

  it("should navigate to /recharge when Recharge Wallet item is clicked", () => {
    const { getByTestId } = render(
      <Router>
        <Dashboard />
      </Router>
    );

    const rechargeItem = getByTestId("rechargeItem");
    fireEvent.click(rechargeItem);

    expect(window.location.pathname).toBe("/recharge");
  });

  it("should navigate to /transfer when Transfer Amount item is clicked", () => {
    const { getByTestId } = render(
      <Router>
        <Dashboard />
      </Router>
    );

    const transferItem = getByTestId("transferItem");
    fireEvent.click(transferItem);

    expect(window.location.pathname).toBe("/transfer");
  });

  it("should navigate to /account-statement when View Account Statement item is clicked", () => {
    const { getByTestId } = render(
      <Router>
        <Dashboard />
      </Router>
    );

    const accountStatementItem = getByTestId("account-statement");
    fireEvent.click(accountStatementItem);

    expect(window.location.pathname).toBe("/account-statement");
  });
});
