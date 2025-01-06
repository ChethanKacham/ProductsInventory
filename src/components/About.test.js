import React from "react";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import About from "./About";
import { render, screen } from "@testing-library/react";

describe("About Page for Snapshot Testing", () => {
  test("Snapshot testing", () => {
    const component = renderer.create(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("About Page using RTL", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );
  });

  test("renders About page", () => {
    screen.debug();
  });

  test("renders correct heading for About Page", () => {
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("About");
  });
});
