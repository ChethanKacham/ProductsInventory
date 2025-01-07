import React from "react";
import "../styles/Layout.css";
import HeaderNavBar from "./HeaderNavBar";
import Footer from "./Footer";

function Layout({ children, loading }) {
  return (
    <div className="layout">
      <div className="content">{loading ? <div className="loader">Loading...</div> : children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
