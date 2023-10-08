import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./LoginPage";
import { MemoryRouter, BrowserRouter as Router } from "react-router-dom";

describe("LoginPage Component", () => {
  it("should render the login page", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeInTheDocument();
  });

  it("should allow entering email and password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText("Email:");
    const passwordInput = screen.getByLabelText("Password:");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });
});

it("should display an error message for invalid email or password", async () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  const loginButton = screen.getByRole("button", { name: "Login" });
  fireEvent.click(loginButton);

  await waitFor(() => {
    const errorMessage = screen.getByText(/Invalid email or password/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
