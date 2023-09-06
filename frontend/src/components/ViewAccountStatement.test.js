import React from "react";
import { render, screen } from "@testing-library/react";
import ViewAccountStatement from "./ViewAccountStatement";
import { BrowserRouter as Router, useNavigate } from "react-router-dom"; 


describe("View Account Component", () => {
    beforeEach(() => {
      localStorage.clear();
      localStorage.setItem("userEmail", "a@a");
    });
    
    it("should display 'Wallet Banking App' as heading", () => {
      render(
        <Router>
          <ViewAccountStatement />
        </Router>
      );
  
      const mainHeading = screen.getByTestId("View");
      expect(mainHeading).toHaveTextContent("Account Statement");
    });
  });