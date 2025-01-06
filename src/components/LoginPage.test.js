import React from "react";
import LoginPage from "./LoginPage";
import { BrowserRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-lYvMOUOHFqCpgCWosBAMOhKNGbxG66o",
  authDomain: "fdreactcapstone.firebaseapp.com",
  projectId: "fdreactcapstone",
  storageBucket: "fdreactcapstone.appspot.com",
  messagingSenderId: "506783732230",
  appId: "1:506783732230:web:bad2e765451a4c8c539ef5",
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);

describe("Login Page for Snapshot Testing", () => {
  test("Snapshot testing", () => {
    const component = renderer.create(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Login Page using RTL", () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  });

  test("renders Login page", () => {
    screen.debug();
  });

  test("routing to Register Page is available", () => {
    const linkRegister = screen.getByRole("link", {
      name: "Click Here To Register",
    });
    expect(linkRegister).toBeInTheDocument();
  });

  test("routing to Home Page is available", () => {
    const linkHome = screen.getByRole("link", {
      name: "Click Here for Home Page",
    });
    expect(linkHome).toBeInTheDocument();
  });

  test("renders correct heading for Login Page", () => {
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent("Login");
  });

  test("renders submit button for Login Form", () => {
    const buttonLogin = screen.getByRole("button", { name: "Login" });
    expect(buttonLogin).toHaveTextContent("Login");
  });
});
