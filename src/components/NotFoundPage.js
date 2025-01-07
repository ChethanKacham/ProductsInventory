import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! The page you're looking for does not exist.</p>
      <button className="go-home-button" onClick={() => navigate("/")}>
        Go to Home
      </button>
    </div>
  );
}

export default NotFoundPage;
