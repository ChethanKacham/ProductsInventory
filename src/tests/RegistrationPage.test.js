import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RegistrationPage from "../components/RegistrationPage";
import { AuthContext } from "../context/AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc } from "firebase/firestore";

// Mock Firebase Auth and Firestore functions
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

describe("RegistrationPage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(
      <AuthContext.Provider value={{ login: jest.fn() }}>
        <BrowserRouter>
          <RegistrationPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );
  });

  test("renders the component without crashing", () => {
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test("validates fields and displays error messages", async () => {
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
  });
  
  test("renders input fields for all required data", () => {
    expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
  });

  test("renders the submit button", () => {
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("validates fields and displays error messages", async () => {
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/valid email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(await screen.findByText(/mobile number must be exactly 10 digits/i)).toBeInTheDocument();
    expect(await screen.findByText(/location is required/i)).toBeInTheDocument();
  });

  test("displays error for weak password", async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/weak-password",
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
    });
  });

  test("displays error for duplicate email", async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({
      code: "auth/email-already-in-use",
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "duplicate@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "StrongPass1@" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/an account with this email already exists/i)).toBeInTheDocument();
    });
  });

  test("handles successful registration", async () => {
    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "12345", email: "test@example.com" },
    });
    setDoc.mockResolvedValueOnce();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "StrongPass1@" },
    });
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/location/i), {
      target: { value: "Test City" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalled();
      expect(screen.queryByText(/register/i)).not.toBeInTheDocument();
    });
  });

  test("allows input for all fields", () => {
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const mobileInput = screen.getByPlaceholderText(/mobile number/i);
    const locationInput = screen.getByPlaceholderText(/location/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "StrongPass1@" } });
    fireEvent.change(firstNameInput, { target: { value: "Test" } });
    fireEvent.change(lastNameInput, { target: { value: "User" } });
    fireEvent.change(mobileInput, { target: { value: "1234567890" } });
    fireEvent.change(locationInput, { target: { value: "Test City" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("StrongPass1@");
    expect(firstNameInput).toHaveValue("Test");
    expect(lastNameInput).toHaveValue("User");
    expect(mobileInput).toHaveValue("1234567890");
    expect(locationInput).toHaveValue("Test City");
  });

  test("navigates to login page on successful registration", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

    createUserWithEmailAndPassword.mockResolvedValueOnce({
      user: { uid: "12345", email: "test@example.com" },
    });
    setDoc.mockResolvedValueOnce();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "StrongPass1@" },
    });
    fireEvent.change(screen.getByPlaceholderText(/first name/i), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByPlaceholderText(/last name/i), {
      target: { value: "User" },
    });
    fireEvent.change(screen.getByPlaceholderText(/mobile number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/location/i), {
      target: { value: "Test City" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});