import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import RechargePage from "./RechargePage";

jest.mock("axios");

describe("RechargePage Component", () => {
  it("should handle successful wallet recharge", async () => {
    // Mock a successful API response
    axios.post.mockResolvedValue({
      data: "Wallet recharged successfully",
    });

    render(
      <Router>
        <RechargePage />
      </Router>
    );

    const amountInput = screen.getByLabelText("Amount:");
    fireEvent.change(amountInput, { target: { value: "100" } });

    const rechargeButton = screen.getByText("Recharge");
    fireEvent.click(rechargeButton);

    const successMessage = await screen.findByText(
      "Wallet recharged successfully"
    );

    expect(successMessage).toBeInTheDocument();
  });

  it("should display an error message for invalid amount", async () => {
    axios.post.mockResolvedValue({
      data: "Invalid amount",
    });

    render(
      <Router>
        <RechargePage />
      </Router>
    );
    const amountInput = screen.getByLabelText("Amount:");
    fireEvent.change(amountInput, { target: { value: "0" } });

    const rechargeButton = screen.getByText("Recharge");
    fireEvent.click(rechargeButton);

    const errorMessage = await screen.findByText(
      "Amount must be greater than 0"
    );

    expect(errorMessage).toBeInTheDocument();
  });
});
