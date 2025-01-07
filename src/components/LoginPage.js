import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth"; // Import Firebase auth method
import { auth } from "../firebaseConfig"; // Import the configured Firebase auth instance
import "../styles/LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Pass the logged-in user to the AuthContext
      login(user);

      // Redirect to the homepage
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <h2 className="text-center">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
      <div className="links">
        <p>
          Don't have an account? <a href="/register">Register here</a>.
        </p>
        <p>
          Go back to <a href="/">Home</a>.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
