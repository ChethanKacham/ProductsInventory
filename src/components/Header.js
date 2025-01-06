import React, { useEffect, useState } from "react";
import { FaBars, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { fireDB, auth } from "../firebaseConfig";

function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  // Fetch user details from local storage
  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      const userId = JSON.parse(localStorage.getItem("currentUser")).user.id;
      getDoc(doc(fireDB, "users", userId)).then((docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data());
          setLoggedIn(true);
        }
      });
    }
  }, []);

  const logout = () => {
    let answer = window.confirm("Are you sure you want to logout?");
    if (answer) {
      localStorage.removeItem("currentUser");
      window.location.reload();
    }
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Products Inventory
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <FaBars size={25} color="white" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              {loggedIn && (
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/userDetails"
                  >
                    <FaUser /> {user.email.substring(0, user.email.length - 10).toUpperCase()}
                  </Link>
                </li>
              )}
              {loggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    Products
                  </Link>
                </li>
              )}
              {loggedIn ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={logout}>
                    Logout
                  </Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
