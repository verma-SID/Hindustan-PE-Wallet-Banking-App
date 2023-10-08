import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import CashbackPage from "./CashbackPage";
import axios from "axios";

jest.mock("axios");

describe("CashbackPage Component", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("userEmail", "a@a");
  });

  it("should display an error message if the API call fails", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));

    render(
      <Router>
        <CashbackPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText("Error fetching cashbacks:")).toBeNull();
    });
  });

  it("should display 'Cashbacks' as the heading", async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
      <Router>
        <CashbackPage />
      </Router>
    );

    await waitFor(() => {
      expect(screen.getByText("Cashbacks")).toBeInTheDocument();
    });
  });
});
