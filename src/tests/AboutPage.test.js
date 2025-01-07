import React from "react";
import { render, screen } from "@testing-library/react";
import AboutPage from "../components/AboutPage";

describe("AboutPage Component", () => {
  test("renders the AboutPage component without crashing", () => {
    render(<AboutPage />);
    const titleElement = screen.getByText(/about products inventory/i);
    expect(titleElement).toBeInTheDocument();
  });

  test("displays the correct description about the application", () => {
    render(<AboutPage />);
    const descriptionElement = screen.getByText(/user-friendly platform that allows you to manage your product inventory efficiently/i);
    expect(descriptionElement).toBeInTheDocument();
  });

  test("renders the feature list", () => {
    render(<AboutPage />);
    const featureListItems = screen.getAllByRole("listitem");
    expect(featureListItems).toHaveLength(5);
    expect(featureListItems[0]).toHaveTextContent(/user authentication with firebase/i);
    expect(featureListItems[1]).toHaveTextContent(/real-time product management/i);
  });
});
