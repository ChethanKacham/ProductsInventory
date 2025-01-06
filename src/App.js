import React, { Component, lazy, Suspense } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import InventoryManagement from './components/InventoryManagement';
import { Navigate } from 'react-router-dom';
import ChartComp from './components/ChartComp';
import "./cssStylesheets/auth.css"
import "./cssStylesheets/layout.css"
import "./cssStylesheets/products.css"
const ProductInformation = lazy(() => import('./components/ProductInformation'));
const UserDetails = lazy(() => import('./components/UserDetails'));
const About = lazy(() => import('./components/About'));


class App extends Component {
  render() {
    return (
      <div className="app">
        <ToastContainer />
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route exact path="/" element={<HomePage />} />
              <Route exact path="/login" element={<LoginPage />} />
              <Route exact path="/signup" element={<RegistrationPage />} />
              <Route
                exact
                path="/products"
                element={
                  <ProtectedRoutes>
                    <InventoryManagement />
                  </ProtectedRoutes>
                }
              />
              <Route
                exact
                path="/product/:id"
                element={
                  <ProtectedRoutes>
                    <ProductInformation />
                  </ProtectedRoutes>
                }
              />
              <Route
                exact
                path="/userDetails"
                element={
                  <ProtectedRoutes>
                    <UserDetails />
                  </ProtectedRoutes>
                }
              />
              <Route
                exact
                path="/chart"
                element={
                  <ProtectedRoutes>
                    <ChartComp />
                  </ProtectedRoutes>
                }
              />
              <Route exact path="/about" element={<About />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;

export const ProtectedRoutes = ({ children }) => {
  if (localStorage.getItem('currentUser')) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
};


