import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import renderer from "react-test-renderer";
import { AuthContext } from "../context/AuthContext";

// Mock Auth Context
const mockAuthContext = {
  currentUser: { uid: "12345", email: "test@example.com" },
  login: jest.fn(),
  logout: jest.fn(),
};

describe("App Component", () => {
  test("matches snapshot", () => {
    const component = renderer.create(
      <AuthContext.Provider value={mockAuthContext}>
        <App />
      </AuthContext.Provider>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders HeaderNavBar and Footer components", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/products inventory/i)).toBeInTheDocument(); // HeaderNavBar
    expect(screen.getByText(/footer/i)).toBeInTheDocument(); // Footer
  });

  test("renders HomePage for root route", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/welcome to products inventory/i)).toBeInTheDocument(); // Assuming HomePage has this text
  });

  test("renders LoginPage component", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <App />
      </AuthContext.Provider>
    );

    expect(screen.getByText(/login/i)).toBeInTheDocument(); // LoginPage heading or button
  });

  test("renders NotFoundPage for invalid routes", () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <App />
      </AuthContext.Provider>
    );

    // Assuming NotFoundPage renders this text
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
