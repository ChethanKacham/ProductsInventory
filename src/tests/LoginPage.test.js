import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../components/LoginPage";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";

// Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe("LoginPage Component", () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  test("renders LoginPage without crashing", () => {
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test("renders error message when email and password are incorrect", async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error("Invalid credentials"));
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });

  test("redirects to home page on successful login", async () => {
    signInWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "12345", email: "test@example.com" },
    });
    const loginButton = screen.getByRole("button", { name: /login/i });
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "correctpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        uid: "12345",
        email: "test@example.com",
      });
    });
  });

  test("renders register link", () => {
    const registerLink = screen.getByText(/register here/i);
    expect(registerLink).toHaveAttribute("href", "/register");
  });

  test("renders home link", () => {
    const homeLink = screen.getByText(/go back to home/i);
    expect(homeLink).toHaveAttribute("href", "/");
  });

  test("email input works correctly", () => {
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  test("password input works correctly", () => {
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    expect(passwordInput).toHaveValue("mypassword");
  });

  test("disables login button while processing login", async () => {
    signInWithEmailAndPassword.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 2000))
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "mypassword" } });
    fireEvent.click(loginButton);

    expect(loginButton).toBeDisabled();

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
  });
});