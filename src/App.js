import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegistrationPage from "./components/RegistrationPage";
import ProductInformation from "./components/ProductInformation";
import UserDetails from "./components/UserDetails";
import ChartComp from "./components/ChartComp";
import InventoryManagement from "./components/InventoryManagement";
import NotFoundPage from "./components/NotFoundPage";
import HeaderNavBar from "./components/HeaderNavBar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import AboutPage from "./components/AboutPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <HeaderNavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/product/:id"
            element={
              <PrivateRoute>
                <ProductInformation />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <UserDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/charts"
            element={
              <PrivateRoute>
                <ChartComp />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <InventoryManagement />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
