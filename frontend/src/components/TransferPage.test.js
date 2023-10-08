import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import TransferPage from "./TransferPage";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("axios");

describe("Transfer Page Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userEmail", "a@a");
  });

  it("should handle successful money transfer", async () => {
    // Mock axios.post to simulate a successful transfer
    const mockPost = jest.spyOn(axios, "post");
    mockPost.mockResolvedValue({ status: 200 });

    render(
      <Router>
        <TransferPage />
      </Router>
    );

    const destinationEmailInput = screen.getByLabelText("Destination Email:");
    const amountInput = screen.getByLabelText("Amount:");
    const transferButton = screen.getByText("Transfer");

    // Fill out the form fields
    fireEvent.change(destinationEmailInput, { target: { value: "b@b" } });
    fireEvent.change(amountInput, { target: { value: "100" } });

    // Submit the form
    fireEvent.click(transferButton);

    // Wait for the success message
    await waitFor(() => {
      const successMessage = screen.getByText("Transfer successful!");
      expect(successMessage).toBeInTheDocument();
    });

    // Ensure that axios.post was called with the correct data
    expect(mockPost).toHaveBeenCalledWith(
      "http://localhost:8080/money-transfer",
      {
        sourceEmail: "a@a",
        destinationEmail: "b@b",
        amount: "100",
      }
    );

    // Clean up the mock
    mockPost.mockRestore();
  });

  it("should display an error message if the amount is less than or equal to 0", async () => {
    render(
      <Router>
        <TransferPage />
      </Router>
    );

    const destinationEmailInput = screen.getByLabelText("Destination Email:");
    const amountInput = screen.getByLabelText("Amount:");
    const transferButton = screen.getByText("Transfer");

    // Fill out the form fields with invalid data
    fireEvent.change(destinationEmailInput, { target: { value: "b@b" } });
    fireEvent.change(amountInput, { target: { value: "0" } });

    // Submit the form
    fireEvent.click(transferButton);

    // Verify that an error message is displayed
    const errorMessage = screen.getByText("Amount must be greater than 0");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display an error message if the destination email is the same as the source email", async () => {
    render(
      <Router>
        <TransferPage />
      </Router>
    );

    const destinationEmailInput = screen.getByLabelText("Destination Email:");
    const amountInput = screen.getByLabelText("Amount:");
    const transferButton = screen.getByText("Transfer");

    fireEvent.change(destinationEmailInput, { target: { value: "a@a" } });
    fireEvent.change(amountInput, { target: { value: "100" } });

    fireEvent.click(transferButton);

    const errorMessage = screen.getByText(
      "Uh oh! You cannot transfer money to yourself."
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
