import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom"; // Import useNavigate
import TransferPage from "./TransferPage";


describe("Transfer Page Component", () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem("userEmail", "a@a");
    });
    
    it("should display 'Wallet Banking App' as heading", () => {
      render(
        <Router>
          <TransferPage />
        </Router>
      );
  
      const mainHeading = screen.getByTestId("transfer");
      expect(mainHeading).toHaveTextContent("Transfer Funds");
    });
  });