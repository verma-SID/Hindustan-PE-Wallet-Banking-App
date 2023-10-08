import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewAccountStatement from "./ViewAccountStatement";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

jest.mock("axios");

describe("View Account Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userEmail", "a@a");
  });

  it("should display 'Account Statement' as heading", () => {
    render(
      <Router>
        <ViewAccountStatement />
      </Router>
    );

    const mainHeading = screen.getByText("Account Statement");
    expect(mainHeading).toBeInTheDocument();
  });

  it("should fetch and display account transactions", async () => {
    const transactions = [
      {
        type: "Deposit",
        localDateTime: "2023-09-13T10:30:00",
        amount: 100,
        userEmail: "a@a",
      },
      {
        type: "Withdrawal",
        localDateTime: "2023-09-12T15:45:00",
        amount: 50,
        userEmail: "a@a",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: transactions });

    render(
      <Router>
        <ViewAccountStatement />
      </Router>
    );

    await waitFor(() => {
      const transactionRows = screen.getAllByRole("row");
      expect(transactionRows).toHaveLength(3); 
    });
  });

  it("should handle sending account statement successfully", async () => {
    const transactions = [
      {
        type: "Deposit",
        localDateTime: "2023-09-13T10:30:00",
        amount: 100,
        userEmail: "a@a",
      },
      {
        type: "Withdrawal",
        localDateTime: "2023-09-12T15:45:00",
        amount: 50,
        userEmail: "a@a",
      },
    ];

    axios.get.mockResolvedValueOnce({ data: transactions });

    render(
      <Router>
        <ViewAccountStatement />
      </Router>
    );

    const sendButton = await screen.findByText(
      "Send Account Statement on Mail",
      {},
      { timeout: 5000 }
    );
    fireEvent.click(sendButton);

    await waitFor(() => {
      const successMessage = screen.getByText(
        "Account statement sent successfully."
      );
      expect(successMessage).toBeInTheDocument();
    });
  });

  it("should not render 'Send Account Statement on Mail' button when there are no transactions", () => {
    const transactions = []; // Empty transactions

    axios.get.mockResolvedValueOnce({ data: transactions });

    render(
      <Router>
        <ViewAccountStatement />
      </Router>
    );

    const sendButton = screen.queryByText("Send Account Statement on Mail");
    expect(sendButton).not.toBeInTheDocument();
  });
});
