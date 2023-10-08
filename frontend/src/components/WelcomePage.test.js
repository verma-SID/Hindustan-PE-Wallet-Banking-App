import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import WelcomePage from "./WelcomePage";

// Mock the react-router-dom module
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

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

  it("should navigate to '/recharge' when 'Recharge' card is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <Router>
        <WelcomePage />
      </Router>
    );

    const rechargeCard = screen.getByText("Recharge");
    fireEvent.click(rechargeCard);

    expect(navigate).toHaveBeenCalledWith("/recharge");
  });

  it("should navigate to '/transfer' when 'Transfer' card is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <Router>
        <WelcomePage />
      </Router>
    );

    const transferCard = screen.getByText("Transfer");
    fireEvent.click(transferCard);

    expect(navigate).toHaveBeenCalledWith("/transfer");
  });

  it("should navigate to '/account-statement' when 'Account statement' card is clicked", () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    render(
      <Router>
        <WelcomePage />
      </Router>
    );

    const accountStatementCard = screen.getByText("Account statement");
    fireEvent.click(accountStatementCard);

    expect(navigate).toHaveBeenCalledWith("/account-statement");
  });
});
